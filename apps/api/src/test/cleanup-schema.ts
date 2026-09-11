import { prisma } from '../config/db';

async function cleanup() {
  try {
    await prisma.$executeRawUnsafe(`UPDATE "BlogPost" SET "authorId" = NULL WHERE "authorId" IS NOT NULL;`);
    console.log('✅ Cleaned orphaned authorId on BlogPost');
  } catch (e: any) {
    console.log('Note on cleanup:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
