import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { nanoid } from 'nanoid'
import { sha256Hex } from './storage/crypto.js'
import { ensureStorageReady, getChannel, listMessages, listMessagesAfter, upsertChannel, appendMessage, clearChannelMessages } from './storage/store.js'
import type { ChannelRecord, MessageRecord, MessageType } from './storage/types.js'

// Simple in-memory cache to prevent duplicate messages (store last 1000 IDs)
const processedMsgIds = new Set<string>()
const MAX_CACHE_SIZE = 1000

// Presence tracking via heartbeats
const HEARTBEAT_TIMEOUT = 30000 // 30 seconds
const userLastHeartbeat = new Map<string, { time: number, channelId: string, selfName: string }>()

function addToCache(id: string) {
  processedMsgIds.add(id)
  if (processedMsgIds.size > MAX_CACHE_SIZE) {
    const firstItem = processedMsgIds.values().next().value
    if (firstItem) processedMsgIds.delete(firstItem)
  }
}

type JoinPayload = {
  selfName: string
  peerName: string
  passphrase: string
}

type JoinAckOk = { ok: true; channelId: string; history: MessageRecord[]; serverTime: number }
type JoinAckFail = { ok: false; message: string }
type JoinAck = (res: JoinAckOk | JoinAckFail) => void

type SendPayload = {
  channelId: string
  clientMsgId: string
  type: MessageType
  text?: string
  mediaUrl?: string
  thumbUrl?: string
  mime?: string
  size?: number
  createdAtClient?: number
  quote?: {
    id: string
    senderName: string
    text: string
    createdAtServer: number
  }
}

type SendAckOk = { ok: true; serverMsgId: string; createdAtServer: number }
type SendAckFail = { ok: false; message: string }
type SendAck = (res: SendAckOk | SendAckFail) => void

type ClearAckOk = { ok: true }
type ClearAckFail = { ok: false; message: string }
type ClearAck = (res: ClearAckOk | ClearAckFail) => void

function createChannelId(nameA: string, nameB: string, passphrase: string): string {
  const sorted = [nameA, nameB].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  return sha256Hex(`${sorted[0]}\u0000${sorted[1]}\u0000${passphrase}`)
}

function normalizeString(v: unknown): string {
  if (typeof v !== 'string') return ''
  return v
}

