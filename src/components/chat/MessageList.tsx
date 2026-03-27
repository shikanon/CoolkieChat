import { useEffect } from 'react'
import type { UiMessage } from '@/utils/imTypes'
import MessageBubble from './MessageBubble'
import { Heart } from 'lucide-react'

export default function MessageList({
  listRef,
  messages,
  selfName,
  onOpenImage,
  onOpenVideo,
  onRetry,
  onQuote,
}: {
  listRef: React.RefObject<HTMLDivElement | null>
  messages: UiMessage[]
  selfName: string
  onOpenImage: (url: string) => void
  onOpenVideo: (url: string) => void
  onRetry: (m: UiMessage) => void
  onQuote: (m: UiMessage) => void
}) {
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [listRef, messages])

  const onJumpTo = (id: string) => {
    const el = document.getElementById(`msg-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-4', 'ring-rose-200', 'ring-offset-4', 'rounded-2xl', 'transition-all', 'duration-500', 'z-20')
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-rose-200', 'ring-offset-4', 'z-20')
      }, 2000)
    }
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      {messages.length === 0 ? (
        <div className="mx-auto mt-20 max-w-xs text-center space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/50 border border-slate-200/60 shadow-sm">
            <Heart className="h-5 w-5 text-rose-400 fill-rose-100" />
          </div>
          <p className="text-[13px] text-slate-500 font-light leading-relaxed">
            私密频道已开启。把这里当成你们专属的树洞吧。
          </p>
        </div>
      ) : null}

      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((m) => (
          <MessageBubble
            key={m.clientMsgId}
            message={m}
            isSelf={m.senderName === selfName}
            onOpenImage={onOpenImage}
            onOpenVideo={onOpenVideo}
            onRetry={() => onRetry(m)}
            onQuote={onQuote}
            onJumpTo={onJumpTo}
          />
        ))}
      </div>
    </div>
  )
}
