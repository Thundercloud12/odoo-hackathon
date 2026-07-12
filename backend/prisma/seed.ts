import { PrismaClient, DriverStatus, VehicleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('seeding db');

  // company
  const company = await prisma.companies.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'TransitOps Logistics' },
  });
  console.log(`created Company: ${company.name}`);

  //role
  const role = await prisma.roles.upsert({
    where: { role: 'Driver' },
    update: {},
    create: { role: 'Driver' },
  });
  console.log(`created Role: ${role.role}`);

  // user
  const user = await prisma.users.upsert({
    where: { email: 'alex@transitops.com' },
    update: {},
    create: {
      company_id: company.id,
      role_id: role.id,
      name: 'Alex',
      email: 'alex@transitops.com',
      password: 'password123',
    },
  });
  console.log(`created User: ${user.name}`);

  // driver
  const driver = await prisma.driver.upsert({
    where: { driver_id: user.id },
    update: {},
    create: {
      license_no: 'DL-123456789',
      driver_id: user.id,
      status: DriverStatus.Available,
      safety_score: 98.5,
      license_type: 'Commercial',
      expiry_date: new Date('2029-12-31'),
    },
  });
  console.log(`created Driver (ID: ${driver.driver_id})`);

  // vehicle
  const vehicle = await prisma.vehicles.upsert({
    where: { reg_no: 'VAN-05' },
    update: { status: VehicleStatus.Available, company_id: company.id },
    create: {
      reg_no: 'VAN-05',
      company_id: company.id,
      vehicle_model: 'Ford Transit',
      type: 'Van',
      load_capacity: 500,
      odometer_reading: 15000,
      cost: 45000,
      status: VehicleStatus.Available,
    },
  });
  console.log(`created vehicle (Reg No: ${vehicle.reg_no}, Capacity: 500kg)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });