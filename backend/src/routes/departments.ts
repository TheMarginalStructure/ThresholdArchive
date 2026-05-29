import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// 列表
router.get('/', async (req, res) => {
  const depts = await prisma.department.findMany({
    include: { leader: true, _count: { select: { personnel: true } } },
    orderBy: { code: 'asc' },
  })
  res.json(depts)
})

// 详情
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const dept = await prisma.department.findUnique({
    where: { id },
    include: {
      leader: true,
      personnel: true,
      sourceArchives: { select: { id: true, code: true, title: true, status: true } },
      respArchives: { select: { id: true, code: true, title: true, status: true } },
    },
  })
  if (!dept) return res.status(404).json({ error: 'Department not found' })
  res.json(dept)
})

// 创建
router.post('/', async (req, res) => {
  const { code, name, nameEn, type, description, leaderId, siteLocation, internalChannel } = req.body
  const dept = await prisma.department.create({
    data: { code, name, nameEn, type, description, leaderId, siteLocation, internalChannel },
  })
  res.status(201).json(dept)
})

// 更新
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const data = req.body
  const dept = await prisma.department.update({ where: { id }, data })
  res.json(dept)
})

// 删除
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await prisma.department.delete({ where: { id } })
  res.status(204).send()
})

export default router
