# Alpha — Your Role in the VanaTour HQ Split

## What's Happening

Phil's VanaTourHQ project is being split into **two separate Next.js applications**:

1. **VanaTour HQ** (the admin panel) — **YOU are building this.** This is the main application where Phil enters, manages, and stores all tour data. Schedule, budget, expenses, merch, crew, guestlist, settlement, advance — everything.

2. **Vana Command Center** (mission control dashboard) — **Omni is building this.** This is a read-only analytics dashboard that visualizes the data you store. It's the "big screen" for the tour — everyone on the bus can see live stats, financials, and route progress.

## Your Responsibilities

You own the **entire data layer and admin interface**:

- Set up the Next.js project (`create-next-app` with Tailwind CSS)
- Port all 18 HTML pages into React components and Next.js routes
- Design and implement the Supabase schema (the existing `schema.sql` is a starting point, not gospel)
- Build all CRUD operations — tours, day sheets, expenses, merch, crew, guest lists, settlements, advances, documents
- Implement authentication (Supabase Auth)
- Deploy to Vercel

## The Data Contract (Critical)

Your app is the **single source of truth**. The Command Center reads from your Supabase tables. This means:

### Tables you own and must create:

| Table | Purpose | Command Center Reads? |
|-------|---------|----------------------|
| `profiles` | User accounts | ✅ Auth check |
| `tours` | Tour metadata (name, dates, status) | ✅ Tour progress |
| `day_sheets` | Daily schedule/timeline | ✅ Today's schedule |
| `expenses` | Expense log by category | ✅ Financial overview |
| `budget` | Budget limits by category | ✅ Budget vs actual |
| `merch_inventory` | Merch items and stock | ✅ Merch performance |
| `merch_sales` | Per-show merch sales | ✅ Revenue tracking |
| `settlements` | Post-show financial settlement | ✅ Net profit |
| `crew` | Crew roster and roles | ✅ Crew display |
| `guest_lists` | Guest pass requests | ❌ Admin only |
| `advances` | Venue advance status | ✅ Upcoming prep |
| `documents` | Uploaded files/contracts | ❌ Admin only |
| `routing` | Tour routing data | ✅ Route visualization |

### What the Command Center needs from you:

1. **A working Supabase project** with these tables populated
2. **Row Level Security (RLS)** policies so authenticated users can read tour data
3. **The Supabase URL and anon key** — we share the same project
4. **Stable table/column names** — if you rename a column, tell us before deploying

### What you do NOT need to worry about:

- How the Command Center looks or works — that's Omni's problem
- Building any read-only views or dashboards — your app is for data entry
- The Command Center's deployment or hosting

## Existing Code to Port

The current repo (`VanaTourHQ`) is vanilla HTML/CSS/JS with no framework. Here's what maps where:

### Your App (VanaTour HQ Admin Panel):

| Current File | Next.js Route |
|-------------|---------------|
| `landing.html` | `/` (landing + auth) |
| `index.html` | `/dashboard` |
| `create-tour.html` | `/tours/new` |
| `schedule.html` | `/tours/[id]/schedule` |
| `edit-day.html` | `/tours/[id]/schedule/[dayId]/edit` |
| `dates.html` | `/tours/[id]/dates` |
| `route.html` | `/tours/[id]/route` |
| `budget.html` | `/tours/[id]/budget` |
| `expenses.html` | `/tours/[id]/expenses` |
| `settlement.html` | `/tours/[id]/settlement` |
| `merch.html` | `/tours/[id]/merch` |
| `crew.html` | `/tours/[id]/crew` |
| `guestlist.html` | `/tours/[id]/guestlist` |
| `advance.html` | `/tours/[id]/advance` |
| `advance-email.html` | `/tours/[id]/advance/email` |
| `briefing.html` | `/tours/[id]/briefing` |
| `market-history.html` | `/tours/[id]/markets` |
| `more.html` | `/tours/[id]/more` |
| `data/*.json` | Supabase tables (no more static JSON) |
| `config.js` | `.env.local` (Supabase keys) |
| `js/supabase.js` | `lib/supabase.ts` |

## Technical Requirements

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel
- **Auth:** Supabase Auth (keep the existing login/signup flow, port it to React)
- **State:** Server components where possible, client components for interactive forms
- **OCR for receipts:** Tesseract.js (already used in expenses.html, port the logic)

## How We Coordinate

1. **You set up the Supabase project first.** Create the tables, set up RLS, get the schema solid.
2. **Share the Supabase URL and anon key** with Omni so the Command Center can connect.
3. **Build your pages.** Focus on data entry and management — that's your domain.
4. **Omni builds the Command Center in parallel.** It connects to your Supabase project and reads the data you write.
5. **If you change a table schema,** ping Omni before pushing to production.
6. **Both deploy to Vercel** independently. Two projects, two URLs, one database.

## Design Direction

The current app uses a dark theme with clean styling. The Command Center uses a neon/cyberpunk aesthetic. **They are intentionally different.** Your app should stay clean and functional — it's a tool Phil uses daily. Don't try to match the Command Center's look.

Suggested approach:
- Dark theme (keep the existing vibe)
- Clean, professional UI — think Linear, Notion, or Vercel's dashboard
- Mobile-responsive (Phil will use this on his phone backstage)
- Keep the VANA branding

## Getting Started

```bash
npx create-next-app@latest vana-tour-hq --typescript --tailwind --app --src-dir
cd vana-tour-hq
npm install @supabase/supabase-js @supabase/ssr
# Copy data/*.json into seed scripts or Supabase migrations
# Start porting pages route by route
```

## Questions?

If you need to discuss the data schema, table structure, or how the two apps connect, message Phil and Omni. Don't guess on shared data — ask.

---

**TL;DR:** You build the admin panel where Phil enters data. Omni builds the dashboard that shows everyone the data. Same Supabase database. Two Vercel deployments. Ship fast.
