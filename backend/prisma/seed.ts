import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { role: 'ADMIN' },
    { role: 'USER' },
    { role: 'MODERATOR' },
    { role: 'SUPER_ADMIN' },
  ];

  for (const r of roles) {
    await prisma.roles.upsert({
      where: {
        role: r.role,
      },
      update: {},
      create: r,
    });
  }

  console.log('✅ Roles seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });