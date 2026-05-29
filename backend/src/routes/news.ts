import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/news - 获取新闻列表
router.get('/', async (req, res) => {
  try {
    const { category, priority, featured, limit = '20', page = '1' } = req.query

    const where: Record<string, any> = {}
    if (category) where.category = category as string
    if (priority) where.priority = priority as string
    if (featured === 'true') where.featured = true

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const [data, total] = await Promise.all([
      prisma.newsBulletin.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      prisma.newsBulletin.count({ where }),
    ])

    res.json({ data, total, page: Number(page), limit: Number(limit) })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/news/featured - 获取推荐新闻
router.get('/featured', async (req, res) => {
  try {
    const data = await prisma.newsBulletin.findMany({
      where: { featured: true },
      orderBy: [{ publishedAt: 'desc' }],
      take: 4,
    })
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/news/:id - 获取新闻详情
router.get('/:id', async (req, res) => {
  try {
    const news = await prisma.newsBulletin.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!news) return res.status(404).json({ error: '新闻不存在' })
    res.json(news)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
