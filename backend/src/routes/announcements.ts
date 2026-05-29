import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/v1/announcements - 获取公告列表
router.get('/', async (req, res) => {
  try {
    const announcements = await prisma.systemAnnouncement.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    res.json(announcements)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/v1/announcements/:id - 获取单个公告
router.get('/:id', async (req, res) => {
  try {
    const announcement = await prisma.systemAnnouncement.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!announcement) return res.status(404).json({ error: '公告不存在' })
    res.json(announcement)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router