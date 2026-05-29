const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:915049@localhost:5432/threshold_archive?schema=public'
    }
  }
});

async function main() {
  const tables = [
    'department',
    'personnel',
    'archive',
    'archiveRelation',
    'archiveSignature',
    'archiveHistory',
    'explorationTeam',
    'teamMember',
    'newsBulletin',
    'equipmentItem',
    'review',
    'systemAnnouncement',
    'archiveTemplate',
  ];

  const data = {};
  for (const table of tables) {
    const model = prisma[table];
    if (model) {
      data[table] = await model.findMany();
      console.log(`  ${table}: ${data[table].length} 条`);
    }
  }

  const outputPath = path.join(__dirname, '..', 'seed-data-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✅ 导出完成: ${outputPath}`);
  console.log(`   文件大小: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
