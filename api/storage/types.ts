export type ChannelRecord = {
  channelId: string
  nameA: string
  nameB: string
  passphraseHash: string
  createdAt: number
  updatedAt: number
}

export type MessageType = 'text' | 'image' | 'video'

export type MessageRecord = {
  id: string
  channelId: string
  clientMsgId: string
  senderName: string
  type: MessageType
  text?: string
  mediaUrl?: string
  thumbUrl?: string
  mime?: string
  size?: number
  createdAtClient?: number
  createdAtServer: number
  quote?: {
    id: string
    senderName: string
    text: string
    createdAtServer: number
  }
}

