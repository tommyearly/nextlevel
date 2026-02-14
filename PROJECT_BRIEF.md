# Next Level Web — Project Brief

## Overview

Production-ready website for **nextlevelweb.ie**  
**Brand:** Next Level Web  
**Industry:** Web Design & Development Agency  

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (latest)
- **ESLint** + **Prettier**
- Fully responsive, performance-optimised, SEO-optimised, accessible (WCAG best practices)

## Design Inspiration

- **Structural reference only:** [webstudio.ie](https://webstudio.ie/) — section flow and layout rhythm. No copy of styles, branding, content, or exact layout.

## Creative Direction

- Premium, futuristic, high-performance agency feel.
- **Dark mode first.**
- **Palette:** Deep navy / charcoal base; electric blue + violet neon accents; gradient highlights; subtle glow effects.
- **UI elements:** Glassmorphism cards; gradient borders; animated gradient buttons; large bold typography; smooth transitions; elegant motion.
- Target feel: **€10,000+ custom agency build.**

## App Router Structure

```
/app
  layout.tsx
  page.tsx
  globals.css
  /services/page.tsx
  /projects/page.tsx
  /contact/page.tsx
  /api/contact/route.ts
/components
  Navbar.tsx
  Footer.tsx
  Hero.tsx
  Services.tsx
  Process.tsx
  ProjectsPreview.tsx
  CTA.tsx
  GlassCard.tsx
  GradientButton.tsx
  ContactForm.tsx
```

## SEO

- Metadata API in `layout.tsx`
- Title + description per page
- Open Graph metadata
- Semantic HTML (headings, landmarks, aria where needed)

## Tailwind

- Custom color system in `tailwind.config.ts`
- Theme extensions: `brand` (primary, surface, card, border), `accent` (blue, violet, cyan, glow)
- Glow shadow utilities: `shadow-glow`, `shadow-glow-sm`, `shadow-glow-lg`
- Gradient background presets: `gradient-brand`, `gradient-glow`, `gradient-mesh`
- Container configuration
- Custom animations: `gradient-x`, `fade-in`, `fade-in-up`

## Typography

- **Headings:** Space Grotesk (Google Fonts) — Satoshi-style modern feel
- **Body:** Inter (Google Fonts)
- Loaded via `next/font` in `layout.tsx`

## Performance

- `next/image` for images (when used)
- `next/font` for fonts
- Minimal dependencies; CSS-based animations where possible
- Lightweight hover/transition effects

## Animations

- Subtle hover scale on cards/buttons
- Glow intensifies on hover
- Gradient animation via `background-size` + keyframes
- Smooth section transitions
- Optional: lightweight scroll reveal (can be added later)

## Deployment (Vercel-ready)

- Standard Next.js 14 build: `npm run build` then `npm run start`
- Deploy to Vercel: connect repo, set root directory, use default build command and output
- Add env vars if needed (e.g. for contact form email API)
- Ensure `nextlevelweb.ie` domain is pointed to the Vercel project and SSL is enabled

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Run dev**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Lint / format**
   ```bash
   npm run lint
   npm run format
   ```

---

## Original prompt (saved for reference)

You are a senior frontend architect and Next.js 14 specialist.

Build a production-ready website for:

Domain: nextlevelweb.ie  
Brand: Next Level Web  
Industry: Web Design & Development Agency  

Tech Stack:  
- Next.js 14 (App Router)  
- TypeScript  
- Tailwind CSS (latest)  
- ESLint + Prettier  
- Fully responsive  
- Optimized for performance  
- SEO optimized  
- Accessible (WCAG best practices)  

Design Inspiration: Use https://webstudio.ie/ ONLY as structural inspiration (section flow and layout rhythm). Do NOT copy styles, branding, content, or layout exactly.

Creative Direction: Design a premium, futuristic, high-performance agency website. Dark mode first. Use: Deep navy / charcoal base; Electric blue + violet neon accents; Gradient highlights; Subtle glow effects; Glassmorphism cards; Gradient borders; Animated gradient buttons; Large bold typography; Smooth transitions; Elegant motion. The website should feel like a €10,000+ custom agency build.

Pages (App Router): / , /services , /projects , /contact  

Architecture: App Router with layout.tsx, page.tsx, globals.css, and route pages. Components: Navbar, Footer, Hero, Services, Process, ProjectsPreview, CTA, GlassCard, GradientButton.

SEO: Metadata API in layout.tsx; proper title + description; Open Graph metadata; structured semantic HTML.

Tailwind: Custom color system in tailwind.config.ts; extend theme with brand primary, brand accent, glow shadow utilities, gradient background presets; container configuration; typography plugin if helpful.

Typography: Strong modern pairing from Google Fonts — e.g. Headings: Space Grotesk / Satoshi-style; Body: Inter.

Performance: next/image; next/font; no unnecessary libraries; lightweight animations; CSS-based animation where possible.

Animations: Subtle hover scale; glow intensifies on hover; gradient animation using background-size tricks; smooth section transitions; optional lightweight scroll reveal.

Output required: Project setup steps; install commands; Tailwind setup; folder structure; tailwind.config.ts; layout.tsx; example advanced Hero section; example GradientButton component; Navbar + Footer; notes on deployment (Vercel-ready). Clean, modular, scalable, professional code. Premium Irish digital agency feel; visually striking and technically clean.
