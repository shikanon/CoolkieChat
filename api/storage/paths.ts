import path from 'path'

export function getDataRoot(): string {
  return path.resolve(process.cwd(), 'api', '.data')
}

export function getUploadsDir(): string {
  return path.resolve(getDataRoot(), 'uploads')
}

export function getChannelsFilePath(): string {
  return path.resolve(getDataRoot(), 'channels.json')
}

export function getMessagesDir(): string {
  return path.resolve(getDataRoot(), 'messages')
}

export function getChannelMessagesPath(channelId: string): string {
  return path.resolve(getMessagesDir(), `${channelId}.jsonl`)
}

