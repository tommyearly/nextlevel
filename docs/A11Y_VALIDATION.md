# Accessibility validation

The audit recommends running axe or Lighthouse to validate color contrast and a11y.

## Quick check (Chrome DevTools)

1. Open the site in Chrome
2. F12 → Lighthouse tab
3. Select "Accessibility", run report
4. Fix any contrast or a11y issues reported

## Automated (optional)

```bash
# Install once
npm install -D @axe-core/cli

# With dev server running (npm run dev)
npx axe http://localhost:3000 --exit
```

## Color contrast reference

| Foreground | Background | Use |
|------------|------------|-----|
| `text-slate-50` #f8fafc | `bg-brand-surface` #0c1222 | Headings, primary text |
| `text-slate-300` #cbd5e1 | `bg-brand-surface` #0c1222 | Body text |
| `text-slate-400` #94a3b8 | `bg-brand-surface` #0c1222 | Secondary text |
| `text-slate-500` #64748b | `bg-brand-surface` #0c1222 | Muted hints (verify in Lighthouse) |
| `text-accent-blue` #3b82f6 | `bg-brand-surface` #0c1222 | Links |

WCAG AA: 4.5:1 normal text, 3:1 large text. If `slate-500` fails, use `slate-400` for that element.
