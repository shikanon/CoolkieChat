import type { JoinInfo, UiMessage } from './imTypes'
import { db } from './db'

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

export function saveJoinInfo(info: JoinInfo) {
  try {
    sessionStorage.setItem('im:lastJoin', JSON.stringify(info))
  } catch {
    return
  }
}

export async function loadCachedMessages(channelId: string): Promise<UiMessage[]> {
  try {
    const messages = await db.messages
      .where('channelId')
      .equals(channelId)
      .sortBy('createdAtServer')
    
    return messages.map(m => ({ ...m, status: 'sent' }))
  } catch (err) {
    console.error('Failed to load cached messages:', err)
    return []
  }
}

export async function saveCachedMessage(message: UiMessage) {
  try {
    if (message.status === 'sending') return
    
    // Use put for upsert
    await db.messages.put({
      ...message,
      status: undefined // We don't store transient status
    })

    // Optional: limit to 500 messages per channel to avoid unbounded growth
    const count = await db.messages.where('channelId').equals(message.channelId).count()
    if (count > 500) {
      const oldest = await db.messages
        .where('channelId')
        .equals(message.channelId)
        .sortBy('createdAtServer')
      
      const toDelete = oldest.slice(0, count - 500).map(m => m.clientMsgId)
      await db.messages.bulkDelete(toDelete)
    }
  } catch (err) {
    console.error('Failed to save cached message:', err)
  }
}

export async function saveCachedMessages(channelId: string, messages: UiMessage[]) {
  try {
    const toSave = messages
      .filter(m => m.status !== 'sending')
      .map(m => ({ ...m, status: undefined }))
    
    await db.messages.bulkPut(toSave)
  } catch (err) {
    console.error('Failed to save cached messages:', err)
  }
}

export async function clearChannelCache(channelId: string) {
  try {
    await db.messages.where('channelId').equals(channelId).delete()
  } catch (err) {
    console.error('Failed to clear channel cache:', err)
  }
}

