import { ArrowLeft, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ChatHeader({
  peerName,
  connected,
  onBack,
  onClear,
}: {
  peerName: string
  connected: boolean
  onBack: () => void
  onClear: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
      <button
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        返回
      </button>
      <div className="text-sm font-medium text-zinc-900">{peerName || '聊天'}</div>
      <button
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100',
          !connected && 'opacity-40',
        )}
        onClick={onClear}
        disabled={!connected}
      >
        <Trash2 className="h-4 w-4" />
        清空
      </button>
    </div>
  )
}

