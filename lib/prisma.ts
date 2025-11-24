import { PrismaClient } from '@prisma/client';
import path from 'path';

// Menambahkan properti cachedPrisma ke global scope agar tidak error di TypeScript
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // memaksa Prisma menggunakan path absolut ke file dev.db
  const filePath = path.join(process.cwd(), 'prisma/dev.db');
  
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:' + filePath,
      },
    },
  });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;