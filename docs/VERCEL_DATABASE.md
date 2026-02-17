# Database on Vercel

On Vercel you need a **Postgres** database. SQLite (`file:./dev.db`) does not work there (no persistent disk).

## Supabase (via Vercel integration)

1. In the **Vercel dashboard** → your project → **Storage** (or **Integrations**) → connect **Supabase**.
2. Create or link a Supabase project. Vercel will add **`POSTGRES_PRISMA_URL`** (and other `POSTGRES_*` vars) to your project.
3. Redeploy. The build uses `POSTGRES_PRISMA_URL` when `DATABASE_URL` is not set; tables are created via `prisma db push`.

No need to add **`DATABASE_URL`** yourself — the app uses **`POSTGRES_PRISMA_URL`** when present.

## Vercel Postgres

1. **Storage** tab → **Create Database** → **Postgres** → connect to your project.
2. Vercel sets **`DATABASE_URL`**. Redeploy.

## Other Postgres (Neon, etc.)

1. Create a Postgres DB and copy the connection string.
2. In Vercel → **Settings** → **Environment Variables** → add **`DATABASE_URL`**.
3. Redeploy.

## Schema changes (db push)

**`prisma db push` is not run during the Vercel build** (the Supabase connection from the build often times out). So:

- **Normal deploys:** Build only runs Next.js — fast.
- **When you change the Prisma schema:** Run **`npx prisma db push`** once **locally** (with `POSTGRES_PRISMA_URL` or `DATABASE_URL` in `.env` pointing at your Supabase DB), then commit and deploy. Tables will already exist in Supabase.

To run db push during the build (not recommended unless you accept possible timeouts), set **`RUN_DB_PUSH=1`** in Vercel.

## Local development

Set **`DATABASE_URL`** (or **`POSTGRES_PRISMA_URL`**) to your Postgres URL, e.g. the same Supabase/Neon URL or `postgresql://user:pass@localhost:5432/dbname`.
