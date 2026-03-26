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
    <div className="border-t border-zinc-200 bg-white p-3">
      <div className="flex items-end gap-2">
        <button
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50',
            !canSend && 'opacity-40',
          )}
          onClick={onPickImage}
          disabled={!canSend}
          aria-label="图片"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <button
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50',
            !canSend && 'opacity-40',
          )}
          onClick={onPickVideo}
          disabled={!canSend}
          aria-label="视频"
        >
          <VideoIcon className="h-5 w-5" />
        </button>
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
            'min-h-10 flex-1 resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400',
            !canSend && 'opacity-60',
          )}
          placeholder={canSend ? '输入消息…（Enter发送，Ctrl+Enter换行）' : '只读模式'}
          disabled={!canSend}
          rows={1}
        />
        <button
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800',
            (!canSend || !draft.trim()) && 'opacity-40',
          )}
          onClick={onSendText}
          disabled={!canSend || !draft.trim()}
        >
          <Send className="h-4 w-4" />
          发送
        </button>
      </div>
    </div>
  )
}

