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

import { convertHeicToJpeg, isHeic } from '@/utils/heic'

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

      if (kind === 'image' && isHeic(file)) {
        setConverting(true)
        try {
          const converted = await convertHeicToJpeg(file)
          setPendingUpload({ file: converted, kind, originalName: file.name })
        } catch (e) {
          console.error(e)
          setToast('图片格式转换失败')
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

  const onConfirmMedia = async () => {
    if (!pendingUpload || uploading) return
    if (!canSend) return
    setUploading(true)
    try {
      const { file, kind, originalName } = pendingUpload
      let fileName = originalName || (file as File).name || (kind === 'image' ? 'image.jpg' : 'video.mp4')

      // If it was HEIC, it's now converted to JPEG, so change the extension
      if (kind === 'image' && (fileName.toLowerCase().endsWith('.heic') || fileName.toLowerCase().endsWith('.heif'))) {
        fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg')
      }

      const uploaded = await uploadFile(file, fileName)

      let thumbUrl: string | undefined
      if (kind === 'video') {
        const thumb = await extractVideoThumbnail(file as File)
        if (thumb) {
          const thumbUploaded = await uploadFile(thumb, `${fileName}.jpg`)
          thumbUrl = thumbUploaded.url
        }
      }

      sendMedia({ type: kind, mediaUrl: uploaded.url, thumbUrl, mime: uploaded.mime, size: uploaded.size, quote })
      setPendingUpload(null)
      setQuote(undefined)
    } catch {
      setToast('上传或发送失败')
      setTimeout(() => setToast(''), 1500)
    } finally {
      setUploading(false)
    }
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
        <ChatHeader peerName={peerName} connected={status === 'connected'} onBack={() => nav('/')} onClear={onClear} />
        <ConnectionBanner visible={status !== 'connected'} />
        <MessageList
          listRef={listRef}
          messages={messages}
          selfName={selfName}
          onOpenImage={(url) => setPreview({ type: 'image', url, title: '图片预览' })}
          onOpenVideo={(url) => setPreview({ type: 'video', url, title: '视频预览' })}
          onRetry={retryMessage}
          onQuote={onQuote}
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
