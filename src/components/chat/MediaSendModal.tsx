import { useEffect, useMemo } from 'react'
import { Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MediaSendModal({
  file,
  kind,
  uploading,
  onClose,
  onConfirm,
}: {
  file: File
  kind: 'image' | 'video'
  uploading: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file])
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-zinc-900">发送{kind === 'image' ? '图片' : '视频'}</div>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          {kind === 'image' ? (
            <img src={objectUrl} alt="preview" className="max-h-[60vh] w-full object-contain" />
          ) : (
            <video src={objectUrl} className="max-h-[60vh] w-full" controls muted playsInline />
          )}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button className="rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100" onClick={onClose}>
            取消
          </button>
          <button
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800',
              uploading && 'opacity-60',
            )}
            onClick={onConfirm}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

