import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import departmentRoutes from './routes/departments'
import personnelRoutes from './routes/personnel'
import archiveRoutes from './routes/archives'
import statsRoutes from './routes/stats'
import newsRoutes from './routes/news'
import equipmentRoutes from './routes/equipment'
import reviewsRoutes from './routes/reviews'
import announcementsRoutes from './routes/announcements'
import uploadRoutes from './routes/upload'
import cmsRoutes from './routes/cms'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 健康检查
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api/v1/departments', departmentRoutes)
app.use('/api/v1/personnel', personnelRoutes)
app.use('/api/v1/archives', archiveRoutes)
app.use('/api/v1/stats', statsRoutes)
app.use('/api/v1/news', newsRoutes)
app.use('/api/v1/equipment', equipmentRoutes)

// 评价路由
app.use('/api/v1/reviews', reviewsRoutes)

// 公告路由
app.use('/api/v1/announcements', announcementsRoutes)
app.use('/api/v1/upload', uploadRoutes)
app.use('/api/v1/cms', cmsRoutes)

// 静态文件服务（上传的图片）
app.use('/api/v1/uploads', express.static(path.join(process.cwd(), 'uploads')))

// 静态文件服务（种子数据引用的图片）
app.use('/api/v1/assets', express.static(path.join(process.cwd(), 'public', 'assets')))

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`[边际结构 API] 服务运行于 http://localhost:${PORT}`)
})