export function initSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  })

  // Cleanup offline users based on heartbeats
  setInterval(() => {
    const now = Date.now()
    for (const [socketId, data] of userLastHeartbeat.entries()) {
      if (now - data.time > HEARTBEAT_TIMEOUT) {
        userLastHeartbeat.delete(socketId)
        
        // Double check if user has other active connections
        let stillOnline = false
        const clients = io.sockets.adapter.rooms.get(data.channelId)
        if (clients) {
          for (const cid of clients) {
            if (userLastHeartbeat.has(cid) && userLastHeartbeat.get(cid)?.selfName === data.selfName) {
              stillOnline = true
              break
            }
          }
        }

        if (!stillOnline) {
          io.to(data.channelId).emit('presence:update', { 
            channelId: data.channelId, 
            senderName: data.selfName, 
            online: false 
          })
        }
      }
    }
  }, 10000)

  io.on('connection', (socket) => {
    socket.data.joined = { channelId: '', selfName: '' }

    socket.on('channel:join', async (payload: JoinPayload, ack?: JoinAck) => {
      const selfName = normalizeString(payload?.selfName)
      const peerName = normalizeString(payload?.peerName)
      const passphrase = normalizeString(payload?.passphrase)

      if (!selfName || !peerName || !passphrase || passphrase.length < 2 || passphrase.length > 20) {
        ack?.({ ok: false, message: '匹配失败，请检查名字或暗号是否正确' })
        return
      }

      await ensureStorageReady()

      const channelId = createChannelId(selfName, peerName, passphrase)
      const passphraseHash = sha256Hex(passphrase)

      const existing = await getChannel(channelId)
      if (existing) {
        const namesOk =
          (existing.nameA === selfName && existing.nameB === peerName) ||
          (existing.nameA === peerName && existing.nameB === selfName)
        const passOk = existing.passphraseHash === passphraseHash
        if (!namesOk || !passOk) {
          ack?.({ ok: false, message: '匹配失败，请检查名字或暗号是否正确' })
          return
        }
        await upsertChannel({ ...existing, updatedAt: Date.now() })
      } else {
        const record: ChannelRecord = {
          channelId,
          nameA: selfName,
          nameB: peerName,
          passphraseHash,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        await upsertChannel(record)
      }

      await socket.join(channelId)
      socket.data.joined = { channelId, selfName }
      userLastHeartbeat.set(socket.id, { time: Date.now(), channelId, selfName })

      // Notify others about presence
      io.to(channelId).emit('presence:update', { channelId, senderName: selfName, online: true })

      const history = await listMessages(channelId, 50)
      ack?.({ ok: true, channelId, history, serverTime: Date.now() })
    })

    socket.on('channel:presence', (payload: { channelId: string }, ack?: (res: { ok: boolean; onlineUsers: string[] }) => void) => {
      const channelId = normalizeString(payload?.channelId)
      if (!channelId) {
        ack?.({ ok: false, onlineUsers: [] })
        return
      }

      const clients = io.sockets.adapter.rooms.get(channelId)
      const onlineUsers: string[] = []
      if (clients) {
        for (const clientId of clients) {
          const clientSocket = io.sockets.sockets.get(clientId)
          if (clientSocket?.data?.joined?.selfName) {
            onlineUsers.push(clientSocket.data.joined.selfName)
          }
        }
      }
      ack?.({ ok: true, onlineUsers })
    })

    socket.on('disconnect', () => {
      const { channelId, selfName } = socket.data.joined || {}
      userLastHeartbeat.delete(socket.id)
      
      if (channelId && selfName) {
        // Check if user has other tabs/sockets open in the same channel
        const clients = io.sockets.adapter.rooms.get(channelId)
        let stillOnline = false
        if (clients) {
          for (const clientId of clients) {
            if (userLastHeartbeat.has(clientId) && userLastHeartbeat.get(clientId)?.selfName === selfName) {
              stillOnline = true
              break
            }
          }
        }

        if (!stillOnline) {
          io.to(channelId).emit('presence:update', { channelId, senderName: selfName, online: false })
        }
      }
    })

    socket.on('channel:history', async (payload: { channelId: string; beforeTime?: number; limit?: number }, ack?: (res: { ok: boolean; history?: MessageRecord[]; message?: string }) => void) => {
      const joinedChannelId = normalizeString(socket.data?.joined?.channelId)
      const channelId = normalizeString(payload?.channelId)
      if (!joinedChannelId || joinedChannelId !== channelId) {
        ack?.({ ok: false, message: '操作失败' })
        return
      }

      const limit = typeof payload?.limit === 'number' ? Math.min(payload.limit, 100) : 50
      const beforeTime = typeof payload?.beforeTime === 'number' ? payload.beforeTime : undefined

      try {
        const history = await listMessages(channelId, limit, beforeTime)
        ack?.({ ok: true, history })
      } catch (e) {
        console.error('History fetch error:', e)
        ack?.({ ok: false, message: '获取历史记录失败' })
      }
    })

    socket.on('message:send', async (payload: SendPayload, ack?: SendAck) => {
      const joinedChannelId = normalizeString(socket.data?.joined?.channelId)
      const senderName = normalizeString(socket.data?.joined?.selfName)
      const channelId = normalizeString(payload?.channelId)

      if (!joinedChannelId || joinedChannelId !== channelId || !senderName) {
        ack?.({ ok: false, message: '发送失败' })
        return
      }

      const clientMsgId = normalizeString(payload?.clientMsgId)
      const type = payload?.type

      if (!clientMsgId || (type !== 'text' && type !== 'image' && type !== 'video')) {
        ack?.({ ok: false, message: '发送失败' })
        return
      }

      // Check for duplicates
      if (processedMsgIds.has(clientMsgId)) {
        console.log(`Duplicate message skipped: ${clientMsgId}`)
        // Return success so client stops retrying
        ack?.({ ok: true, serverMsgId: 'DUPLICATE', createdAtServer: Date.now() })
        return
      }
      addToCache(clientMsgId)

      const text = normalizeString(payload?.text)
      const mediaUrl = normalizeString(payload?.mediaUrl)
      const thumbUrl = normalizeString(payload?.thumbUrl)
      const mime = normalizeString(payload?.mime)
      const size = typeof payload?.size === 'number' ? payload.size : undefined
      const createdAtClient = typeof payload?.createdAtClient === 'number' ? payload.createdAtClient : undefined
      const quote = payload?.quote

      if (type === 'text' && !text) {
        ack?.({ ok: false, message: '发送失败' })
        return
      }
      if ((type === 'image' || type === 'video') && !mediaUrl) {
        ack?.({ ok: false, message: '发送失败' })
        return
      }

      const message: MessageRecord = {
        id: nanoid(),
        channelId,
        clientMsgId,
        senderName,
        type,
        text: type === 'text' ? text : undefined,
        mediaUrl: type === 'text' ? undefined : mediaUrl,
        thumbUrl: thumbUrl || undefined,
        mime: mime || undefined,
        size,
        createdAtClient,
        createdAtServer: Date.now(),
        quote,
      }

      await appendMessage(message)
      io.to(channelId).emit('message:new', message)
      ack?.({ ok: true, serverMsgId: message.id, createdAtServer: message.createdAtServer })
    })

    socket.on('channel:clear', async (payload: { channelId: string }, ack?: ClearAck) => {
      const joinedChannelId = normalizeString(socket.data?.joined?.channelId)
      const channelId = normalizeString(payload?.channelId)
      if (!joinedChannelId || joinedChannelId !== channelId) {
        ack?.({ ok: false, message: '操作失败' })
        return
      }

      await clearChannelMessages(channelId)
      io.to(channelId).emit('channel:cleared', { channelId, clearedAtServer: Date.now() })
      ack?.({ ok: true })
    })

    socket.on('heartbeat', async (payload: { timestamp: number, lastMsgServerTime?: number }, ack?: (res: { ok: true; timestamp: number; syncHistory?: MessageRecord[] }) => void) => {
      const { channelId, selfName } = socket.data.joined || {}
      if (channelId && selfName) {
        userLastHeartbeat.set(socket.id, { time: Date.now(), channelId, selfName })
        
        // Message consistency check
        let syncHistory: MessageRecord[] = []
        if (payload.lastMsgServerTime) {
          syncHistory = await listMessagesAfter(channelId, payload.lastMsgServerTime, 50)
        }

        ack?.({ ok: true, timestamp: payload.timestamp, syncHistory })
      } else {
        ack?.({ ok: true, timestamp: payload.timestamp })
      }
    })
  })

  return io
}
