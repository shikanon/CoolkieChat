import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { io, type Socket } from 'socket.io-client'
import { nanoid } from 'nanoid'
import type { JoinInfo, ServerMessage, UiMessage } from '@/utils/imTypes'
import { clearChannelCache, loadCachedMessages, saveCachedMessages, saveCachedMessage } from '@/utils/imStorage'
import { isNearBottom } from '@/utils/dom'

type JoinAckOk = { ok: true; channelId: string; history: ServerMessage[]; serverTime: number }
type JoinAckFail = { ok: false; message: string }
type JoinAck = (res: JoinAckOk | JoinAckFail) => void

type SendAckOk = { ok: true; serverMsgId: string; createdAtServer: number }
type SendAckFail = { ok: false; message: string }
type SendAck = (res: SendAckOk | SendAckFail) => void

type ClearAckOk = { ok: true }
type ClearAckFail = { ok: false; message: string }
type ClearAck = (res: ClearAckOk | ClearAckFail) => void

const HEARTBEAT_INTERVAL = 10000 // 10s
const INITIAL_RETRY_DELAY = 1000 // 1s
const MAX_RETRY_DELAY = 128000 // 128s

export function useChatSession(joinInfo: JoinInfo | null) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [channelId, setChannelId] = useState('')
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [toast, setToast] = useState('')
  const [joinFailed, setJoinFailed] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isPeerOnline, setIsPeerOnline] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const retryTimersRef = useRef<Record<string, NodeJS.Timeout>>({})
  const messagesRef = useRef<UiMessage[]>([])
  const channelIdRef = useRef<string>('')

  // Keep refs in sync
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    channelIdRef.current = channelId
  }, [channelId])

  const selfName = useMemo(() => joinInfo?.selfName || '', [joinInfo])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(retryTimersRef.current).forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (!joinInfo) return

    const socket = io({ 
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    })
    socketRef.current = socket

    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    // Heartbeat logic
    const heartbeatTimer = setInterval(() => {
      if (socket.connected) {
        // Find the latest message that has been successfully sent to the server
        const lastSentMsg = [...messagesRef.current].reverse().find(m => m.status === 'sent')
        const lastMsgServerTime = lastSentMsg?.createdAtServer

        socket.emit('heartbeat', { 
          timestamp: Date.now(),
          lastMsgServerTime 
        }, (res: { ok: boolean; syncHistory?: ServerMessage[] }) => {
          if (res?.ok) {
            if (res.syncHistory && res.syncHistory.length > 0) {
              console.log(`Heartbeat sync: merging ${res.syncHistory.length} messages`)
              const normalized: UiMessage[] = res.syncHistory.map(m => ({ ...m, status: 'sent' }))
              setMessages(prev => {
                const byClientId = new Map(prev.map(m => [m.clientMsgId, m]))
                for (const m of normalized) byClientId.set(m.clientMsgId, m)
                const merged = Array.from(byClientId.values()).sort((a, b) => a.createdAtServer - b.createdAtServer)
                saveCachedMessages(channelIdRef.current, merged)
                return merged
              })
            }
          } else {
            console.warn('Heartbeat failed')
          }
        })
      }
    }, HEARTBEAT_INTERVAL)

    socket.emit('channel:join', joinInfo, (async (res) => {
      if (!res?.ok) {
        const msg = res && 'message' in res ? String((res as { message?: string }).message || '') : ''
        setToast(msg || '匹配失败，请检查名字或暗号是否正确')
        setTimeout(() => setToast(''), 2000)
        setJoinFailed(true)
        return
      }

      const cid = String(res.channelId || '')
      setChannelId(cid)

      const cached = await loadCachedMessages(cid)
      if (cached.length) setMessages(cached)

      const history = (res.history as ServerMessage[] | undefined) || []
      const normalized: UiMessage[] = history.map((m) => ({ ...m, status: 'sent' }))

      setMessages((prev) => {
        const byClientId = new Map(prev.map((m) => [m.clientMsgId, m]))
        for (const m of normalized) byClientId.set(m.clientMsgId, m)
        const merged = Array.from(byClientId.values()).sort((a, b) => a.createdAtServer - b.createdAtServer)
        saveCachedMessages(cid, merged)
        return merged
      })

      // Fetch presence
      socket.emit('channel:presence', { channelId: cid }, (res: { ok: boolean; onlineUsers: string[] }) => {
        if (res.ok && res.onlineUsers) {
          const peerName = joinInfo.peerName
          setIsPeerOnline(res.onlineUsers.includes(peerName))
        }
      })
    }) as JoinAck)

    socket.on('presence:update', (data: { channelId: string; senderName: string; online: boolean }) => {
      if (data.senderName === joinInfo.peerName) {
        setIsPeerOnline(data.online)
      }
    })

    socket.on('message:new', (msg: ServerMessage) => {
      if (!msg?.channelId) return
      const uiMsg: UiMessage = { ...msg, status: 'sent' }
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.clientMsgId === msg.clientMsgId)
        const next = [...prev]
        if (idx >= 0) next[idx] = uiMsg
        else next.push(uiMsg)
        next.sort((a, b) => a.createdAtServer - b.createdAtServer)
        return next
      })
      saveCachedMessage(uiMsg)

      const el = listRef.current
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight
        })
      }
    })

    socket.on('channel:cleared', (e: { channelId: string }) => {
      const cid = String(e?.channelId || '')
      if (!cid) return
      setMessages([])
      clearChannelCache(cid)
      setToast('已清空')
      setTimeout(() => setToast(''), 1200)
    })

    return () => {
      clearInterval(heartbeatTimer)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
      socketRef.current = null
    }
  }, [joinInfo])

  const canSend = status === 'connected' && Boolean(channelId)

  const doSendWithRetry = useCallback((m: UiMessage, attempt = 0) => {
    // Clear any existing timer for this message
    if (retryTimersRef.current[m.clientMsgId]) {
      clearTimeout(retryTimersRef.current[m.clientMsgId])
      delete retryTimersRef.current[m.clientMsgId]
    }

    const calculateDelay = (att: number) => {
      return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, att), MAX_RETRY_DELAY)
    }

    if (!socketRef.current || !socketRef.current.connected) {
      // If not connected, retry later with backoff
      const delay = calculateDelay(attempt)
      console.log(`Socket not connected, retrying message ${m.clientMsgId} in ${delay}ms (attempt ${attempt + 1})`)
      retryTimersRef.current[m.clientMsgId] = setTimeout(() => doSendWithRetry(m, attempt + 1), delay)
      return
    }

    const payload = {
      channelId: m.channelId,
      clientMsgId: m.clientMsgId,
      type: m.type,
      text: m.text,
      mediaUrl: m.mediaUrl,
      thumbUrl: m.thumbUrl,
      mime: m.mime,
      size: m.size,
      quote: m.quote,
      createdAtClient: m.createdAtClient,
    }

    // Set a timeout for the acknowledgement
    const ackTimeout = setTimeout(() => {
      const delay = calculateDelay(attempt)
      console.warn(`Ack timeout for message ${m.clientMsgId}, retrying in ${delay}ms (attempt ${attempt + 1})...`)
      doSendWithRetry(m, attempt + 1)
    }, 5000)

    socketRef.current.emit('message:send', payload, ((res) => {
      clearTimeout(ackTimeout)
      
      // If we got an ack, we can stop any pending retry for this message
      if (retryTimersRef.current[m.clientMsgId]) {
        clearTimeout(retryTimersRef.current[m.clientMsgId])
        delete retryTimersRef.current[m.clientMsgId]
      }

      if (!res || !res.ok) {
        const errorMsg = (res && 'message' in res) ? res.message : 'unknown error'
        console.error(`Message ${m.clientMsgId} send failed: ${errorMsg}`)
        const delay = calculateDelay(attempt)
        retryTimersRef.current[m.clientMsgId] = setTimeout(() => doSendWithRetry(m, attempt + 1), delay)
        return
      }
      const sentMsg: UiMessage = { ...m, status: 'sent', createdAtServer: res.createdAtServer }
      setMessages((prev) => prev.map((x) => (x.clientMsgId === m.clientMsgId ? sentMsg : x)))
      saveCachedMessage(sentMsg)
    }) as SendAck)
  }, [])

  const sendText = (text: string, quote?: ServerMessage['quote']) => {
    const trimmed = text.trim()
    if (!trimmed) return
    
    const clientMsgId = nanoid()
    const optimistic: UiMessage = {
      id: clientMsgId,
      channelId,
      clientMsgId,
      senderName: selfName,
      type: 'text',
      text: trimmed,
      quote,
      createdAtClient: Date.now(),
      createdAtServer: Date.now(),
      status: 'sending',
    }

    setMessages((prev) => [...prev, optimistic])
    doSendWithRetry(optimistic)
  }

  const sendMedia = (payload: {
    type: 'image' | 'video'
    mediaUrl: string
    thumbUrl?: string
    mime?: string
    size?: number
    quote?: ServerMessage['quote']
  }) => {
    const clientMsgId = nanoid()
    const optimistic: UiMessage = {
      id: clientMsgId,
      channelId,
      clientMsgId,
      senderName: selfName,
      type: payload.type,
      mediaUrl: payload.mediaUrl,
      thumbUrl: payload.thumbUrl,
      mime: payload.mime,
      size: payload.size,
      quote: payload.quote,
      createdAtClient: Date.now(),
      createdAtServer: Date.now(),
      status: 'sending',
    }

    setMessages((prev) => [...prev, optimistic])
    doSendWithRetry(optimistic)

    return { clientMsgId, ok: true }
  }

  const retryMessage = (m: UiMessage) => {
    setMessages((prev) => prev.map((x) => (x.clientMsgId === m.clientMsgId ? { ...x, status: 'sending' } : x)))
    doSendWithRetry({ ...m, status: 'sending' })
  }

  const updateMessage = useCallback((clientMsgId: string, updates: Partial<UiMessage>) => {
    setMessages(prev => prev.map(m => m.clientMsgId === clientMsgId ? { ...m, ...updates } : m))
  }, [])

  const loadHistory = useCallback(async () => {
    if (loadingHistory || !hasMore || !channelId || !socketRef.current?.connected) return

    const firstMsg = messages.find(m => m.status === 'sent')
    if (!firstMsg) return

    setLoadingHistory(true)
    try {
      const res = await new Promise<{ ok: boolean; history?: ServerMessage[] }>(resolve => {
        socketRef.current?.emit('channel:history', { 
          channelId, 
          beforeTime: firstMsg.createdAtServer,
          limit: 30 
        }, resolve)
      })

      if (res.ok && res.history) {
        if (res.history.length === 0) {
          setHasMore(false)
        } else {
          const normalized: UiMessage[] = res.history.map(m => ({ ...m, status: 'sent' }))
          setMessages(prev => {
            const byClientId = new Map(prev.map(m => [m.clientMsgId, m]))
            for (const m of normalized) {
              if (!byClientId.has(m.clientMsgId)) {
                byClientId.set(m.clientMsgId, m)
              }
            }
            const merged = Array.from(byClientId.values()).sort((a, b) => a.createdAtServer - b.createdAtServer)
            saveCachedMessages(channelId, merged)
            return merged
          })
        }
      }
    } catch (e) {
      console.error('Failed to load history:', e)
    } finally {
      setLoadingHistory(false)
    }
  }, [channelId, loadingHistory, hasMore, messages])

  const clearChannel = async () => {
    if (!channelId || status !== 'connected') return false
    return await new Promise<boolean>((resolve) => {
      socketRef.current?.emit('channel:clear', { channelId }, ((res) => {
        if (!res?.ok) {
          setToast('操作失败')
          setTimeout(() => setToast(''), 1200)
          resolve(false)
          return
        }
        resolve(true)
      }) as ClearAck)
    })
  }

  return {
    status,
    channelId,
    messages,
    toast,
    setToast,
    joinFailed,
    listRef,
    canSend,
    sendText,
    sendMedia,
    retryMessage,
    updateMessage,
    setMessages,
    clearChannel,
    loadHistory,
    loadingHistory,
    hasMore,
    isPeerOnline,
  }
}
