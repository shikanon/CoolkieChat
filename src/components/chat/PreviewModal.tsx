import { useState } from 'react'
import { Volume2, VolumeX, X } from 'lucide-react'

export default function PreviewModal({
  type,
  url,
  title,
  onClose,
}: {
  type: 'image' | 'video'
  url: string
  title: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="text-xs font-medium text-white/80 tracking-wide uppercase">{title}</div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full items-center justify-center p-6">
        {type === 'image' ? (
          <img 
            src={url} 
            alt="preview" 
            className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300" 
          />
        ) : (
          <VideoOverlay url={url} />
        )}
      </div>
    </div>
  )
}

function VideoOverlay({ url }: { url: string }) {
  const [muted, setMuted] = useState(true)
  return (
    <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-300">
      <video 
        src={url} 
        className="max-h-[85vh] w-full rounded-2xl shadow-2xl" 
        controls 
        playsInline 
        muted={muted} 
        autoPlay
      />
      <button
        className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-all active:scale-95 shadow-lg"
        onClick={() => setMuted((v) => !v)}
        aria-label={muted ? '开启声音' : '静音'}
      >
        {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </button>
    </div>
  )
}
