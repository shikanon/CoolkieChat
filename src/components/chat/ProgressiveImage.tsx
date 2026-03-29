import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function ProgressiveImage({
  src,
  thumb,
  alt,
  className,
  onClick
}: {
  src: string
  thumb?: string
  alt?: string
  className?: string
  onClick?: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(thumb || '')

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setLoaded(true)
      setCurrentSrc(src)
    }
  }, [src])

  return (
    <div 
      className={cn("relative overflow-hidden bg-slate-100/50", className)}
      onClick={onClick}
    >
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            !loaded && thumb ? "blur-lg scale-110" : "blur-0 scale-100"
          )}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
      )}
      
      {!loaded && currentSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <Loader2 className="h-5 w-5 animate-spin text-white/50" />
        </div>
      )}
    </div>
  )
}
