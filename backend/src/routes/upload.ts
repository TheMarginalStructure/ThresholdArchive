import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = Router()

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(png|jpg|jpeg|gif|webp|svg)$/i
    if (allowed.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('仅支持图片格式: PNG, JPG, JPEG, GIF, WEBP, SVG'))
    }
  },
})

// 配置视频上传
const videoUpload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(mp4|webm|ogg|mov|avi)$/i
    if (allowed.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('仅支持视频格式: MP4, WEBM, OGG, MOV, AVI'))
    }
  },
})

// POST /api/v1/upload - 上传单张图片
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片文件' })
    }
    const url = `/api/v1/uploads/${req.file.filename}`
    res.json({ url, filename: req.file.filename, size: req.file.size })
  } catch (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
  }
})

// POST /api/v1/upload/video - 上传视频
router.post('/video', videoUpload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传视频文件' })
    }
    const url = `/api/v1/uploads/${req.file.filename}`
    res.json({ url, filename: req.file.filename, size: req.file.size })
  } catch (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
  }
})

export default router
