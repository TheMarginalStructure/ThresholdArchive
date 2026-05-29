const fs = require('fs')
const path = require('path')

// 从 threatFiles.ts 提取的 accessLevel 映射
const threatFilesAccessLevel = {
  'TMS-O0881': '4级',
  'TMS-L0234': '3级',
  'TMS-E0771': '2级',
  'TMS-O0442': '3级',
  'TMS-P0990': '5级',
  'TMS-O2847': '3级',
  'TMS-T0112': '3级',
  'TMS-L0735': '5级',
  'TMS-C0098': '3级',
}

const filePath = path.join(__dirname, '..', 'prisma', 'data', 'threatFiles.json')
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

let fixed = 0
for (const item of data) {
  const expected = threatFilesAccessLevel[item.code]
  if (expected && item.accessLevel !== expected) {
    console.log(`Fix ${item.code}: "${item.accessLevel}" → "${expected}"`)
    item.accessLevel = expected
    fixed++
  }
  if (expected && !item.accessLevel) {
    console.log(`Set ${item.code}: → "${expected}"`)
    item.accessLevel = expected
    fixed++
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
console.log(`\nFixed ${fixed} accessLevels in threatFiles.json`)

// Now fix other data files
const otherFiles = {
  'explorationLogs.json': {
    'EXP-O0881': '3级', 'EXP-L0234': '3级', 'EXP-E0771': '2级',
    'EXP-L0734': '3级', 'EXP-O0442': '3级', 'EXP-L0735': '3级',
  },
  'incidentReports.json': {
    'EVT-P0990-INC': '5级',
  },
  'communicationTranscripts.json': {
    'EVT-O2847-COM': '3级',
  },
  'experimentLogs.json': {
    'EXP-O0442-PHY': '3级',
  },
  'medicalReports.json': {
    'MED-L0734': '3级', 'MED-E0771': '2级', 'MED-P0990': '5级',
  },
  'protocolManuals.json': {
    'PRT-0001': null, 'PRT-0002': null, 'PRT-0003': null,
    'PRT-0004': null, 'PRT-0005': null,
  },
  'theoreticalDocuments.json': {
    'THY-O0881': null, 'THY-L0234': null,
  },
  'personnelFiles.json': {
    'HR-300002': null,
  },
}

for (const [file, map] of Object.entries(otherFiles)) {
  const fp = path.join(__dirname, '..', 'prisma', 'data', file)
  if (!fs.existsSync(fp)) continue
  const d = JSON.parse(fs.readFileSync(fp, 'utf-8'))
  for (const item of d) {
    if (!item.accessLevel && map[item.code]) {
      console.log(`Set ${item.code} (${file}): → "${map[item.code]}"`)
      item.accessLevel = map[item.code]
      fixed++
    }
  }
  fs.writeFileSync(fp, JSON.stringify(d, null, 2))
}

console.log(`\nTotal fixed: ${fixed} accessLevels`)