import { Image as ImageIcon, Send, Video as VideoIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Composer({
  canSend,
  draft,
  onDraftChange,
  onSendText,
  onPickImage,
  onPickVideo,
}: {
  canSend: boolean
  draft: string
  onDraftChange: (v: string) => void
  onSendText: () => void
  onPickImage: () => void
  onPickVideo: () => void
}) {
  return (
    <div className="border-t border-slate-200/50 bg-white/60 backdrop-blur-md p-4 pb-8 md:pb-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-0.5">
          <button
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-500 hover:bg-sky-50 hover:text-sky-500 transition-all active:scale-95',
              !canSend && 'opacity-20 pointer-events-none',
            )}
            onClick={onPickImage}
            disabled={!canSend}
            aria-label="图片"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <button
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95',
              !canSend && 'opacity-20 pointer-events-none',
            )}
            onClick={onPickVideo}
            disabled={!canSend}
            aria-label="视频"
          >
            <VideoIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 relative group">
          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault()
                onSendText()
                return
              }
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                onDraftChange(`${draft}\n`)
              }
            }}
            className={cn(
              'block w-full min-h-[44px] max-h-32 resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:bg-white',
              !canSend && 'opacity-40',
            )}
            placeholder={canSend ? '悄悄说点什么...' : '连接已断开'}
            disabled={!canSend}
            rows={1}
          />
        </div>

        <button
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 text-white shadow-lg shadow-rose-200/50 transition-all active:scale-95 hover:shadow-xl hover:shadow-rose-300/50',
            (!canSend || !draft.trim()) && 'opacity-20 grayscale pointer-events-none',
          )}
          onClick={onSendText}
          disabled={!canSend || !draft.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
