import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

function loadJson(filename: string) {
  const filePath = path.join(__dirname, 'data', filename)
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filename} not found, skipping...`)
    return []
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

async function main() {
  console.log('开始初始化数据...')

  // ========== 1. 创建部门 ==========
  const departments = loadJson('departments.json')
  if (departments.length > 0) {
    await prisma.department.createMany({
      data: departments.map((d: any) => ({
        code: d.code,
        name: d.name,
        nameEn: d.nameEn,
        type: d.type,
        siteLocation: d.siteLocation,
        internalChannel: d.internalChannel,
      })),
      skipDuplicates: true,
    })
    console.log(`导入 ${departments.length} 个部门`)
  }
  const allDepts = await prisma.department.findMany()

  // ========== 2. 创建人员 ==========
  const personnelData = loadJson('personnel.json')
  for (const p of personnelData) {
    const dept = allDepts.find(d => d.code === p.departmentCode)
    await prisma.personnel.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        name: p.name,
        nameEn: p.nameEn || null,
        title: p.title || null,
        codename: p.codename || null,
        departmentId: dept?.id || null,
        position: p.position || null,
        status: p.status || '现役',
        specialty: p.specialty || null,
        clearanceLevel: p.clearanceLevel || 1,
        esigCode: p.esigCode || null,
      },
    })
  }
  console.log(`导入 ${personnelData.length} 个人员`)
  const allPersonnel = await prisma.personnel.findMany()

  // ========== 3. 匹配工具函数 ==========
  function matchDepartment(name: string | null | undefined): number | null {
    if (!name) return null
    const cleaned = name.split(' / ')[0].trim()
    for (const dept of allDepts) {
      if (dept.name.includes(cleaned) || cleaned.includes(dept.name)) {
        return dept.id
      }
    }
    return null
  }

  function matchPersonnel(name: string | null | undefined): number | null {
    if (!name) return null
    const cleaned = name.split(' / ')[0].split('/')[0].replace(/博士|中尉|总指挥|探员|队长|部长/g, '').trim()
    for (const p of allPersonnel) {
      if (p.name === cleaned || p.name.includes(cleaned) || cleaned.includes(p.name)) return p.id
      if (p.codename && (cleaned.includes(p.codename) || p.codename.includes(cleaned))) return p.id
    }
    const nameParts = cleaned.split(/[·\s]/)
    for (const p of allPersonnel) {
      const matchCount = nameParts.filter(part => p.name.includes(part)).length
      if (matchCount >= 2) return p.id
    }
    return null
  }

  function parseDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null
    if (dateStr.includes('数据删除') || dateStr.includes('[')) return null
    // 匹配中文日期 "2025年9月6日" 格式
    const cnMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
    if (cnMatch) return new Date(+cnMatch[1], +cnMatch[2] - 1, +cnMatch[3])
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    return d
  }

  // ========== 4. 创建档案 ==========
  const archiveFiles = [
    { file: 'threatFiles.json', category: '阈界档案' },
    { file: 'explorationLogs.json', category: '勘探实验记录' },
    { file: 'incidentReports.json', category: '事件报告' },
    { file: 'communicationTranscripts.json', category: '事件通信' },
    { file: 'experimentLogs.json', category: '实验记录' },
    { file: 'medicalReports.json', category: '医疗报告' },
    { file: 'protocolManuals.json', category: '协议手册' },
    { file: 'theoreticalDocuments.json', category: '理论文件' },
    { file: 'personnelFiles.json', category: '人事档案' },
  ]

  const createdArchives: { id: number; code: string; category: string; title: string }[] = []
  let totalArchives = 0

  for (const { file, category } of archiveFiles) {
    const items = loadJson(file)
    for (const item of items) {
      const archiveData: any = {
        code: item.code,
        category: item.category || category,
        title: item.title,
        status: item.status || '活跃',
        threatLevel: item.threatLevel || null,
        threatLevelColor: item.threatLevelColor || null,
        archiveDate: parseDate(item.archiveDate),
        accessLevel: item.accessLevel || null,
        description: item.description || null,
        mainDangers: item.mainDangers || [],
        finalReview: item.finalReview || null,
        reviewStatus: item.reviewStatus || '通过',
        remarks: item.remarks || null,
        imagePath: item.image || null,
        sourceDepartmentId: matchDepartment(item.sourceDepartment),
        responsibleDepartmentId: matchDepartment(item.responsibleDepartment),
        leadPersonId: matchPersonnel(item.leadPerson),
      }

      const details: any = {}

      if (category === '阈界档案') {
        Object.assign(details, {
          commonName: item.commonName, archiveNature: item.archiveNature,
          coreFeatures: item.coreFeatures, properties: item.properties,
          phases: item.phases, environmentFeatures: item.environmentFeatures,
          knownEntities: item.knownEntities, discoveryLocation: item.discoveryLocation,
          anomalyReport: item.anomalyReport, responseTeam: item.responseTeam,
          threatAssessments: item.threatAssessments, comparisonThreats: item.comparisonThreats,
          protocols: item.protocols, accessRequirements: item.accessRequirements,
          emergencyProcedures: item.emergencyProcedures, behaviorGuidelines: item.behaviorGuidelines,
        })
      } else if (category === '勘探实验记录') {
        Object.assign(details, {
          missionCode: item.missionCode, targetThreshold: item.targetThreshold,
          team: item.team, teamLeader: item.teamLeader,
          explorationDate: item.explorationDate, missionStatus: item.missionStatus,
          missionOverview: item.missionOverview, teamMembers: item.teamMembers,
          equipment: item.equipment, timeline: item.timeline,
          discoveries: item.discoveries, analysis: item.analysis,
          lessons: item.lessons, safetyRecommendations: item.safetyRecommendations,
          followUpActions: item.followUpActions,
        })
      } else if (category === '事件报告') {
        Object.assign(details, {
          incidentNature: item.incidentNature, symptomCharacteristics: item.symptomCharacteristics,
          confirmedCause: item.confirmedCause, transmissionMechanism: item.transmissionMechanism,
          threatAssessment: item.threatAssessment, events: item.events,
          responseMeasures: item.responseMeasures, currentStatus: item.currentStatus,
          appendices: item.appendices,
        })
      } else if (category === '事件通信') {
        Object.assign(details, {
          communicationType: item.communicationType, communicationTime: item.communicationTime,
          channel: item.channel, mainParties: item.mainParties, purpose: item.purpose,
          entries: item.entries, keyEvents: item.keyEvents,
          analysis: item.analysis, suggestedMeasures: item.suggestedMeasures,
          appendices: item.appendices,
        })
      } else if (category === '实验记录') {
        Object.assign(details, {
          experimentDate: item.experimentDate, leadDepartment: item.leadDepartment,
          experimentLead: item.experimentLead, dataSource: item.dataSource,
          contentScope: item.contentScope, experimentPurpose: item.experimentPurpose,
          experimentType: item.experimentType, safetyLevel: item.safetyLevel,
          objectives: item.objectives, objectDescription: item.objectDescription,
          knownCharacteristics: item.knownCharacteristics, environment: item.environment,
          testResults: item.testResults, experimentRounds: item.experimentRounds,
          observations: item.observations, riskAssessments: item.riskAssessments,
          safetyRequirements: item.safetyRequirements, recommendedMeasures: item.recommendedMeasures,
          conclusions: item.conclusions, threatLevelAssessment: item.threatLevelAssessment,
          followUpSuggestions: item.followUpSuggestions,
        })
      } else if (category === '医疗报告') {
        Object.assign(details, {
          executiveSummary: item.executiveSummary, mechanismAnalysis: item.mechanismAnalysis,
          coreHazards: item.coreHazards, clinicalStages: item.clinicalStages,
          treatmentDifficulties: item.treatmentDifficulties, treatmentPlans: item.treatmentPlans,
          recommendations: item.recommendations, appendices: item.appendices,
        })
      } else if (category === '协议手册') {
        Object.assign(details, {
          version: item.version, effectiveDate: item.effectiveDate,
          scope: item.scope, sections: item.sections,
        })
      } else if (category === '人事档案') {
        Object.assign(details, {
          personnelInfo: item.personnelInfo, education: item.education,
          workExperience: item.workExperience, skills: item.skills,
          qualifications: item.qualifications, performanceRecords: item.performanceRecords,
          trainingRecords: item.trainingRecords, evaluations: item.evaluations,
          careerSuggestions: item.careerSuggestions, specialNotes: item.specialNotes,
          archiveChanges: item.archiveChanges, accessRecords: item.accessRecords,
        })
      } else if (category === '理论文件') {
        Object.assign(details, {
          abstract: item.abstract, introduction: item.introduction,
          coreConcept: item.coreConcept, theoryComponents: item.theoryComponents,
          phases: item.phases, comparisonAnalysis: item.comparisonAnalysis,
          caseReevaluation: item.caseReevaluation, personnelScreening: item.personnelScreening,
          equipmentProtocols: item.equipmentProtocols, ultimateStrategy: item.ultimateStrategy,
          hypothesisVerifications: item.hypothesisVerifications,
          appendices: item.appendices, appendixFiles: item.appendixFiles,
        })
      }

      // 部门与负责人文本（前端回退用）
      if (item.sourceDepartment) details.sourceDepartment = item.sourceDepartment
      if (item.responsibleDepartment) details.responsibleDepartment = item.responsibleDepartment
      if (item.leadPerson) details.leadPerson = item.leadPerson

      archiveData.attachmentText = item.attachmentText || null

      // 清理 undefined
      Object.keys(details).forEach(key => {
        if (details[key] === undefined) delete details[key]
      })

      archiveData.details = details

      const archive = await prisma.archive.upsert({
        where: { code: item.code },
        update: {
          category: archiveData.category,
          title: archiveData.title,
          status: archiveData.status,
          threatLevel: archiveData.threatLevel,
          threatLevelColor: archiveData.threatLevelColor,
          archiveDate: archiveData.archiveDate,
          accessLevel: archiveData.accessLevel,
          description: archiveData.description,
          mainDangers: archiveData.mainDangers,
          finalReview: archiveData.finalReview,
          reviewStatus: archiveData.reviewStatus,
          remarks: archiveData.remarks,
          imagePath: archiveData.imagePath,
          sourceDepartmentId: archiveData.sourceDepartmentId,
          responsibleDepartmentId: archiveData.responsibleDepartmentId,
          leadPersonId: archiveData.leadPersonId,
          details: archiveData.details,
          attachmentText: archiveData.attachmentText,
        },
        create: archiveData,
      })
      createdArchives.push({ id: archive.id, code: archive.code, category: archive.category, title: archive.title })
      totalArchives++
    }
    console.log(`导入 ${items.length} 个${category}`)
  }

  // ========== 5. 创建档案关联关系 ==========
  let relationsCreated = 0
  for (const { file } of archiveFiles) {
    const items = loadJson(file)
    for (const item of items) {
      if (!item.relatedArchives || !Array.isArray(item.relatedArchives)) continue
      const fromArchive = createdArchives.find(a => a.code === item.code)
      if (!fromArchive) continue
      for (const rel of item.relatedArchives) {
        const toArchive = createdArchives.find(a => a.code === rel.code)
        if (!toArchive) continue
        try {
          await prisma.archiveRelation.upsert({
            where: {
              archiveId_relatedArchiveId_relationType: {
                archiveId: fromArchive.id,
                relatedArchiveId: toArchive.id,
                relationType: rel.relation || '参考',
              },
            },
            update: {},
            create: {
              archiveId: fromArchive.id,
              relatedArchiveId: toArchive.id,
              relationType: rel.relation || '参考',
            },
          })
          relationsCreated++
        } catch (_) { /* 已存在跳过 */ }
      }
    }
  }
  if (relationsCreated > 0) console.log(`创建 ${relationsCreated} 个档案关联`)

  // ========== 6. 创建签名 ==========
  let signaturesCreated = 0
  for (const { file } of archiveFiles) {
    const items = loadJson(file)
    for (const item of items) {
      if (!item.signatures || !Array.isArray(item.signatures)) continue
      const archive = createdArchives.find(a => a.code === item.code)
      if (!archive) continue
      for (const sig of item.signatures) {
        const personnelId = matchPersonnel(sig.name)
        try {
          await prisma.archiveSignature.create({
            data: {
              archiveId: archive.id,
              position: sig.position || '',
              name: sig.name || '',
              esigCode: sig.signature || null,
              signedDate: parseDate(sig.date),
              note: sig.note || null,
              personnelId,
            },
          })
          signaturesCreated++
        } catch (_) { /* 重复跳过 */ }
      }
    }
  }
  if (signaturesCreated > 0) console.log(`创建 ${signaturesCreated} 个签名记录`)

  console.log(`\n数据初始化完成！共导入 ${totalArchives} 个档案`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })