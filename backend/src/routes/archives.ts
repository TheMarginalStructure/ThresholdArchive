import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// 列表（支持多维度筛选）
router.get('/', async (req, res) => {
  const { category, status, threatLevel, sourceDeptId, respDeptId, leadPersonId, search, page = '1', limit = '20' } = req.query
  const where: any = {}

  if (category) where.category = category as string
  if (status) where.status = status as string
  if (threatLevel) where.threatLevel = threatLevel as string
  if (sourceDeptId) where.sourceDepartmentId = parseInt(sourceDeptId as string)
  if (respDeptId) where.responsibleDepartmentId = parseInt(respDeptId as string)
  if (leadPersonId) where.leadPersonId = parseInt(leadPersonId as string)
  if (search) {
    where.OR = [
      { code: { contains: search as string, mode: 'insensitive' } },
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ]
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
  const take = parseInt(limit as string)

  const [archives, total] = await Promise.all([
    prisma.archive.findMany({
      where,
      skip,
      take,
      include: {
        sourceDepartment: { select: { id: true, code: true, name: true } },
        responsibleDepartment: { select: { id: true, code: true, name: true } },
        leadPerson: { select: { id: true, name: true, code: true } },
        _count: { select: { relationsFrom: true, signatures: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.archive.count({ where }),
  ])

  res.json({ data: archives, meta: { total, page: parseInt(page as string), limit: take, totalPages: Math.ceil(total / take) } })
})

// 详情
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const archive = await prisma.archive.findUnique({
    where: { id },
    include: {
      sourceDepartment: true,
      responsibleDepartment: true,
      leadPerson: true,
      signatures: { include: { personnel: true } },
      relationsFrom: {
        include: { relatedArchive: { select: { id: true, code: true, title: true, category: true } } },
      },
      history: { include: { changedBy: true }, orderBy: { changedAt: 'desc' } },
    },
  })
  if (!archive) return res.status(404).json({ error: 'Archive not found' })
  res.json(archive)
})

// 创建
router.post('/', async (req, res) => {
  const { code, category, title, status, threatLevel, threatLevelColor, archiveDate, sourceDepartmentId, responsibleDepartmentId, leadPersonId, accessLevel, description, mainDangers, details, finalReview, reviewStatus, remarks, imagePath, attachmentText } = req.body

  const archive = await prisma.archive.create({
    data: {
      code, category, title, status, threatLevel, threatLevelColor,
      archiveDate: archiveDate ? new Date(archiveDate) : null,
      sourceDepartmentId, responsibleDepartmentId, leadPersonId,
      accessLevel, description, mainDangers, details, finalReview,
      reviewStatus, remarks, imagePath, attachmentText,
    },
  })

  // 记录创建历史
  await prisma.archiveHistory.create({
    data: { archiveId: archive.id, changeType: '创建', newValue: JSON.stringify(archive) },
  })

  res.status(201).json(archive)
})

// 更新
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const oldArchive = await prisma.archive.findUnique({ where: { id } })
  if (!oldArchive) return res.status(404).json({ error: 'Archive not found' })

  const data = req.body
  if (data.archiveDate) data.archiveDate = new Date(data.archiveDate)

  const archive = await prisma.archive.update({ where: { id }, data })

  // 记录变更历史
  await prisma.archiveHistory.create({
    data: {
      archiveId: id,
      changeType: '更新',
      oldValue: JSON.stringify(oldArchive),
      newValue: JSON.stringify(archive),
    },
  })

  res.json(archive)
})

// 删除（软删除，改为'已销毁'状态）
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const archive = await prisma.archive.update({
    where: { id },
    data: { status: '已销毁' },
  })

  await prisma.archiveHistory.create({
    data: { archiveId: id, changeType: '删除', newValue: '状态变更为已销毁' },
  })

  res.json(archive)
})

// 添加关联档案
router.post('/:id/relations', async (req, res) => {
  const archiveId = parseInt(req.params.id)
  const { relatedArchiveId, relationType } = req.body

  const relation = await prisma.archiveRelation.create({
    data: { archiveId, relatedArchiveId: parseInt(relatedArchiveId), relationType },
  })

  res.status(201).json(relation)
})

// 添加签名
router.post('/:id/signatures', async (req, res) => {
  const archiveId = parseInt(req.params.id)
  const { position, name, esigCode, signedDate, note, personnelId } = req.body

  const signature = await prisma.archiveSignature.create({
    data: {
      archiveId, position, name, esigCode,
      signedDate: signedDate ? new Date(signedDate) : null,
      note, personnelId: personnelId ? parseInt(personnelId) : null,
    },
  })

  res.status(201).json(signature)
})

export default router
