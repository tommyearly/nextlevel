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

// Skip db push during Vercel build by default — connection to Supabase from build often times out.
// When you change the schema: run "npx prisma db push" locally (with POSTGRES_PRISMA_URL in .env), then deploy.
const runDbPush = process.env.RUN_DB_PUSH === '1' || process.env.RUN_DB_PUSH === 'true';
if (runDbPush) {
  const DB_PUSH_TIMEOUT_MS = 120000;
  try {
    execSync('prisma db push --skip-generate', {
      stdio: 'inherit',
      env: process.env,
      timeout: DB_PUSH_TIMEOUT_MS,
    });
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      console.error('prisma db push timed out. Run "npx prisma db push" locally instead, then deploy without RUN_DB_PUSH.');
    }
    throw err;
  }
} else {
  console.log('Skipping prisma db push (run "npx prisma db push" locally when schema changes).');
}
execSync('node ./node_modules/next/dist/bin/next build', { stdio: 'inherit', env: process.env });
