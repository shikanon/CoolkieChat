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
  file: File | Blob
  kind: 'image' | 'video'
  uploading: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const objectUrl = useMemo(() => {
    try {
      return URL.createObjectURL(file)
    } catch (e) {
      console.error('Failed to create object URL:', e)
      return ''
    }
  }, [file])

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-slate-800">发送{kind === 'image' ? '图片' : '视频'}</div>
          <button 
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 transition-colors" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-center min-h-[200px]">
          {kind === 'image' ? (
            <img 
              src={objectUrl} 
              alt="preview" 
              className="max-h-[50vh] w-full object-contain"
              onLoad={() => console.log('Preview image loaded')}
              onError={(e) => console.error('Preview image load error', e)}
            />
          ) : (
            <video 
              src={objectUrl} 
              className="max-h-[50vh] w-full" 
              controls 
              muted 
              playsInline 
            />
          )}
          {!objectUrl && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin opacity-20" />
              <span className="text-xs font-light tracking-wider">正在加载预览...</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button 
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors" 
            onClick={onClose}
          >
            取消
          </button>
          <button
            className={cn(
              'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-200/50 transition-all active:scale-95',
              uploading && 'opacity-60 cursor-not-allowed',
            )}
            onClick={onConfirm}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {uploading ? '上传中...' : '确认发送'}
          </button>
        </div>
      </div>
    </div>
  )
}
