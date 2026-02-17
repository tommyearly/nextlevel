/**
 * Prisma client singleton for Next.js (avoid multiple instances in dev).
 * Use DATABASE_URL: Postgres on Vercel (Vercel Postgres, Neon, Supabase); locally same or file for SQLite if you switch back.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
