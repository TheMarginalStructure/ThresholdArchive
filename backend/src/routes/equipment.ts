import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/equipment - 获取装备列表
router.get('/', async (req, res) => {
  try {
    const { category, status, limit = '50', page = '1' } = req.query

    const where: Record<string, any> = {}
    if (category && category !== '全部') where.category = category as string
    if (status) where.status = status as string

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const [data, total] = await Promise.all([
      prisma.equipmentItem.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take,
      }),
      prisma.equipmentItem.count({ where }),
    ])

    // 获取分类统计
    const categoryStats = await prisma.equipmentItem.groupBy({
      by: ['category'],
      _count: { id: true },
    })

    res.json({
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      categories: categoryStats.map((c: { category: string; _count: { id: number } }) => ({ name: c.category, count: c._count.id })),
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/equipment/:id - 获取装备详情
router.get('/:id', async (req, res) => {
  try {
    const equipment = await prisma.equipmentItem.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!equipment) return res.status(404).json({ error: '装备不存在' })
    res.json(equipment)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
