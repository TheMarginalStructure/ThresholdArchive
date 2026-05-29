/**
 * 数据库数据导入脚本
 * 将 seed-data-export.json 中的数据导入到 PostgreSQL 数据库
 * 
 * 用法: node backend/scripts/import-db.js
 */

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
  const filePath = path.join(__dirname, '..', 'seed-data-export.json');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 未找到数据文件: ${filePath}`);
    console.error('   请先运行 export-db.js 导出数据');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log('📦 开始导入数据...\n');

  // 按依赖顺序导入（先导入无外键的表）
  const importOrder = [
    { name: 'systemAnnouncement', model: 'systemAnnouncement', key: 'id' },
    { name: 'review', model: 'review', key: 'id' },
    { name: 'equipmentItem', model: 'equipmentItem', key: 'id' },
    { name: 'newsBulletin', model: 'newsBulletin', key: 'id' },
    { name: 'department', model: 'department', key: 'id' },
    { name: 'personnel', model: 'personnel', key: 'id' },
    { name: 'explorationTeam', model: 'explorationTeam', key: 'id' },
    { name: 'teamMember', model: 'teamMember', key: 'id' },  // composite key
    { name: 'archive', model: 'archive', key: 'id' },
    { name: 'archiveRelation', model: 'archiveRelation', key: 'id' },
    { name: 'archiveSignature', model: 'archiveSignature', key: 'id' },
    { name: 'archiveHistory', model: 'archiveHistory', key: 'id' },
    { name: 'archiveTemplate', model: 'archiveTemplate', key: 'id' },
  ];

  for (const { name, model, key } of importOrder) {
    const items = data[name];
    if (!items || items.length === 0) {
      console.log(`  ${name}: 0 条（跳过）`);
      continue;
    }

    let imported = 0;
    for (const item of items) {
      try {
        // 对于 DateTime 字段，转换字符串为 Date 对象
        const cleaned = JSON.parse(JSON.stringify(item), (k, v) => {
          if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)) {
            return new Date(v);
          }
          return v;
        });

        // 对于 teamMember 这种复合主键，使用 upsert
        if (model === 'teamMember') {
          await prisma[model].upsert({
            where: { teamId_personnelId: { teamId: item.teamId, personnelId: item.personnelId } },
            update: cleaned,
            create: cleaned,
          });
        } else {
          await prisma[model].upsert({
            where: { [key]: item[key] },
            update: cleaned,
            create: cleaned,
          });
        }
        imported++;
      } catch (e) {
        console.error(`  ⚠ ${name} id=${item[key]} 导入失败: ${e.message}`);
      }
    }
    console.log(`  ${name}: ${imported}/${items.length} 条`);
  }

  console.log(`\n✅ 导入完成！`);
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
