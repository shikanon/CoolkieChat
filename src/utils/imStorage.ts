import type { JoinInfo, UiMessage } from './imTypes'

export function loadJoinInfo(): JoinInfo | null {
  try {
    const raw = sessionStorage.getItem('im:lastJoin')
    if (!raw) return null
    const parsed = JSON.parse(raw) as JoinInfo
    if (!parsed?.selfName || !parsed?.peerName || !parsed?.passphrase) return null
    return parsed
  } catch {
    return null
  }
}

export function cacheKey(channelId: string) {
  return `im:cache:${channelId}`
}

export function loadCachedMessages(channelId: string): UiMessage[] {
  try {
    const raw = localStorage.getItem(cacheKey(channelId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as UiMessage[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((m) => m && typeof m === 'object' && (m as UiMessage).channelId === channelId)
      .map((m) => ({ ...(m as UiMessage), status: 'sent' }))
  } catch {
    return []
  }
}

export function saveCachedMessages(channelId: string, messages: UiMessage[]) {
  try {
    const compact = messages
      .filter((m) => m.status !== 'sending')
      .slice(-200)
      .map((m) => ({ ...m, status: undefined }))
    localStorage.setItem(cacheKey(channelId), JSON.stringify(compact))
  } catch {
    return
  }
}

export function clearChannelCache(channelId: string) {
  try {
    localStorage.removeItem(cacheKey(channelId))
  } catch {
    return
  }
}

