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
    <div className="fixed inset-0 z-50 bg-black/80">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
        <div className="text-xs text-white/80">{title}</div>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-full w-full items-center justify-center p-4">
        {type === 'image' ? (
          <img src={url} alt="preview" className="max-h-full max-w-full rounded-xl object-contain" />
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
    <div className="relative w-full max-w-3xl">
      <video src={url} className="max-h-[80vh] w-full rounded-xl" controls playsInline muted={muted} />
      <button
        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
        onClick={() => setMuted((v) => !v)}
        aria-label={muted ? '开启声音' : '静音'}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  )
}

