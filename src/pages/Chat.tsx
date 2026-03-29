import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatHeader from '@/components/chat/ChatHeader'
import Composer from '@/components/chat/Composer'
import ConnectionBanner from '@/components/chat/ConnectionBanner'
import MediaSendModal from '@/components/chat/MediaSendModal'
import MessageList from '@/components/chat/MessageList'
import PreviewModal from '@/components/chat/PreviewModal'
import Toast from '@/components/chat/Toast'
import { useChatSession } from '@/hooks/useChatSession'
import { loadJoinInfo } from '@/utils/imStorage'
import { uploadFile } from '@/utils/upload'
import { extractVideoThumbnail } from '@/utils/videoThumb'
import { type ServerMessage } from '@/utils/imTypes'

import { convertHeicToJpeg, isHeic } from '@/utils/heic'
import { compressImage } from '@/utils/compress'

export default function Chat() {
  const nav = useNavigate()
  const joinInfo = useMemo(() => loadJoinInfo(), [])
  const {
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
    loadHistory,
    loadingHistory,
    hasMore,
  } = useChatSession(joinInfo)

  const [draft, setDraft] = useState('')
  const [quote, setQuote] = useState<ServerMessage['quote'] | undefined>(undefined)
  const [pendingUpload, setPendingUpload] = useState<null | { file: File | Blob; kind: 'image' | 'video'; originalName?: string }>(null)
  const [uploading, setUploading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [preview, setPreview] = useState<null | { type: 'image' | 'video'; url: string; title: string }>(null)

  const peerName = joinInfo?.peerName || ''
  const selfName = joinInfo?.selfName || ''

  useEffect(() => {
    if (!joinInfo) nav('/')
  }, [joinInfo, nav])

  useEffect(() => {
    if (!joinFailed) return
    const t = window.setTimeout(() => nav('/'), 300)
    return () => window.clearTimeout(t)
  }, [joinFailed, nav])

  if (!joinInfo) return null

  const onPickFile = (kind: 'image' | 'video') => {
    if (!canSend) {
      setToast('服务器连接失败，请稍后重试')
      setTimeout(() => setToast(''), 1500)
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = kind === 'image' ? 'image/*, .heic, .heif' : 'video/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      if (file.size > 50 * 1024 * 1024) {
        setToast('文件过大（单个≤50MB）')
        setTimeout(() => setToast(''), 1500)
        return
      }

      if (kind === 'image') {
        setConverting(true)
        try {
          let target = file
          if (isHeic(file)) {
            target = await convertHeicToJpeg(file)
          }
          // Compress if large or just always for safety
          if (target.size > 1 * 1024 * 1024) {
             target = await compressImage(target as File)
          }
          setPendingUpload({ file: target, kind, originalName: file.name })
        } catch (e) {
          console.error(e)
          setToast('图片处理失败')
          setTimeout(() => setToast(''), 1500)
        } finally {
          setConverting(false)
        }
      } else {
        setPendingUpload({ file, kind })
      }
    }
    input.click()
  }

  const onSendText = () => {
    const text = draft
    sendText(text, quote)
    setDraft('')
    setQuote(undefined)
  }

  const onClear = async () => {
    if (!channelId || status !== 'connected') return
    const ok = window.confirm('确认清空聊天记录？清空后无法恢复。')
    if (!ok) return
    await clearChannel()
  }

  const onExport = () => {
    if (!messages.length) {
      setToast('暂无聊天记录可导出')
      setTimeout(() => setToast(''), 1500)
      return
    }

    try {
      const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        peerName,
        selfName,
        messages: messages.map(m => ({
          id: m.id,
          senderName: m.senderName,
          type: m.type,
          text: m.text,
          mediaUrl: m.mediaUrl,
          thumbUrl: m.thumbUrl,
          createdAtServer: m.createdAtServer,
          quote: m.quote,
        })),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      a.href = url
      a.download = `CoolkieChat_Memories_${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setToast('导出成功，请妥善保存')
      setTimeout(() => setToast(''), 1500)
    } catch (e) {
      console.error('Export failed:', e)
      setToast('导出失败')
      setTimeout(() => setToast(''), 1500)
    }
  }

  const onConfirmMedia = async () => {
    if (!pendingUpload || uploading) return
    if (!canSend) return

    const { file, kind, originalName } = pendingUpload
    const clientMsgId = nanoid()
    const localUrl = URL.createObjectURL(file)
    
    // 1. 立即显示乐观消息
    const optimistic: UiMessage = {
      id: clientMsgId,
      channelId,
      clientMsgId,
      senderName: selfName,
      type: kind,
      mediaUrl: localUrl, // 先用本地连接
      createdAtClient: Date.now(),
      createdAtServer: Date.now(),
      status: 'sending',
      progress: 0,
      quote,
    }

    setMessages((prev) => [...prev, optimistic])
    setPendingUpload(null)
    setQuote(undefined)

    // 2. 异步执行上传和发送
    const processUpload = async () => {
      try {
        let fileName = originalName || (file as File).name || (kind === 'image' ? 'image.jpg' : 'video.mp4')
        if (kind === 'image' && (fileName.toLowerCase().endsWith('.heic') || fileName.toLowerCase().endsWith('.heif'))) {
          fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg')
        }

        // 模拟进度更新 (由于 uploadFile 目前不支持进度回调，我们先手动模拟或保持 0-100)
        updateMessage(clientMsgId, { progress: 10 })
        const uploaded = await uploadFile(file, fileName)
        updateMessage(clientMsgId, { progress: 80 })

        let thumbUrl: string | undefined
        if (kind === 'video') {
          const thumb = await extractVideoThumbnail(file as File)
          if (thumb) {
            const thumbUploaded = await uploadFile(thumb, `${fileName}.jpg`)
            thumbUrl = thumbUploaded.url
          }
        }
        updateMessage(clientMsgId, { progress: 100 })

        // 3. 调用真正发送逻辑
        const payload: UiMessage = {
          id: clientMsgId,
          channelId,
          clientMsgId,
          senderName: selfName,
          type: kind,
          mediaUrl: uploaded.url,
          thumbUrl,
          mime: uploaded.mime,
          size: uploaded.size,
          quote,
          createdAtClient: optimistic.createdAtClient,
          createdAtServer: Date.now(),
          status: 'sending',
        }
        
        // 替换为正式 URL 并重试发送逻辑
        updateMessage(clientMsgId, { mediaUrl: uploaded.url, thumbUrl, status: 'sending' })
        retryMessage(payload)
        
        // 清理本地 URL
        setTimeout(() => URL.revokeObjectURL(localUrl), 5000)
      } catch (err) {
        console.error('Async upload failed:', err)
        updateMessage(clientMsgId, { status: 'failed' })
        setToast('媒体上传失败')
        setTimeout(() => setToast(''), 2000)
      }
    }

    processUpload()
  }

  const onQuote = (m: ServerMessage) => {
    setQuote({
      id: m.id,
      senderName: m.senderName,
      text: m.text || (m.type === 'image' ? '[图片]' : '[视频]'),
      createdAtServer: m.createdAtServer,
    })
  }

  return (
    <div className="h-dvh w-full bg-gradient-to-br from-sky-50 via-white to-rose-50 text-slate-800 selection:bg-rose-100">
      <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col border-x border-slate-200/50 bg-white/40 backdrop-blur-md">
        <ChatHeader peerName={peerName} connected={status === 'connected'} onBack={() => nav('/')} onClear={onClear} onExport={onExport} />
        <ConnectionBanner visible={status !== 'connected'} />
        <MessageList
          listRef={listRef}
          messages={messages}
          selfName={selfName}
          onOpenImage={(url) => setPreview({ type: 'image', url, title: '图片预览' })}
          onOpenVideo={(url) => setPreview({ type: 'video', url, title: '视频预览' })}
          onRetry={retryMessage}
          onQuote={onQuote}
          onLoadMore={loadHistory}
          loadingMore={loadingHistory}
          hasMore={hasMore}
        />
        <Composer
          canSend={canSend}
          draft={draft}
          quote={quote}
          onDraftChange={setDraft}
          onSendText={onSendText}
          onPickImage={() => onPickFile('image')}
          onPickVideo={() => onPickFile('video')}
          onClearQuote={() => setQuote(undefined)}
        />
      </div>

      <Toast text={toast} />

      {converting ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-rose-400" />
            <div className="text-sm font-medium text-slate-600">正在处理素材...</div>
          </div>
        </div>
      ) : null}

      {pendingUpload ? (
        <MediaSendModal
          file={pendingUpload.file}
          kind={pendingUpload.kind}
          uploading={uploading}
          onClose={() => setPendingUpload(null)}
          onConfirm={onConfirmMedia}
        />
      ) : null}

      {preview ? (
        <PreviewModal type={preview.type} url={preview.url} title={preview.title} onClose={() => setPreview(null)} />
      ) : null}

    </div>
  )
}
