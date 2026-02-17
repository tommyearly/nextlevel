# Database on Vercel (no Turso)

On Vercel you need a **Postgres** database. SQLite (`file:./dev.db`) does not work there (no persistent disk).

## Option: Vercel Postgres (easiest)

1. In the **Vercel dashboard** → your project → **Storage** tab → **Create Database** → choose **Postgres**.
2. Connect it to your project. Vercel will set **`DATABASE_URL`** for you.
3. Redeploy. The build runs `prisma db push`, which creates the tables in your new Postgres DB.

No extra env vars. Admin magic link and the rest of the app will use this Postgres.

## Other Postgres providers

You can use **Neon** or **Supabase** (free tiers):

1. Create a Postgres database and copy the connection string.
2. In Vercel → **Settings** → **Environment Variables** → add **`DATABASE_URL`** with that URL (use the **pooled** or **transaction** URL if they give you one for serverless).
3. Redeploy. Tables are created on first deploy via `prisma db push`.

## Local development

- Use the same **`DATABASE_URL`** (your Vercel Postgres or Neon URL), or
- Run Postgres locally and set **`DATABASE_URL`** to e.g. `postgresql://user:pass@localhost:5432/nextlevel`.

You do **not** need Turso or VERCEL_DATABASE.md’s Turso steps.
