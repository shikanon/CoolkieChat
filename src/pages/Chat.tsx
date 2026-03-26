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
  const [pendingUpload, setPendingUpload] = useState<null | { file: File; kind: 'image' | 'video' }>(null)
  const [uploading, setUploading] = useState(false)
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
    input.accept = kind === 'image' ? 'image/*' : 'video/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      if (file.size > 50 * 1024 * 1024) {
        setToast('文件过大（单个≤50MB）')
        setTimeout(() => setToast(''), 1500)
        return
      }
      setPendingUpload({ file, kind })
    }
    input.click()
  }

  const onSendText = () => {
    const text = draft
    sendText(text)
    setDraft('')
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
      const { file, kind } = pendingUpload
      const uploaded = await uploadFile(file, file.name)

      let thumbUrl: string | undefined
      if (kind === 'video') {
        const thumb = await extractVideoThumbnail(file)
        if (thumb) {
          const thumbUploaded = await uploadFile(thumb, `${file.name}.jpg`)
          thumbUrl = thumbUploaded.url
        }
      }

      sendMedia({ type: kind, mediaUrl: uploaded.url, thumbUrl, mime: uploaded.mime, size: uploaded.size })
      setPendingUpload(null)
    } catch {
      setToast('上传或发送失败')
      setTimeout(() => setToast(''), 1500)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="h-dvh w-full bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col">
        <ChatHeader peerName={peerName} connected={status === 'connected'} onBack={() => nav('/')} onClear={onClear} />
        <ConnectionBanner visible={status !== 'connected'} />
        <MessageList
          listRef={listRef}
          messages={messages}
          selfName={selfName}
          onOpenImage={(url) => setPreview({ type: 'image', url, title: '图片预览' })}
          onOpenVideo={(url) => setPreview({ type: 'video', url, title: '视频预览' })}
          onRetry={retryMessage}
        />
        <Composer
          canSend={canSend}
          draft={draft}
          onDraftChange={setDraft}
          onSendText={onSendText}
          onPickImage={() => onPickFile('image')}
          onPickVideo={() => onPickFile('video')}
        />
      </div>

      <Toast text={toast} />

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
