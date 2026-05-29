// ============================================
// 边际结构档案数据层
// 基于真实档案文件构建的统一数据模型
// ============================================

// --------------------------------------------
// 通用类型定义
// --------------------------------------------

export type ArchiveStatus = '活跃' | '封存' | '销毁待定' | '已销毁' 

export type ThreatLevel = '白色' | '蓝色' | '绿色' | '黄色' | '琥珀色' | '橙色' | '红色' | '黑色'

export type ThreatType = 'E' | 'P' | 'C' | 'T' | 'I' | 'O' | 'CP' | 'EC' | 'OBJ' | 'NEG' | 'LND' | 'ENT' | 'PHY' | 'PSY' | 'RES' | 'INT' | 'INC' | 'SPC' | 'COG' | 'SAF' | 'ARC' | 'CLS' | 'QRY' | 'RUL' | 'SOP'

export type ArchiveCategory =
  | '阈界档案'
  | '勘探实验记录'
  | '事件报告'
  | '事件通信'
  | '人事档案'
  | '医疗报告'
  | '实验记录'
  | '理论文件'
  | '协议手册'

export interface RelatedArchive {
  code: string
  type: ArchiveCategory
  title: string
  relation: string
}

export interface Signature {
  position: string
  name: string
  signature: string
  date: string
  note: string
}

export interface ArchiveBase {
  id: string
  code: string
  title: string
  status: ArchiveStatus
  threatLevel: string
  threatLevelColor: string
  archiveDate: string
  sourceDepartment: string
  accessLevel: string
  responsibleDepartment: string
  leadPerson: string
  lastUpdate: string
  description: string
  mainDangers: string[]
  relatedArchives: RelatedArchive[]
  signatures: Signature[]
  finalReview: string
  reviewStatus: string
  remarks: string
  image?: string
}

// --------------------------------------------
// 威胁档案 (Threat File - TF)
// --------------------------------------------

export interface ThreatProperty {
  category: string
  name: string
  description: string
  scope: string
}

export interface ThreatPhase {
  name: string
  duration: string
  mechanism: string
  manifestation: string
  target: string
  keyIndicator: string
}

export interface ThreatAssessment {
  riskLevel: string
  personnelType: string
  susceptibilityReason: string
  recommendedAction: string
}

export interface ThreatProtocol {
  phase: string
  procedureName: string
  measures: string
  department: string
}

export interface ThreatFile extends ArchiveBase {
  category: '阈界档案' | '阈界档案'
  commonName: string
  archiveNature: string
  coreFeatures: string
  properties: ThreatProperty[]
  phases: ThreatPhase[]
  environmentFeatures: {
    physical: string[]
    cognitive: string[]
  }
  knownEntities: {
    name: string
    type: string
    behavior: string
    mechanism: string
    dangerLevel: string
    contactRecord: string
  }[]
  discoveryLocation: string
  anomalyReport: string
  responseTeam: string
  threatAssessments: ThreatAssessment[]
  comparisonThreats?: {
    item: string
    thisThreat: string
    otherThreat: string
  }[]
  protocols: ThreatProtocol[]
  accessRequirements: { allowed: boolean; text: string }[]
  emergencyProcedures: { allowed: boolean; text: string }[]
  behaviorGuidelines: { allowed: boolean; text: string }[]
}

// --------------------------------------------
// 勘探报告 (Exploration Log - EL)
// --------------------------------------------

export interface TimelineEntry {
  timestamp: string
  phase: string
  event: string
  status: string
  note: string
}

export interface EquipmentItem {
  name: string
}

export interface Discovery {
  type: string
  description: string
  threatLevel: string
}

export interface TeamMember {
  role: string
  name: string
  field: string
  clearance: string
}

export interface ExplorationLog extends ArchiveBase {
  category: '勘探实验记录'
  missionCode: string
  targetThreshold: string
  team: string
  teamLeader: string
  explorationDate: string
  missionStatus: string
  missionOverview: string
  teamMembers: TeamMember[]
  equipment: EquipmentItem[]
  timeline: TimelineEntry[]
  discoveries: Discovery[]
  analysis: {
    completionRate: string
    personnelStatus: string
    dataRecoveryRate: string
    coreMechanismConfirmed: string
    theoreticalResearch: string
  }
  lessons: string[]
  safetyRecommendations: { type: string; measures: string }[]
  followUpActions: string[]
}

// --------------------------------------------
// 事件报告 (Incident Report - IR)
// --------------------------------------------

