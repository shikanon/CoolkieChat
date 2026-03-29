import { useEffect, useRef, useCallback } from 'react'
import type { UiMessage } from '@/utils/imTypes'
import MessageBubble from './MessageBubble'
import { Heart } from 'lucide-react'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'

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
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  const onJumpTo = useCallback((id: string) => {
    const idx = messages.findIndex(m => m.id === id || m.clientMsgId === id)
    if (idx !== -1) {
      virtuosoRef.current?.scrollToIndex({
        index: idx,
        align: 'center',
        behavior: 'smooth'
      })
      
      // Delay to let scroll finish before highlighting
      setTimeout(() => {
        const el = document.getElementById(`msg-${id}`)
        if (el) {
          el.classList.add('ring-4', 'ring-rose-200', 'ring-offset-4', 'rounded-2xl', 'transition-all', 'duration-500', 'z-20')
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-rose-200', 'ring-offset-4', 'z-20')
          }, 2000)
        }
      }, 500)
    }
  }, [messages])

  return (
    <div className="flex-1 overflow-hidden relative">
      {messages.length === 0 ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="max-w-xs text-center space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/50 border border-slate-200/60 shadow-sm mx-auto">
              <Heart className="h-5 w-5 text-rose-400 fill-rose-100" />
            </div>
            <p className="text-[13px] text-slate-500 font-light leading-relaxed">
              私密频道已开启。把这里当成你们专属的树洞吧。
            </p>
          </div>
        </div>
      ) : null}

      <Virtuoso
        ref={virtuosoRef}
        scrollerRef={(el) => {
          if (el instanceof HTMLDivElement) {
            (listRef as any).current = el
          }
        } }
        data={messages}
        initialTopMostItemIndex={messages.length - 1}
        followOutput="auto"
        className="h-full scroll-smooth"
        increaseViewportBy={200}
        itemContent={(index, m) => (
          <div className="px-4 py-2 first:pt-6 last:pb-6">
            <div className="max-w-4xl mx-auto">
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
            </div>
          </div>
        )}
      />
    </div>
  )
}
