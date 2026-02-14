# Next Level Web

Production-ready marketing site for **nextlevelweb.ie** — a web design and development agency. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Important:** Always run `npm run dev` from this folder (do not run `next dev`). If you see "Can't resolve next/dist/pages/_app" or "useReducer" errors, the global Next was used. Fix: uninstall global Next (`npm uninstall -g next`), delete the build cache (`rmdir /s /q .next` or `Remove-Item -Recurse -Force .next`), then run `npm run dev` again.

## Scripts

| Command       | Description          |
| ------------- | -------------------- |
| `npm run dev` | Start dev server     |
| `npm run build` | Production build   |
| `npm run start` | Start production  |
| `npm run lint` | Run ESLint          |
| `npm run format` | Run Prettier      |

## Project structure

- **`/app`** — App Router pages and layout (`layout.tsx`, `page.tsx`, `globals.css`, `services`, `projects`, `contact`, `api/contact`)
- **`/components`** — Reusable UI: Navbar, Footer, Hero, Services, Process, ProjectsPreview, CTA, GlassCard, GradientButton, ContactForm

## Design

- Dark-first theme: navy/charcoal base, electric blue and violet accents, glassmorphism, gradient borders, glow effects.
- Typography: Space Grotesk (headings), Inter (body), via `next/font`.
- Custom Tailwind theme in `tailwind.config.ts` (brand colours, glow shadows, gradient presets, animations).

## Deployment (Vercel)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), import the project and leave default settings (Build: `next build`, Output: default).
3. Add environment variables if needed (e.g. for the contact API).
4. Connect your domain (e.g. `nextlevelweb.ie`) in Project Settings → Domains and ensure DNS is configured.

The app is Vercel-ready with no extra config required for a standard Next.js 14 build.

## Contact form

The contact page posts to `/api/contact`. The route currently validates input and returns success; integrate your preferred provider (e.g. Resend, SendGrid) or database to send/store submissions.

## Reference

See **PROJECT_BRIEF.md** for the full build prompt and design/tech notes.