export interface IncidentEvent {
  time: string
  description: string
  threatLevel: string
  response: string
}

export interface ResponseMeasure {
  department: string
  measureType: string
  action: string
  status: string
}

export interface CurrentStatus {
  indicator: string
  assessment: string
}

export interface IncidentReport extends ArchiveBase {
  category: '事件报告'
  incidentNature: string
  symptomCharacteristics: string
  confirmedCause: string
  transmissionMechanism: string
  threatAssessment: string
  events: IncidentEvent[]
  responseMeasures: ResponseMeasure[]
  currentStatus: CurrentStatus[]
  appendices: { code: string; title: string; description: string }[]
}

// --------------------------------------------
// 人事档案 (Human Resources - HR)
// --------------------------------------------

export interface PersonnelInfo {
  name: string
  id: string
  code: string
  department: string
  position: string
  hireDate: string
  archiveDate: string
  lastUpdate: string
}

export interface Education {
  background: string
}

export interface WorkExperience {
  period: string
  organization: string
  position: string
}

export interface PerformanceRecord {
  time: string
  workItem: string
  evaluation: string
  recorder: string
}

export interface TrainingRecord {
  time: string
  content: string
  participation: string
  effect: string
}

export interface PersonnelEvaluation {
  dimension: string
  result: string
  performance: string
  suggestion: string
}

export interface CareerSuggestion {
  direction: string
  suggestion: string
  time: string
  expectedEffect: string
}

export interface SpecialNote {
  note: string
  detail: string
  validPeriod: string
}

export interface ArchiveChange {
  time: string
  content: string
  reason: string
  operator: string
}

export interface AccessRecord {
  time: string
  accessor: string
  purpose: string
  authorizer: string
}

export interface PersonnelFile extends ArchiveBase {
  category: '人事档案'
  personnelInfo: PersonnelInfo
  education: Education
  workExperience: WorkExperience[]
  skills: string[]
  qualifications: string[]
  performanceRecords: PerformanceRecord[]
  trainingRecords: TrainingRecord[]
  evaluations: PersonnelEvaluation[]
  careerSuggestions: CareerSuggestion[]
  specialNotes: SpecialNote[]
  archiveChanges: ArchiveChange[]
  accessRecords: AccessRecord[]
  appendices: { code: string; content: string; type: string; location: string }[]
}

// --------------------------------------------
// 医疗报告 (Medical & Health Report - MHR)
// --------------------------------------------

export interface ClinicalStage {
  stage: string
  timeFeature: string
  symptoms: string
  psychologicalImpact: string
  physiologicalBasis: string
}

export interface TreatmentDifficulty {
  type: string
  description: string
}

export interface TreatmentPlan {
  stage: string
  target: string
  method: string
  measures: string
}

export interface MedicalReport extends ArchiveBase {
  category: '医疗报告'
  executiveSummary: { item: string; conclusion: string }[]
  mechanismAnalysis: { dimension: string; description: string }[]
  coreHazards: { type: string; mechanism: string }[]
  clinicalStages: ClinicalStage[]
  treatmentDifficulties: TreatmentDifficulty[]
  treatmentPlans: TreatmentPlan[]
  threatAssessment: string
  recommendations: { type: string; measures: string }[]
  appendices: { code: string; content: string }[]
}

// --------------------------------------------
// 实验记录 (Experiment Log - EXP)
// --------------------------------------------

export interface ExperimentObjective {
  code: string
  objective: string
  expectedResult: string
}

export interface ExperimentEnvironment {
  parameter: string
  specification: string
}

export interface ExperimentTeamMember {
  role: string
  name: string
  field: string
  clearance: string
}

export interface TestResult {
  item: string
  measuredValue: string
  standardValue: string
  anomalyLevel: string
}

export interface ExperimentRound {
  round: string
  inducedEmotion: string
  contactDuration: string
  distance: string
  observedEffect: string
  intensity: string
}

export interface RiskAssessment {
  riskType: string
  threatLevel: string
  probability: string
  potentialConsequence: string
  mitigation: string
}

export interface ExperimentConclusion {
  finding: string
  description: string
}

