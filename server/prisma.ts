import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from './env';

const globalForPrisma = globalThis as typeof globalThis & {
  dreamShopPrisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  getDatabaseUrl();

  if (!globalForPrisma.dreamShopPrisma) {
    globalForPrisma.dreamShopPrisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  return globalForPrisma.dreamShopPrisma;
}
