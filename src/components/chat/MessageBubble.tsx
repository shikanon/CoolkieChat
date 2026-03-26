import { Loader2, Video as VideoIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UiMessage } from '@/utils/imTypes'
import { formatTime } from '@/utils/time'

export default function MessageBubble({
  message,
  isSelf,
  onOpenImage,
  onOpenVideo,
  onRetry,
}: {
  message: UiMessage
  isSelf: boolean
  onOpenImage: (url: string) => void
  onOpenVideo: (url: string) => void
  onRetry: () => void
}) {
  const m = message
  return (
    <div className={cn('flex', isSelf ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'group max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm',
          isSelf ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-800 text-zinc-50',
        )}
      >
        {m.type === 'text' ? <div className="whitespace-pre-wrap break-words">{m.text}</div> : null}

        {m.type === 'image' ? (
          <button
            className="block"
            onClick={() => {
              if (!m.mediaUrl) return
              onOpenImage(m.mediaUrl)
            }}
          >
            {m.mediaUrl ? (
              <img src={m.mediaUrl} alt="image" className="mt-1 max-h-64 w-auto rounded-xl object-cover" />
            ) : (
              <div className="mt-1 flex h-24 w-40 items-center justify-center rounded-xl bg-white/10">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
          </button>
        ) : null}

        {m.type === 'video' ? (
          <button
            className="block"
            onClick={() => {
              if (!m.mediaUrl) return
              onOpenVideo(m.mediaUrl)
            }}
          >
            {m.thumbUrl ? (
              <img src={m.thumbUrl} alt="video" className="mt-1 max-h-64 w-auto rounded-xl object-cover" />
            ) : (
              <div className="mt-1 flex h-24 w-40 items-center justify-center rounded-xl bg-white/10">
                <VideoIcon className="h-5 w-5" />
              </div>
            )}
          </button>
        ) : null}

        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="text-[11px] opacity-0 transition-opacity group-hover:opacity-70">{formatTime(m.createdAtServer)}</div>
          {m.status === 'sending' ? (
            <div className={cn('flex items-center gap-1 text-[11px]', isSelf ? 'text-zinc-600' : 'text-zinc-300')}>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              发送中
            </div>
          ) : null}
          {m.status === 'failed' ? (
            <button
              className={cn('text-[11px] underline underline-offset-2', isSelf ? 'text-zinc-700' : 'text-zinc-200')}
              onClick={onRetry}
            >
              发送失败，点击重试
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

