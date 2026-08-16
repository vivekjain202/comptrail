# Salary Progression Sharing Tool — Plan

## Concept

A personal salary-progression card generator. Users anonymously enter their
career/salary history and get polished visualizations — a timeline, a
progression chart, and a stats summary. Output is built to be shared on
Reddit/LinkedIn: either as a downloadable image or as a persistent link with
a nice social preview.

No accounts, no public browsing/aggregate database in v1 — the focus is
making it effortless to turn your own salary history into something
shareable.

## Data model

One **timeline** = one shareable entity.

- `slug` — public, shareable, non-guessable (used in the URL)
- `edit_token` — secret, stored client-side, required to edit/delete later
- display label (optional, e.g. "Software Engineer, US" — no real name needed)
- currency
- country/region (optional, for context)
- `entries[]`, each with:
  - company (optional/can be anonymized, e.g. "Company A")
  - title
  - level (optional)
  - start date
  - base, bonus, equity, total comp
  - event type: new job / promotion / raise / relocation

## Views

1. **Timeline** — vertical milestones (job changes, promotions, raises) with
   dates and % jump annotations
2. **Progression chart** — line/area of total comp over time, optionally
   stacked base/bonus/equity
3. **Stats card** — CAGR, total growth %, biggest jump, years of experience
4. **Shareable image** — condensed branded PNG combining timeline + key
   stats, sized for Reddit/LinkedIn

## Architecture

- **Frontend/framework**: Next.js (App Router) + TypeScript + Tailwind,
  hosted on Vercel
- **Charts**: Recharts (or visx) for interactive views; custom component for
  the timeline
- **Image export**: `@vercel/og` (Satori) to server-render the shareable
  card as a PNG on demand — doubles as the OG image so a posted link
  unfurls with the actual chart
- **Database**: Postgres (Neon or Supabase free tier) + Drizzle ORM — a
  `timelines` table and an `entries` table
- **Anonymous auth**: no login. Creating a timeline generates a random
  `edit_token` saved in the browser; the public `slug` is separate so
  viewing doesn't expose editing
- **Abuse protection**: honeypot field + basic rate limiting on the create
  endpoint

## MVP build order

1. Client-side form + live preview (timeline + chart) — works entirely in
   the browser first, no backend needed to see it working
2. "Save & get link" → persists to DB, returns `/t/[slug]` public page +
   edit token stored locally
3. Public page renders the interactive views + a "Download image" button
4. OG image wiring so the link itself looks good pasted into Reddit/LinkedIn
5. Polish: card themes/colors, currency formatting, mobile layout

## Deliberately deferred (not v1)

- User accounts
- Browsing/searching other people's timelines
- Aggregate/community salary stats and comparisons
