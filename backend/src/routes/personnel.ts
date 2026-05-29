import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// 列表（支持按部门筛选）
router.get('/', async (req, res) => {
  const { departmentId, status, search } = req.query
  const where: any = {}
  if (departmentId) where.departmentId = parseInt(departmentId as string)
  if (status) where.status = status as string
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { code: { contains: search as string, mode: 'insensitive' } },
      { codename: { contains: search as string, mode: 'insensitive' } },
    ]
  }

  const personnel = await prisma.personnel.findMany({
    where,
    include: { department: true },
    orderBy: { code: 'asc' },
  })
  res.json(personnel)
})

// 详情
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const person = await prisma.personnel.findUnique({
    where: { id },
    include: {
      department: true,
      leadArchives: { select: { id: true, code: true, title: true, category: true } },
      signatures: true,
      teamMemberships: { include: { team: true } },
    },
  })
  if (!person) return res.status(404).json({ error: 'Personnel not found' })
  res.json(person)
})

// 创建
router.post('/', async (req, res) => {
  const { code, name, nameEn, title, codename, departmentId, position, status, specialty, clearanceLevel, esigCode } = req.body
  const person = await prisma.personnel.create({
    data: { code, name, nameEn, title, codename, departmentId, position, status, specialty, clearanceLevel, esigCode },
  })
  res.status(201).json(person)
})

// 更新
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const data = req.body
  const person = await prisma.personnel.update({ where: { id }, data })
  res.json(person)
})

// 删除
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await prisma.personnel.delete({ where: { id } })
  res.status(204).send()
})

export default router
