# 技术方案（React + Express + Socket.IO）

## 总体架构
- 前端：Vite + React + TypeScript + Tailwind，负责通道建立、聊天 UI、消息预览、上传与本地缓存。
- 后端：Express + Socket.IO，负责通道匹配校验、消息广播、历史拉取、媒体上传与持久化。
- 存储：默认本地文件系统（可替换为 Supabase/对象存储），提供可配置的保留策略。

## 标识与安全
### 会话标识（channelId）
- 输入：nameA、nameB、passphrase（暗号）。
- 生成：对 nameA/nameB 做严格区分大小写与空格的原样比较；通道生成使用“无序名字对 + 暗号”派生。
- 建议派生：`channelId = sha256( min(nameA,nameB) + "\u0000" + max(nameA,nameB) + "\u0000" + passphrase )`。
- 目的：
  - 确保 A/B 互换仍进入同一通道。
  - 使通道标识难以被猜测。

### 暗号验证策略
- 服务端接收 join 请求时携带：selfName、peerName、passphrase。
- 服务端计算 channelId 与 passphraseHash：
  - 若该 channelId 首次出现：创建通道记录并持久化 `passphraseHash`。
  - 若已存在：校验 `passphraseHash` 一致，否则拒绝 join（返回统一错误）。
- 服务端不记录暗号明文，不输出到日志。

## Socket.IO 事件约定
### Client -> Server
- `channel:join`
  - payload: `{ selfName, peerName, passphrase }`
  - ack: `{ ok: true, channelId, history, serverTime } | { ok: false, message }`

- `message:send`
  - payload: `{ channelId, clientMsgId, type, text?, mediaUrl?, thumbUrl?, mime?, size?, createdAtClient }`
  - ack: `{ ok: true, serverMsgId, createdAtServer } | { ok: false, message }`

- `channel:clear`
  - payload: `{ channelId }`
  - ack: `{ ok: true } | { ok: false, message }`

### Server -> Client
- `message:new`
  - payload: 完整消息对象（含 senderName、createdAtServer 等）。

- `channel:cleared`
  - payload: `{ channelId, clearedAtServer }`

## HTTP API
- `POST /api/upload`
  - form-data: `file`（图片或视频，≤50MB）
  - response: `{ ok: true, url, mime, size, originalName }`
- `GET /uploads/...`
  - 静态资源访问（可配置权限策略）。

## 持久化数据模型（建议）
### Channel
- `channelId: string`
- `nameA: string`
- `nameB: string`
- `passphraseHash: string`
- `createdAt: number`
- `updatedAt: number`

### Message
- `id: string`（服务端生成）
- `channelId: string`
- `clientMsgId: string`（用于幂等与重试）
- `senderName: string`
- `type: 'text' | 'image' | 'video'`
- `text?: string`
- `mediaUrl?: string`
- `thumbUrl?: string`（视频封面或图片缩略）
- `mime?: string`
- `size?: number`
- `createdAtClient?: number`
- `createdAtServer: number`

## 存储实现（默认本地）
- 目录：`api/storage/`
  - `channels.json`：通道元数据。
  - `messages/<channelId>.jsonl`：按行追加存储消息（便于增量写入）。
  - `uploads/`：媒体文件。
- 清空记录：删除对应 `messages/<channelId>.jsonl` 并广播 `channel:cleared`。
- 存储周期：通过环境变量配置（例如天数），由定时任务清理。

## 前端本地缓存策略
- localStorage 按 channelId 存储：最近 N 条消息的轻量索引（不存二进制媒体）。
- 断线只读：socket 断开后，保留已加载消息与缓存，不允许发送与上传。

