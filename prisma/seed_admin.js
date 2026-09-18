const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

async function main() {
  console.log('🌱 Seeding Admin accounts into database...');

  // 1. Primary Default Admin: admin@cyberstyle.net / Admin123456!
  const adminPass = 'Admin123456!';
  const adminHash = await hashPassword(adminPass);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cyberstyle.net' },
    update: {
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
    },
    create: {
      email: 'admin@cyberstyle.net',
      name: 'CYBERSTYLE Executive Admin',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const existingProfile = await prisma.adminProfile.findUnique({
    where: { userId: adminUser.id },
  });
  if (!existingProfile) {
    await prisma.adminProfile.create({
      data: {
        userId: adminUser.id,
        department: 'Executive Leadership',
        permissions: ['*'],
      },
    });
  }
  console.log(`✅ Default Admin seeded: ${adminUser.email} (Password: ${adminPass})`);

  // 2. Personal Admin: hani.sites@gmail.com / AdminHani2026!#Secure
  const haniPass = 'AdminHani2026!#Secure';
  const haniHash = await hashPassword(haniPass);

  const haniUser = await prisma.user.upsert({
    where: { email: 'hani.sites@gmail.com' },
    update: {
      passwordHash: haniHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
    },
    create: {
      email: 'hani.sites@gmail.com',
      name: 'Hani',
      passwordHash: haniHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const existingHaniProfile = await prisma.adminProfile.findUnique({
    where: { userId: haniUser.id },
  });
  if (!existingHaniProfile) {
    await prisma.adminProfile.create({
      data: {
        userId: haniUser.id,
        department: 'Executive Leadership',
        permissions: ['*'],
      },
    });
  }
  console.log(`✅ Personal Admin seeded: ${haniUser.email} (Password: ${haniPass})`);
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
