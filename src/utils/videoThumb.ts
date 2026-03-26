export async function extractVideoThumbnail(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const video = document.createElement('video')
    video.src = objectUrl
    video.muted = true
    video.playsInline = true
    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => resolve()
      const onError = () => reject(new Error('video_load_failed'))
      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.addEventListener('error', onError, { once: true })
    })
    video.currentTime = 0
    await new Promise<void>((resolve) => {
      video.addEventListener('seeked', () => resolve(), { once: true })
    })

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, video.videoWidth)
    canvas.height = Math.max(1, video.videoHeight)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.8)
    })
    return blob
  } catch {
    return null
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

