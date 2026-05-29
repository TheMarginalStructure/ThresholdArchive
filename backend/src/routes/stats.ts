import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// 全局统计概览
router.get('/overview', async (req, res) => {
  const [
    totalArchives,
    totalPersonnel,
    totalDepartments,
    activeArchives,
    sealedArchives,
    archivedArchives,
  ] = await Promise.all([
    prisma.archive.count(),
    prisma.personnel.count(),
    prisma.department.count(),
    prisma.archive.count({ where: { status: '活跃' } }),
    prisma.archive.count({ where: { status: '封存' } }),
    prisma.archive.count({ where: { status: '在档' } }),
  ])

  // 按类别统计档案
  const byCategory = await prisma.archive.groupBy({
    by: ['category'],
    _count: { id: true },
  })

  // 按威胁等级统计
  const byThreatLevel = await prisma.archive.groupBy({
    by: ['threatLevel'],
    _count: { id: true },
  })

  // 按部门统计人员
  const personnelByDept = await prisma.personnel.groupBy({
    by: ['departmentId'],
    _count: { id: true },
  })

  // 按状态统计人员
  const personnelByStatus = await prisma.personnel.groupBy({
    by: ['status'],
    _count: { id: true },
  })

  res.json({
    overview: {
      totalArchives,
      totalPersonnel,
      totalDepartments,
      activeArchives,
      sealedArchives,
      archivedArchives,
    },
    archivesByCategory: byCategory.map((c) => ({ category: c.category, count: c._count.id })),
    archivesByThreatLevel: byThreatLevel.map((t) => ({ threatLevel: t.threatLevel, count: t._count.id })),
    personnelByDepartment: personnelByDept.map((d) => ({ departmentId: d.departmentId, count: d._count.id })),
    personnelByStatus: personnelByStatus.map((s) => ({ status: s.status, count: s._count.id })),
  })
})

// 档案趋势（最近12个月）
router.get('/archive-trend', async (req, res) => {
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const archives = await prisma.archive.findMany({
    where: { createdAt: { gte: twelveMonthsAgo } },
    select: { createdAt: true, category: true },
    orderBy: { createdAt: 'asc' },
  })

  const trend: Record<string, Record<string, number>> = {}
  archives.forEach((a) => {
    const month = a.createdAt.toISOString().slice(0, 7)
    if (!trend[month]) trend[month] = {}
    if (!trend[month][a.category]) trend[month][a.category] = 0
    trend[month][a.category]++
  })

  res.json(trend)
})

export default router
