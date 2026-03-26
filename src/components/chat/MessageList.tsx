import { useEffect } from 'react'
import type { UiMessage } from '@/utils/imTypes'
import MessageBubble from './MessageBubble'

export default function MessageList({
  listRef,
  messages,
  selfName,
  onOpenImage,
  onOpenVideo,
  onRetry,
}: {
  listRef: React.RefObject<HTMLDivElement | null>
  messages: UiMessage[]
  selfName: string
  onOpenImage: (url: string) => void
  onOpenVideo: (url: string) => void
  onRetry: (m: UiMessage) => void
}) {
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [listRef])

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <div className="mx-auto mt-10 max-w-sm text-center text-sm text-zinc-500">通道已建立，可开始聊天</div>
      ) : null}

      <div className="space-y-3">
        {messages.map((m) => (
          <MessageBubble
            key={m.clientMsgId}
            message={m}
            isSelf={m.senderName === selfName}
            onOpenImage={onOpenImage}
            onOpenVideo={onOpenVideo}
            onRetry={() => onRetry(m)}
          />
        ))}
      </div>
    </div>
  )
}

