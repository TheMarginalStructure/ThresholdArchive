import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.archive.updateMany({
    where: {
      category: { not: '阈界档案' },
    },
    data: {
      threatLevel: null,
      threatLevelColor: null,
    },
  })

  console.log(`已更新 ${result.count} 条非阈界档案的威胁等级为空`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())