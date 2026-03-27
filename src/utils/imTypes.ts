export type MessageType = 'text' | 'image' | 'video'

export type ServerMessage = {
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

export type UiMessage = ServerMessage & {
  status?: 'sending' | 'sent' | 'failed'
}

export type JoinInfo = {
  selfName: string
  peerName: string
  passphrase: string
}

