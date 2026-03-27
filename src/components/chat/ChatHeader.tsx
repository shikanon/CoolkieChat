import { ArrowLeft, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ChatHeader({
  peerName,
  connected,
  onBack,
  onClear,
  onExport,
}: {
  peerName: string
  connected: boolean
  onBack: () => void
  onClear: () => void
  onExport: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/50 bg-white/60 backdrop-blur-md px-4 py-3 sticky top-0 z-10">
      <button
        className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100/70 transition-colors"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-light">返回</span>
      </button>

      <div className="flex-1 flex flex-col items-center">
        <div className="text-sm font-medium text-slate-800">{peerName || '私密频道'}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={cn("h-1.5 w-1.5 rounded-full transition-colors", connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300")} />
          <span className="text-[10px] text-slate-400 font-light uppercase tracking-wider">
            {connected ? '已连接' : '等待连接...'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100/70 transition-colors',
            !connected && 'opacity-20',
          )}
          title="导出聊天记录"
          onClick={onExport}
          disabled={!connected}
        >
          <Download className="h-4 w-4" />
          <span className="font-light text-xs hidden sm:inline">导出</span>
        </button>
        <button
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100/70 transition-colors',
            !connected && 'opacity-20',
          )}
          title="清空聊天记录"
          onClick={onClear}
          disabled={!connected}
        >
          <Trash2 className="h-4 w-4" />
          <span className="font-light text-xs hidden sm:inline">清空</span>
        </button>
      </div>
    </div>
  )
}
