import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { nanoid } from 'nanoid'
import { sha256Hex } from './storage/crypto.js'
import { ensureStorageReady, getChannel, listMessages, upsertChannel, appendMessage, clearChannelMessages } from './storage/store.js'
import type { ChannelRecord, MessageRecord, MessageType } from './storage/types.js'

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

      const history = await listMessages(channelId, 200)
      ack?.({ ok: true, channelId, history, serverTime: Date.now() })
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
  })

  return io
}
