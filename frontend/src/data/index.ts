// ============================================
// 档案数据统一索引
// ============================================

export * from './archives'

import type { Archive, ArchiveCategory } from './archives'
export type { Archive, ArchiveCategory } from './archives'
export { THREAT_FILES } from './threatFiles'
import { THREAT_FILES } from './threatFiles'
import { EXPLORATION_LOGS } from './explorationLogs'
import { INCIDENT_REPORTS } from './incidentReports'
import { PERSONNEL_FILES } from './personnelFiles'
import { MEDICAL_REPORTS } from './medicalReports'
import { EXPERIMENT_LOGS } from './experimentLogs'
import { THEORETICAL_DOCUMENTS } from './theoreticalDocuments'
import { COMMUNICATION_TRANSCRIPTS } from './communicationTranscripts'
import { PROTOCOL_MANUALS } from './protocolManuals'

// 所有档案的联合数组
export const ALL_ARCHIVES: Archive[] = [
  ...THREAT_FILES,
  ...EXPLORATION_LOGS,
  ...INCIDENT_REPORTS,
  ...PERSONNEL_FILES,
  ...MEDICAL_REPORTS,
  ...EXPERIMENT_LOGS,
  ...THEORETICAL_DOCUMENTS,
  ...COMMUNICATION_TRANSCRIPTS,
  ...PROTOCOL_MANUALS,
]

// 按类别分组的档案
export const ARCHIVES_BY_CATEGORY: Record<ArchiveCategory, Archive[]> = {
  '阈界档案': THREAT_FILES,
  '勘探实验记录': EXPLORATION_LOGS,
  '事件报告': INCIDENT_REPORTS,
  '事件通信': COMMUNICATION_TRANSCRIPTS,
  '人事档案': PERSONNEL_FILES,
  '医疗报告': MEDICAL_REPORTS,
  '实验记录': EXPERIMENT_LOGS,
  '理论文件': THEORETICAL_DOCUMENTS,
  '协议手册': PROTOCOL_MANUALS,
}

// 标准化ID格式（去除特殊字符，转为小写）
function normalizeId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

// 按ID查找档案（支持多种格式匹配）
export function findArchiveById(id: string): Archive | undefined {
  const normalizedId = normalizeId(id)
  return ALL_ARCHIVES.find((a) => normalizeId(a.id) === normalizedId)
}

// 按编码查找档案
export function findArchiveByCode(code: string): Archive | undefined {
  return ALL_ARCHIVES.find((a) => a.code === code)
}

// 按类别查找档案
export function getArchivesByCategory(category: ArchiveCategory): Archive[] {
  return ARCHIVES_BY_CATEGORY[category] || []
}

// 获取所有类别统计
export function getCategoryStats(): { category: ArchiveCategory; count: number; color: string }[] {
  return (Object.keys(ARCHIVES_BY_CATEGORY) as ArchiveCategory[]).map((cat) => ({
    category: cat,
    count: ARCHIVES_BY_CATEGORY[cat].length,
    color: getCategoryColor(cat),
  }))
}

import { getCategoryColor } from './archives'

// 档案类别列表（用于导航）
export const ARCHIVE_CATEGORIES: { category: ArchiveCategory; code: string; description: string }[] = [
  {
    category: '阈界档案',
    code: 'TMS',
    description: '对特定阈界、阈界内实体或异常物体的详细描述和分析',
  },
  {
    category: '勘探实验记录',
    code: 'EXP',
    description: '记录对未知或部分未知阈界的勘探行动',
  },
  {
    category: '事件报告',
    code: 'EVT',
    description: '记录阈界现象溢出到基准现实或组织内部发生的事故',
  },
  {
    category: '事件通信',
    code: 'COM',
    description: '记录与阈界相关的通信记录和交互事件',
  },
  {
    category: '人事档案',
    code: 'HR',
    description: '记录关键员工的背景、技能、心理评估和任务历史',
  },
  {
    category: '医疗报告',
    code: 'MED',
    description: '记录阈界暴露人员的心理和生理健康评估',
  },
  {
    category: '实验记录',
    code: 'EL',
    description: '记录对阈界物品或现象进行的测试',
  },
  {
    category: '理论文件',
    code: 'THY',
    description: '分析员或研究员提出的关于阈界本质、起源、相互联系的理论模型',
  },
  {
    category: '协议手册',
    code: 'PRT',
    description: '标准操作程序汇编',
  },
]
