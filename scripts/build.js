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

execSync('prisma db push --skip-generate', { stdio: 'inherit', env: process.env });
execSync('node ./node_modules/next/dist/bin/next build', { stdio: 'inherit', env: process.env });
