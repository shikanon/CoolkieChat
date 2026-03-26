import heic2any from 'heic2any'

/**
 * Check if a file is HEIC/HEIF
 */
export function isHeic(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  )
}

/**
 * Convert HEIC file to JPEG Blob
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  try {
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8,
    })

    // result can be a Blob or an array of Blobs
    if (Array.isArray(result)) {
      return result[0]
    }
    return result
  } catch (error) {
    console.error('HEIC conversion failed:', error)
    throw error
  }
}
