import { Loader2, Video as VideoIcon, CheckCheck } from 'lucide-react'
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
    <div className={cn('flex w-full mb-1', isSelf ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'group relative max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm transition-all',
          isSelf 
            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-tr-none ml-12 shadow-sky-200/50' 
            : 'bg-white/80 text-slate-800 border border-slate-200/70 rounded-tl-none mr-12 shadow-slate-200/50 backdrop-blur-sm',
        )}
      >
        {m.type === 'text' ? (
          <div className="whitespace-pre-wrap break-words leading-relaxed tracking-wide font-light text-[14.5px]">
            {m.text}
          </div>
        ) : null}

        {m.type === 'image' ? (
          <button
            className="block overflow-hidden rounded-xl mt-1 active:scale-[0.98] transition-transform"
            onClick={() => {
              if (!m.mediaUrl) return
              onOpenImage(m.mediaUrl)
            }}
          >
            {m.mediaUrl ? (
              <img src={m.mediaUrl} alt="image" className="max-h-72 w-auto object-cover" />
            ) : (
              <div className="flex h-32 w-48 items-center justify-center bg-slate-100/80">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            )}
          </button>
        ) : null}

        {m.type === 'video' ? (
          <button
            className="block relative overflow-hidden rounded-xl mt-1 active:scale-[0.98] transition-transform"
            onClick={() => {
              if (!m.mediaUrl) return
              onOpenVideo(m.mediaUrl)
            }}
          >
            {m.thumbUrl ? (
              <>
                <img src={m.thumbUrl} alt="video" className="max-h-72 w-auto object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <VideoIcon className="h-5 w-5 text-white shadow-sm" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-32 w-48 items-center justify-center bg-slate-100/80">
                <VideoIcon className="h-6 w-6 text-slate-400" />
              </div>
            )}
          </button>
        ) : null}

        <div className={cn(
          "mt-1.5 flex items-center gap-2 text-[10px] font-light tracking-tight transition-opacity opacity-0 group-hover:opacity-100",
          isSelf ? "justify-end text-white/70" : "justify-start text-slate-400"
        )}>
          <span>{formatTime(m.createdAtServer)}</span>
          {isSelf && (
            <div className="flex items-center">
              {m.status === 'sending' ? (
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
              ) : m.status === 'failed' ? (
                <button onClick={onRetry} className="text-rose-200 underline underline-offset-2">重试</button>
              ) : (
                <CheckCheck className="h-3 w-3 opacity-60" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
