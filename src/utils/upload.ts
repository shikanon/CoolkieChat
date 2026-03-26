export async function uploadFile(file: Blob, filename: string) {
  const form = new FormData()
  form.append('file', file, filename)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  const json = (await res.json()) as { ok: boolean; url?: string; mime?: string; size?: number; message?: string }
  if (!res.ok || !json.ok || !json.url) throw new Error(json.message || 'upload_failed')
  return { url: json.url, mime: json.mime, size: json.size }
}

