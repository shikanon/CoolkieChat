import fs from 'fs/promises'
import Database from 'better-sqlite3'
import { getDataRoot, getDatabasePath, getUploadsDir } from './paths.js'
import type { ChannelRecord, MessageRecord } from './types.js'

let db: Database.Database | null = null

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true })
}

export async function ensureStorageReady(): Promise<void> {
  await ensureDir(getDataRoot())
  await ensureDir(getUploadsDir())

  if (!db) {
    db = new Database(getDatabasePath())
    db.pragma('journal_mode = WAL')

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS channels (
        channelId TEXT PRIMARY KEY,
        nameA TEXT NOT NULL,
        nameB TEXT NOT NULL,
        passphraseHash TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        channelId TEXT NOT NULL,
        clientMsgId TEXT NOT NULL,
        senderName TEXT NOT NULL,
        type TEXT NOT NULL,
        text TEXT,
        mediaUrl TEXT,
        thumbUrl TEXT,
        mime TEXT,
        size INTEGER,
        createdAtClient INTEGER,
        createdAtServer INTEGER NOT NULL,
        quote JSON,
        FOREIGN KEY (channelId) REFERENCES channels (channelId)
      );

      CREATE INDEX IF NOT EXISTS idx_messages_channelId ON messages (channelId);
      CREATE INDEX IF NOT EXISTS idx_messages_createdAtServer ON messages (createdAtServer);
      CREATE INDEX IF NOT EXISTS idx_messages_clientMsgId ON messages (clientMsgId);
    `)
  }
}

export async function getChannel(channelId: string): Promise<ChannelRecord | null> {
  await ensureStorageReady()
  const row = db!.prepare('SELECT * FROM channels WHERE channelId = ?').get(channelId) as ChannelRecord | undefined
  return row ?? null
}

export async function upsertChannel(record: ChannelRecord): Promise<void> {
  await ensureStorageReady()
  db!.prepare(`
    INSERT INTO channels (channelId, nameA, nameB, passphraseHash, createdAt, updatedAt)
    VALUES (@channelId, @nameA, @nameB, @passphraseHash, @createdAt, @updatedAt)
    ON CONFLICT(channelId) DO UPDATE SET
      updatedAt = excluded.updatedAt
  `).run(record)
}

export async function listMessages(channelId: string, limit = 200): Promise<MessageRecord[]> {
  await ensureStorageReady()
  const rows = db!.prepare(`
    SELECT * FROM messages 
    WHERE channelId = ? 
    ORDER BY createdAtServer ASC 
    LIMIT ?
  `).all(channelId, limit) as any[]

  return rows.map(row => ({
    ...row,
    quote: row.quote ? JSON.parse(row.quote) : undefined
  }))
}

export async function appendMessage(message: MessageRecord): Promise<void> {
  await ensureStorageReady()
  db!.prepare(`
    INSERT INTO messages (
      id, channelId, clientMsgId, senderName, type, text, 
      mediaUrl, thumbUrl, mime, size, createdAtClient, 
      createdAtServer, quote
    ) VALUES (
      @id, @channelId, @clientMsgId, @senderName, @type, @text,
      @mediaUrl, @thumbUrl, @mime, @size, @createdAtClient,
      @createdAtServer, @quote
    )
  `).run({
    ...message,
    quote: message.quote ? JSON.stringify(message.quote) : null
  })
}

export async function clearChannelMessages(channelId: string): Promise<void> {
  await ensureStorageReady()
  db!.prepare('DELETE FROM messages WHERE channelId = ?').run(channelId)
}
