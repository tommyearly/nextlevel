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

## Faster builds (optional)

If deploys are slow, set **`SKIP_DB_PUSH=1`** in Vercel. The build will skip `prisma db push` and finish in ~1–2 min. When you change the Prisma schema, run **`npx prisma db push`** once locally (with `DATABASE_URL` or `POSTGRES_PRISMA_URL` pointing at your Supabase DB), then deploy as usual.

## Local development

Set **`DATABASE_URL`** (or **`POSTGRES_PRISMA_URL`**) to your Postgres URL, e.g. the same Supabase/Neon URL or `postgresql://user:pass@localhost:5432/dbname`.
