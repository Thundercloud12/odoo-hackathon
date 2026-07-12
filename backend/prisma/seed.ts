import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing roles before re-seeding
  await prisma.roles.deleteMany();

  const roles = [
    { role: 'ADMIN' },
    { role: 'DRIVER' },
    { role: 'FLEET_MANAGER' },
    { role: 'SAFETY_OFFICER' },
    { role: 'FINANCIAL_ANALYST' },
  ];

  await prisma.roles.createMany({ data: roles });

  console.log('✅ Roles seeded:', roles.map((r) => r.role).join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });