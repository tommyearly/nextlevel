#!/usr/bin/env node
/**
 * Build script: set DATABASE_URL from POSTGRES_PRISMA_URL if needed, then prisma db push + next build.
 * Vercel may not pass env vars into shell; Node sees process.env correctly.
 */
const { execSync } = require('child_process');

const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
if (!url || url.trim() === '') {
  console.error('Missing DATABASE_URL and POSTGRES_PRISMA_URL. Add Supabase/Postgres and connect to the project.');
  process.exit(1);
}
process.env.DATABASE_URL = url;

const skipDbPush = process.env.SKIP_DB_PUSH === '1' || process.env.SKIP_DB_PUSH === 'true';
if (!skipDbPush) {
  const DB_PUSH_TIMEOUT_MS = 120000; // 2 min max — avoid 40+ min hangs
  try {
    execSync('prisma db push --skip-generate', {
      stdio: 'inherit',
      env: process.env,
      timeout: DB_PUSH_TIMEOUT_MS,
    });
  } catch (err) {
    if (err.killed && err.signal === 'SIGTERM') {
      console.error('prisma db push timed out. Set SKIP_DB_PUSH=1 in Vercel for faster builds, run db push locally when schema changes.');
    }
    throw err;
  }
} else {
  console.log('Skipping prisma db push (SKIP_DB_PUSH is set).');
}
execSync('node ./node_modules/next/dist/bin/next build', { stdio: 'inherit', env: process.env });
