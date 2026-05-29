import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/v1/cms/archives/:id - 获取单个档案（编辑模式用）
router.get('/archives/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const archive = await prisma.archive.findUnique({
      where: { id },
      include: { signatures: true },
    })
    if (!archive) return res.status(404).json({ error: 'Archive not found' })
    res.json(archive)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/v1/cms/archives - 创建档案
router.post('/archives', async (req, res) => {
  try {
    const {
      code, category, title, status, threatLevel, threatLevelColor,
      archiveDate, accessLevel, description, mainDangers, details,
      finalReview, reviewStatus, remarks, imagePath, attachmentText,
      sourceDepartmentId, responsibleDepartmentId, leadPersonId, signatures,
      customTemplate, useCustomTemplate, videoPath,
    } = req.body

    const archive = await prisma.archive.create({
      data: {
        code, category, title, status,
        threatLevel: category === '阈界档案' ? threatLevel : null,
        threatLevelColor: category === '阈界档案' ? threatLevelColor : null,
        archiveDate: archiveDate ? new Date(archiveDate) : null,
        accessLevel, description, mainDangers: mainDangers || [], details,
        finalReview, reviewStatus, remarks, imagePath, attachmentText,
        customTemplate: customTemplate || '',
        useCustomTemplate: useCustomTemplate || false,
        videoPath: videoPath || null,
        sourceDepartmentId: sourceDepartmentId ? Number(sourceDepartmentId) : null,
        responsibleDepartmentId: responsibleDepartmentId ? Number(responsibleDepartmentId) : null,
        leadPersonId: leadPersonId ? Number(leadPersonId) : null,
        signatures: signatures && signatures.length > 0 ? {
          create: signatures.map((sig: any) => ({
            position: sig.position || '',
            name: sig.name || '',
            esigCode: sig.esigCode || null,
            note: sig.note || null,
            personnelId: sig.personId ? Number(sig.personId) : null,
          })),
        } : undefined,
      },
    })
    res.status(201).json(archive)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/v1/cms/archives/:id - 更新档案
router.put('/archives/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      code, category, title, status, threatLevel, threatLevelColor,
      archiveDate, accessLevel, description, mainDangers, details,
      finalReview, reviewStatus, remarks, imagePath, attachmentText,
      sourceDepartmentId, responsibleDepartmentId, leadPersonId, signatures,
      customTemplate, useCustomTemplate, videoPath,
    } = req.body

    const updateData: any = {
      code, category, title, status,
      threatLevel: category === '阈界档案' ? threatLevel : null,
      threatLevelColor: category === '阈界档案' ? threatLevelColor : null,
      archiveDate: archiveDate ? new Date(archiveDate) : null,
      accessLevel, description, mainDangers: mainDangers || [], details,
      finalReview, reviewStatus, remarks, imagePath, attachmentText,
    }

    if (customTemplate !== undefined) updateData.customTemplate = customTemplate
    if (useCustomTemplate !== undefined) updateData.useCustomTemplate = useCustomTemplate
    if (videoPath !== undefined) updateData.videoPath = videoPath

    if (sourceDepartmentId !== undefined) updateData.sourceDepartmentId = sourceDepartmentId ? Number(sourceDepartmentId) : null
    if (responsibleDepartmentId !== undefined) updateData.responsibleDepartmentId = responsibleDepartmentId ? Number(responsibleDepartmentId) : null
    if (leadPersonId !== undefined) updateData.leadPersonId = leadPersonId ? Number(leadPersonId) : null

    if (signatures !== undefined) {
      updateData.signatures = {
        deleteMany: {},
        create: signatures && signatures.length > 0 ? signatures.map((sig: any) => ({
          position: sig.position || '',
          name: sig.name || '',
          esigCode: sig.esigCode || null,
          note: sig.note || null,
          personnelId: sig.personId ? Number(sig.personId) : null,
        })) : [],
      }
    }

    const archive = await prisma.archive.update({
      where: { id: Number(id) },
      data: updateData,
    })
    res.json(archive)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/v1/cms/archives/:id - 删除档案
router.delete('/archives/:id', async (req, res) => {
  try {
    await prisma.archive.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/v1/cms/news - 创建新闻
router.post('/news', async (req, res) => {
  try {
    const { code, title, summary, content, category, priority, featured, imageUrl, publishedAt } = req.body

    const news = await prisma.newsBulletin.create({
      data: {
        code, title, summary, content, category, priority,
        featured: featured || false,
        imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    })
    res.status(201).json(news)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/v1/cms/news/:id - 更新新闻
router.put('/news/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { code, title, summary, content, category, priority, featured, imageUrl, publishedAt } = req.body

    const news = await prisma.newsBulletin.update({
      where: { id: Number(id) },
      data: {
        code, title, summary, content, category, priority,
        featured,
        imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    })
    res.json(news)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/v1/cms/news/:id - 删除新闻
router.delete('/news/:id', async (req, res) => {
  try {
    await prisma.newsBulletin.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ======== 装备管理 ========

// POST /api/v1/cms/equipment - 创建装备
router.post('/equipment', async (req, res) => {
  try {
    const { code, name, subtitle, description, category, price, currency, originalPrice, stock, status, badge, imageUrl } = req.body
    const item = await prisma.equipmentItem.create({
      data: {
        code, name, subtitle, description, category,
        price: price ? Number(price) : null,
        currency, originalPrice,
        stock: stock ? Number(stock) : 0,
        status: status || 'available',
        badge, imageUrl,
      },
    })
    res.status(201).json(item)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/v1/cms/equipment/:id - 更新装备
router.put('/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { code, name, subtitle, description, category, price, currency, originalPrice, stock, status, badge, imageUrl } = req.body
    const item = await prisma.equipmentItem.update({
      where: { id: Number(id) },
      data: {
        code, name, subtitle, description, category,
        price: price !== undefined ? Number(price) : undefined,
        currency, originalPrice,
        stock: stock !== undefined ? Number(stock) : undefined,
        status, badge, imageUrl,
      },
    })
    res.json(item)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/v1/cms/equipment/:id - 删除装备
router.delete('/equipment/:id', async (req, res) => {
  try {
    await prisma.equipmentItem.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ======== 评价管理 ========

// POST /api/v1/cms/reviews - 创建评价
router.post('/reviews', async (req, res) => {
  try {
    const { author, content, rating, date, verified } = req.body
    const review = await prisma.review.create({
      data: {
        author, content,
        rating: Number(rating),
        date: date ? new Date(date) : new Date(),
        verified: verified || false,
      },
    })
    res.status(201).json(review)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/v1/cms/reviews/:id - 更新评价
router.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { author, content, rating, date, verified } = req.body
    const review = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        author, content,
        rating: rating !== undefined ? Number(rating) : undefined,
        date: date ? new Date(date) : undefined,
        verified,
      },
    })
    res.json(review)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/v1/cms/reviews/:id - 删除评价
router.delete('/reviews/:id', async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ======== 系统公告管理 ========

// POST /api/v1/cms/announcements - 创建公告
router.post('/announcements', async (req, res) => {
  try {
    const { title, content, type, order } = req.body
    const announcement = await prisma.systemAnnouncement.create({
      data: {
        title, content,
        type: type || 'info',
        order: order ? Number(order) : 0,
      },
    })
    res.status(201).json(announcement)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/v1/cms/announcements/:id - 更新公告
router.put('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, type, order } = req.body
    const announcement = await prisma.systemAnnouncement.update({
      where: { id: Number(id) },
      data: {
        title, content, type,
        order: order !== undefined ? Number(order) : undefined,
      },
    })
    res.json(announcement)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/v1/cms/announcements/:id - 删除公告
router.delete('/announcements/:id', async (req, res) => {
  try {
    await prisma.systemAnnouncement.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ======== 统计仪表盘 ========

// GET /api/v1/cms/stats - 获取后台统计数据
router.get('/stats', async (req, res) => {
  try {
    const [
      archiveCount, newsCount, equipmentCount,
      reviewCount, announcementCount, reviewVerifiedCount,
    ] = await Promise.all([
      prisma.archive.count(),
      prisma.newsBulletin.count(),
      prisma.equipmentItem.count(),
      prisma.review.count(),
      prisma.systemAnnouncement.count(),
      prisma.review.count({ where: { verified: true } }),
    ])

    res.json({
      archives: archiveCount,
      news: newsCount,
      equipment: equipmentCount,
      reviews: reviewCount,
      reviewsVerified: reviewVerifiedCount,
      announcements: announcementCount,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ======== 模板库管理 ========

// GET /api/v1/cms/templates - 获取所有模板
router.get('/templates', async (_req, res) => {
  try {
    const templates = await prisma.archiveTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(templates)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/v1/cms/templates - 创建模板
router.post('/templates', async (req, res) => {
  try {
    const { name, description, content, category } = req.body
    const template = await prisma.archiveTemplate.create({
      data: { name, description, content, category: category || 'general' },
    })
    res.status(201).json(template)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/v1/cms/templates/:id - 更新模板
router.put('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, content, category } = req.body
    const template = await prisma.archiveTemplate.update({
      where: { id: Number(id) },
      data: { name, description, content, category },
    })
    res.json(template)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/v1/cms/templates/:id - 删除模板
router.delete('/templates/:id', async (req, res) => {
  try {
    await prisma.archiveTemplate.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
