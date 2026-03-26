import fs from 'fs/promises'
import path from 'path'
import { getChannelMessagesPath, getChannelsFilePath, getDataRoot, getMessagesDir } from './paths.js'
import type { ChannelRecord, MessageRecord } from './types.js'

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath)
  await ensureDir(dir)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function ensureStorageReady(): Promise<void> {
  await ensureDir(getDataRoot())
  await ensureDir(getMessagesDir())
}

export async function getChannel(channelId: string): Promise<ChannelRecord | null> {
  const channels = await readJsonFile<Record<string, ChannelRecord>>(getChannelsFilePath(), {})
  return channels[channelId] ?? null
}

export async function upsertChannel(record: ChannelRecord): Promise<void> {
  const channels = await readJsonFile<Record<string, ChannelRecord>>(getChannelsFilePath(), {})
  channels[record.channelId] = record
  await writeJsonFile(getChannelsFilePath(), channels)
}

export async function listMessages(channelId: string, limit = 200): Promise<MessageRecord[]> {
  const filePath = getChannelMessagesPath(channelId)
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const lines = raw.split('\n').filter(Boolean)
    const slice = lines.length > limit ? lines.slice(lines.length - limit) : lines
    const parsed = slice
      .map((line) => {
        try {
          return JSON.parse(line) as MessageRecord
        } catch {
          return null
        }
      })
      .filter((v): v is MessageRecord => Boolean(v))
    return parsed
  } catch {
    return []
  }
}

export async function appendMessage(message: MessageRecord): Promise<void> {
  await ensureStorageReady()
  const filePath = getChannelMessagesPath(message.channelId)
  await fs.appendFile(filePath, `${JSON.stringify(message)}\n`, 'utf8')
}

export async function clearChannelMessages(channelId: string): Promise<void> {
  await ensureStorageReady()
  const filePath = getChannelMessagesPath(channelId)
  try {
    await fs.rm(filePath)
  } catch {
    return
  }
}

