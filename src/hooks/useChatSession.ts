import { useEffect, useMemo, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { nanoid } from 'nanoid'
import type { JoinInfo, ServerMessage, UiMessage } from '@/utils/imTypes'
import { clearChannelCache, loadCachedMessages, saveCachedMessages } from '@/utils/imStorage'
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

export function useChatSession(joinInfo: JoinInfo | null) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [channelId, setChannelId] = useState('')
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [toast, setToast] = useState('')
  const [joinFailed, setJoinFailed] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const selfName = useMemo(() => joinInfo?.selfName || '', [joinInfo])

  useEffect(() => {
    if (!joinInfo) return

    const socket = io({ autoConnect: true })
    socketRef.current = socket

    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    socket.emit('channel:join', joinInfo, ((res) => {
      if (!res?.ok) {
        const msg = res && 'message' in res ? String((res as { message?: string }).message || '') : ''
        setToast(msg || '匹配失败，请检查名字或暗号是否正确')
        setTimeout(() => setToast(''), 2000)
        setJoinFailed(true)
        return
      }

      const cid = String(res.channelId || '')
      setChannelId(cid)

      const cached = loadCachedMessages(cid)
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
    }) as JoinAck)

    socket.on('message:new', (msg: ServerMessage) => {
      if (!msg?.channelId) return
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.clientMsgId === msg.clientMsgId)
        const next = [...prev]
        if (idx >= 0) next[idx] = { ...msg, status: 'sent' }
        else next.push({ ...msg, status: 'sent' })
        next.sort((a, b) => a.createdAtServer - b.createdAtServer)
        saveCachedMessages(msg.channelId, next)
        return next
      })

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
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
      socketRef.current = null
    }
  }, [joinInfo])

  const canSend = status === 'connected' && Boolean(channelId)

  const sendText = (text: string, quote?: ServerMessage['quote']) => {
    const trimmed = text.trim()
    if (!trimmed) return
    if (!canSend) {
      setToast('服务器连接失败，请稍后重试')
      setTimeout(() => setToast(''), 1500)
      return
    }

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

    socketRef.current?.emit(
      'message:send',
      {
        channelId,
        clientMsgId,
        type: 'text',
        text: trimmed,
        quote,
        createdAtClient: optimistic.createdAtClient,
      },
      ((res) => {
        if (!res?.ok) {
          setMessages((prev) => prev.map((m) => (m.clientMsgId === clientMsgId ? { ...m, status: 'failed' } : m)))
          return
        }
        setMessages((prev) => prev.map((m) => (m.clientMsgId === clientMsgId ? { ...m, status: 'sent' } : m)))
      }) as SendAck,
    )
  }

  const sendMedia = (payload: {
    type: 'image' | 'video'
    mediaUrl: string
    thumbUrl?: string
    mime?: string
    size?: number
    quote?: ServerMessage['quote']
  }) => {
    if (!canSend) {
      setToast('服务器连接失败，请稍后重试')
      setTimeout(() => setToast(''), 1500)
      return { clientMsgId: '', ok: false }
    }

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

    socketRef.current?.emit(
      'message:send',
      {
        channelId,
        clientMsgId,
        type: payload.type,
        mediaUrl: payload.mediaUrl,
        thumbUrl: payload.thumbUrl,
        mime: payload.mime,
        size: payload.size,
        quote: payload.quote,
        createdAtClient: optimistic.createdAtClient,
      },
      ((res) => {
        if (!res?.ok) {
          setMessages((prev) => prev.map((m) => (m.clientMsgId === clientMsgId ? { ...m, status: 'failed' } : m)))
          return
        }
        setMessages((prev) => prev.map((m) => (m.clientMsgId === clientMsgId ? { ...m, status: 'sent' } : m)))
      }) as SendAck,
    )

    return { clientMsgId, ok: true }
  }

  const retryMessage = (m: UiMessage) => {
    if (!canSend) return
    setMessages((prev) => prev.map((x) => (x.clientMsgId === m.clientMsgId ? { ...x, status: 'sending' } : x)))
    socketRef.current?.emit(
      'message:send',
      {
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
      },
      ((res) => {
        if (!res?.ok) {
          setMessages((prev) => prev.map((x) => (x.clientMsgId === m.clientMsgId ? { ...x, status: 'failed' } : x)))
          return
        }
        setMessages((prev) => prev.map((x) => (x.clientMsgId === m.clientMsgId ? { ...x, status: 'sent' } : x)))
      }) as SendAck,
    )
  }

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
    clearChannel,
  }
}