export interface ExperimentLog extends ArchiveBase {
  category: '实验记录'
  experimentDate: string
  leadDepartment: string
  experimentLead: string
  reviewStatus: string
  dataSource: string
  contentScope: string
  experimentPurpose: string
  experimentType: string
  safetyLevel: string
  objectives: ExperimentObjective[]
  objectDescription: string
  knownCharacteristics: string[]
  environment: ExperimentEnvironment[]
  team: ExperimentTeamMember[]
  testResults: TestResult[]
  experimentRounds: ExperimentRound[]
  observations: { time: string; note: string }[]
  riskAssessments: RiskAssessment[]
  safetyRequirements: string[]
  recommendedMeasures: string[]
  conclusions: ExperimentConclusion[]
  threatLevelAssessment: string
  followUpSuggestions: { type: string; content: string; priority: string }[]
}

// --------------------------------------------
// 理论文件 (Theoretical Document - TD)
// --------------------------------------------

export interface TheoryComponent {
  component: string
  function: string
  mechanism: string
}

export interface HypothesisVerification {
  hypothesis: string
  status: string
  evidence: string
  confidence: string
}

export interface PersonnelScreening {
  category: string
  type: string
  riskLevel: string
  action: string
  reason: string
}

export interface TheoreticalDocument extends ArchiveBase {
  category: '理论文件'
  abstract: string
  introduction: string
  coreConcept: string
  theoryComponents: TheoryComponent[]
  phases: {
    name: string
    duration: string
    mechanism: string
    target: string
  }[]
  comparisonAnalysis?: {
    dimension: string
    thisEntity: string
    otherEntity: string
  }[]
  caseReevaluation: string
  personnelScreening: PersonnelScreening[]
  equipmentProtocols: string[]
  ultimateStrategy: string
  hypothesisVerifications: HypothesisVerification[]
  appendices: { code: string; title: string; relation: string }[]
  appendixFiles: string[]
}

// --------------------------------------------
// 通信记录 (Communication Transcript - COM)
// --------------------------------------------

export interface CommunicationEntry {
  timestamp: string
  party: string
  content: string
  note: string
}

export interface KeyEvent {
  code: string
  description: string
  impact: string
  response: string
}

export interface AnalysisItem {
  item: string
  conclusion: string
}

export interface SuggestedMeasure {
  type: string
  measures: string
}

export interface CommunicationTranscript extends ArchiveBase {
  category: '事件通信'
  communicationType: string
  communicationTime: string
  channel: string
  mainParties: string
  purpose: string
  entries: CommunicationEntry[]
  keyEvents: KeyEvent[]
  analysis: AnalysisItem[]
  suggestedMeasures: SuggestedMeasure[]
  appendices: { code: string; content: string }[]
}

// --------------------------------------------
// 协议手册 (Protocol Manual - PRT)
// --------------------------------------------

export interface ProtocolSection {
  title: string
  content: string
}

export interface ProtocolManual extends ArchiveBase {
  category: '协议手册'
  version: string
  effectiveDate: string
  scope: string
  sections: ProtocolSection[]
}

// --------------------------------------------
// 联合类型
// --------------------------------------------

export type Archive =
  | ThreatFile
  | ExplorationLog
  | IncidentReport
  | PersonnelFile
  | MedicalReport
  | ExperimentLog
  | TheoreticalDocument
  | CommunicationTranscript
  | ProtocolManual

// --------------------------------------------
// 辅助函数
// --------------------------------------------

export function getCategoryColor(category: ArchiveCategory): string {
  const colors: Record<ArchiveCategory, string> = {
    '阈界档案': '#e60012',
    '勘探实验记录': '#d4a373',
    '事件报告': '#ff6b6b',
    '事件通信': '#ff6b6b',
    '人事档案': '#4ade80',
    '医疗报告': '#60a5fa',
    '实验记录': '#a78bfa',
    '理论文件': '#f472b6',
    '协议手册': '#888888',
  }
  return colors[category] || '#888888'
}

export function getCategoryCode(category: ArchiveCategory): string {
  const codes: Record<ArchiveCategory, string> = {
    '阈界档案': 'TMS',
    '勘探实验记录': 'EXP',
    '事件报告': 'EVT',
    '事件通信': 'COM',
    '人事档案': 'HR',
    '医疗报告': 'MED',
    '实验记录': 'EL',
    '理论文件': 'THY',
    '协议手册': 'PRT',
  }
  return codes[category] || 'UNK'
}

export function getThreatLevelColor(colorName: string): string {
  const colors: Record<string, string> = {
    '白色': '#e0e0e0',
    '蓝色': '#4a9eff',
    '绿色': '#4ade80',
    '黄色': '#facc15',
    '琥珀色': '#f59e0b',
    '橙色': '#f97316',
    '红色': '#e60012',
    '黑色': '#666666',
  }
  return colors[colorName] || '#888888'
}
