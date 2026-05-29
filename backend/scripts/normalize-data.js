const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'prisma', 'data')

// 合法威胁等级（从 threatFiles.ts 提取）
const validThreatLevels = {
  '琥珀色-C': '琥珀色-C',
  '琥珀色-EC': '琥珀色-EC',
  '琥珀色-PC': '琥珀色-PC',
  '琥珀色-I': '琥珀色-I',
  '黑色-O': '黑色-O',
  '黄色-CP': '黄色-CP',
  '黄色-T': '黄色-T',
  '琥珀色': '琥珀色-C',   // 补默认子类型
  '黄色': '黄色-CP',
  '黑色': '黑色-O',
  '白色': '白色',
  '绿色': '绿色',
  '蓝色': '蓝色',
  '红色': '红色',
  '不适用': null,
  '': null,
  '高（认知危害，模因危害）': '琥珀色-C',
  '中等': null,
  '高': null,
  null: null,
  undefined: null,
}

// 合法访问权限
const validAccessLevels = {
  '1级': '1级', '2级': '2级', '3级': '3级', '4级': '4级', '5级': '5级',
  '机密': '3级', '高度机密': '4级', '绝密': '5级', '公开': '1级', '内部': '2级',
  '1': '1级', '2': '2级', '3': '3级', '4': '4级', '5': '5级',
  '': null, null: null, undefined: null,
}

// 状态标准化
const statusMap = {
  '活跃': '活跃',
  '封存': '封存',
  '已收容': '封存',
  '收容': '封存',
  '在档': '在档',
  '': null,
}

function normalizeArchive(item) {
  const newItem = { ...item }

  if (newItem.threatLevel !== undefined) {
    newItem.threatLevel = validThreatLevels[newItem.threatLevel] ?? null
  }

  if (newItem.accessLevel !== undefined) {
    newItem.accessLevel = validAccessLevels[String(newItem.accessLevel)] ?? null
  }

  if (newItem.status !== undefined) {
    newItem.status = statusMap[newItem.status] ?? newItem.status
  }

  return newItem
}

const files = [
  'threatFiles.json', 'explorationLogs.json', 'incidentReports.json',
  'communicationTranscripts.json', 'experimentLogs.json', 'medicalReports.json',
  'protocolManuals.json', 'theoreticalDocuments.json', 'personnelFiles.json'
]

for (const file of files) {
  const filePath = path.join(dataDir, file)
  if (!fs.existsSync(filePath)) continue
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const normalized = Array.isArray(data) ? data.map(normalizeArchive) : normalizeArchive(data)
  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2))
  console.log(`Normalized ${file} (${data.length} items)`)
}

console.log('Done!')