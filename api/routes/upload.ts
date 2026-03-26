import { Router } from 'express'
import type { Request } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { nanoid } from 'nanoid'
import { getUploadsDir } from '../storage/paths.js'

const router = Router()

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const dir = getUploadsDir()
    await fs.mkdir(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '')
    cb(null, `${Date.now()}-${nanoid(8)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')
    cb(ok ? null : new Error('Unsupported file type'), ok)
  },
})

router.post('/', upload.single('file'), (req, res) => {
  const typedReq = req as Request & {
    file?: {
      filename: string
      mimetype: string
      size: number
      originalname: string
    }
  }
  const file = typedReq.file
  if (!file) {
    res.status(400).json({ ok: false, message: 'No file' })
    return
  }

  const url = `/uploads/${file.filename}`
  res.status(200).json({
    ok: true,
    url,
    mime: file.mimetype,
    size: file.size,
    originalName: file.originalname,
  })
})

export default router
