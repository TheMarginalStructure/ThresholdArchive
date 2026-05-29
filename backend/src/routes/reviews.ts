import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/v1/reviews - 获取评价列表
router.get('/', async (req, res) => {
  try {
    const { rating, verified } = req.query

    const where: Record<string, any> = {}
    if (rating) where.rating = Number(rating)
    if (verified) where.verified = verified === 'true'

    const reviews = await prisma.review.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })

    res.json(reviews)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/v1/reviews/:id - 获取单个评价
router.get('/:id', async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!review) return res.status(404).json({ error: '评价不存在' })
    res.json(review)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router