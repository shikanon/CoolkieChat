import { Loader2, Video as VideoIcon, CheckCheck, Reply, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UiMessage } from '@/utils/imTypes'
import { formatTime } from '@/utils/time'

export default function MessageBubble({
  message,
  isSelf,
  onOpenImage,
  onOpenVideo,
  onRetry,
  onQuote,
  onJumpTo,
}: {
  message: UiMessage
  isSelf: boolean
  onOpenImage: (url: string) => void
  onOpenVideo: (url: string) => void
  onRetry: () => void
  onQuote: (m: UiMessage) => void
  onJumpTo: (id: string) => void
}) {
  const m = message

  // Function to detect and wrap URLs in <a> tags
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "underline underline-offset-4 decoration-current/40 hover:decoration-current transition-all",
              isSelf ? "text-white font-medium" : "text-sky-600 font-medium"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  return (
    <div className={cn('flex w-full mb-1 animate-in fade-in slide-in-from-bottom-1 duration-300', isSelf ? 'justify-end' : 'justify-start')} id={`msg-${m.id}`}>
      <div
        className={cn(
          'group relative max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm transition-all',
          isSelf 
            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-tr-none ml-12 shadow-sky-200/50' 
            : 'bg-white/80 text-slate-800 border border-slate-200/70 rounded-tl-none mr-12 shadow-slate-200/50 backdrop-blur-sm',
        )}
      >
        {m.quote && (
          <div 
            onClick={() => onJumpTo(m.quote!.id)}
            className={cn(
              "mb-2.5 cursor-pointer rounded-xl border-l-2 px-3 py-2 transition-all hover:opacity-80 active:scale-[0.98]",
              isSelf 
                ? "bg-white/10 border-white/40 text-sky-50" 
                : "bg-slate-50 border-slate-300 text-slate-500"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Quote className={cn("h-2.5 w-2.5", isSelf ? "text-white/60" : "text-slate-400")} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{m.quote.senderName}</span>
              </div>
              <span className="text-[9px] opacity-50 font-light">
                {new Date(m.quote.createdAtServer).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="text-[11px] line-clamp-2 font-light leading-relaxed italic opacity-90">
              {m.quote.text}
            </div>
          </div>
        )}
        {m.type === 'text' ? (
          <div className="whitespace-pre-wrap break-words leading-relaxed tracking-wide font-light text-[14.5px]">
            {renderTextWithLinks(m.text || '')}
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
          {!isSelf && (
            <button 
              onClick={() => onQuote(m)}
              className="mr-auto p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
              aria-label="回复"
            >
              <Reply className="h-3 w-3" />
            </button>
          )}
          {isSelf && (
             <button 
               onClick={() => onQuote(m)}
               className="ml-0 p-1 rounded-full hover:bg-sky-400/50 text-white/60 transition-colors"
               aria-label="回复"
             >
               <Reply className="h-3 w-3" />
             </button>
          )}
          <span>{formatTime(m.createdAtServer)}</span>
          {isSelf && (
            <div className="flex items-center">
              {m.status === 'sending' ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-white/40">发送中...</span>
                  <Loader2 className="h-2.5 w-2.5 animate-spin text-white/60" />
                </div>
              ) : m.status === 'failed' ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-rose-200 font-medium">未发送到服务端</span>
                  <button 
                    onClick={onRetry} 
                    className="text-white bg-rose-500/40 px-1.5 py-0.5 rounded-md hover:bg-rose-500/60 transition-colors"
                  >
                    重试
                  </button>
                </div>
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
