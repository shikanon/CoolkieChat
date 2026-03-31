import { ArrowLeft, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ChatHeader({
  peerName,
  selfOnline,
  peerOnline,
  onBack,
  onClear,
  onExport,
}: {
  peerName: string
  selfOnline: boolean
  peerOnline: boolean
  onBack: () => void
  onClear: () => void
  onExport: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/50 bg-white/60 backdrop-blur-md px-4 py-3 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <button
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100/70 transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-light text-xs sm:text-sm">返回</span>
        </button>
      </div>

      <div className="flex-[2] flex flex-col items-center">
        <div className="text-sm font-medium text-slate-800">{peerName || '私密频道'}</div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full transition-all", selfOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300")} />
            <span className="text-[9px] text-slate-400 font-light uppercase tracking-tighter">
              我 {selfOnline ? '在线' : '离线'}
            </span>
          </div>
          <div className="w-px h-2 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full transition-all", peerOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300")} />
            <span className="text-[9px] text-slate-400 font-light uppercase tracking-tighter">
              对方 {peerOnline ? '在线' : '离线'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-1">
        <button
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100/70 transition-colors',
            !selfOnline && 'opacity-20',
          )}
          title="导出聊天记录"
          onClick={onExport}
          disabled={!selfOnline}
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100/70 transition-colors',
            !selfOnline && 'opacity-20',
          )}
          title="清空聊天记录"
          onClick={onClear}
          disabled={!selfOnline}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
