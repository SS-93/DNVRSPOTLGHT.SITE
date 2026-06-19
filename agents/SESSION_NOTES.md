# Session Notes & Project Memory — Denver Spotlight

> Handoff doc for the next agent. Read this first, then the linked docs.
> Last updated: 2026-06-17 (Session 1).

---

## 1. What this project is

**Denver Spotlight** is deployment **#001** of a **white-label Community
Organization website template**, and simultaneously the **front door / data
on-ramp into the Buckets ecosystem**.

- It is a premium, mobile-first community site (events, awards, get-involved,
  support) that any cultural brand can re-skin by editing **one config file**.
- It is engineered so every interaction (form, vote, RSVP, donation) is an
  *event* that can feed Buckets — the larger artist/fan platform built on
  event-sourcing (Passport) + three "Trinity" systems (MediaID DNA, Treasury,
  Coliseum) + content systems (Concierto, Companon, CALS).
- **Greenfield Next.js app** at `~/Desktop/DNVRSPOTLGHT/app`. NOT a port of the
  old CRA app at `~/Desktop/93/my-app` (that's the existing Buckets codebase,
  useful as reference/backend-source-of-truth).

One-liner: *a white-label community site that doubles as a growth funnel and
event on-ramp for Buckets.*

---

## 2. Architecture (the key idea)

**Two layers, decoupled:**

1. **Presentation layer** (this repo, per-org): Next.js 16 · React 19 ·
   Tailwind v4 · ReactBits. Driven entirely by `config/organization.ts`
   (brand, nav, forms, socials, feature flags). Denver Spotlight = config #001.
2. **Buckets protocol layer** (shared, opt-in): Passport → Trinity + content
   systems. The site **emits events** to it and **reads projections** from it.

**The seam that makes this work:** `lib/emitEvent.ts`.
- Phase 1: `emitEvent("inquiry", …)` writes to the operational `inquiries` table.
- Phase 2: when `org.buckets.passport === true`, the SAME call also appends an
  immutable `passport_entries` event — no caller changes. This is "wrap, don't
  replace." Everything Buckets switches on via `org.buckets.*` flags.

**Graceful degradation:** with no env keys set, the form still works in the UI
and the server logs "dev mode" — so the site is testable before Supabase/Resend
exist. See `lib/supabase.ts` (returns `null` when unconfigured) and `lib/email.ts`.

---

## 3. Tech stack (as actually built)

- **Next.js 16.2.9** (App Router, Turbopack) — note: this is newer than common
  training data. Read `node_modules/next/dist/docs/` before writing Next code.
  Gotchas: async `params`, `proxy.ts` replaces `middleware.ts`, `use cache`.
- **React 19.2** · **TypeScript** (strict).
- **Tailwind CSS v4** — CSS-first theming via `@theme` in `app/globals.css`
  (NO `tailwind.config.js`). Brand tokens → utilities (`bg-primary`,
  `font-heading`, `.hero-gradient`).
- **Supabase** (Postgres) — `inquiries` table now; Buckets tables later.
- **Resend** — transactional email (`info@denverspotlight.org`).
- **Vercel** — hosting + `denverspotlight.org`.
- **ReactBits** — component library; used via **placeholder slots** for now
  (full access pending key config + optional MCP). Existing ReactBits components
  also live in the old repo: `~/Desktop/93/my-app/src/components/dnvrspotlight/`
  (CardNav, MagicBento, AnimatedList, ScrollStack, InfiniteMenu, HallOfFame,
  NomineeCard, VotingPage) — portable references for Phase 2.

---

## 4. Work completed (Session 1)

Phase-1 **vertical slice — builds green** (`npm run build` ✓):

- `config/organization.ts` — white-label contract (id, theme, fonts, logos, nav,
  socials, `forms`, `buckets.*` flags all currently false).
- `app/globals.css` — brand tokens (magenta `#E000FF`, black, hero gradient).
- `app/layout.tsx` — Cinzel/Inter/Anton via `next/font`, SEO metadata from config.
- **Homepage** `app/page.tsx`: `components/site/{Header,Footer,SpotlightConnectsBanner}`,
  `components/home/{Hero,OpportunitiesGrid}`. Pinned banner (not a popup).
- **Working form** `/get-involved`: `components/forms/InquiryForm.tsx` →
  `app/api/inquiries/route.ts` → `lib/inquiry.ts` (validate) →
  `lib/emitEvent.ts` (persist) → `lib/email.ts` (Resend).
- Logos renamed web-safe in `public/LOGOS/` (`denver-spotlight-logo.png`,
  `spotlight-connects-logo.png`, + `-2` variants).
- Setup deliverables: `docs/SETUP.Vercel-Supabase-Resend.md`, `.env.example`,
  `supabase/migrations/0001_inquiries.sql`.

Routes built so far: `/`, `/get-involved`, `/api/inquiries`. The nav links to
`/events`, `/events/awards`, `/support`, `/about`, `/contact` — **not yet built**.

---

## 5. Docs to read for full context

| Doc | What it gives you |
|---|---|
| `docs/PRD.Denver-Spotlight.v2.md` | **Vision / north-star** — the Buckets ecosystem framing, two-layer arch, phased roadmap |
| `docs/planning-bundle/project_requirements_document.md` | **Authoritative Phase-1 build spec** (scope, perf budgets, a11y, privacy) |
| `docs/planning-bundle/backend_structure_document.md` | DB schema, API endpoints, event flow |
| `docs/planning-bundle/app_flow_document.md` | User journeys per page |
| `docs/planning-bundle/tech_stack_document.md` | Stack rationale |
| `docs/planning-bundle/security_guideline_document.md` | Security/privacy requirements |
| `docs/planning-bundle/wireframes/*.html` | HTML mockups for every page (layout reference) |
| `docs/SETUP.Vercel-Supabase-Resend.md` | Go-live runbook (env, DNS, SQL) |
| `~/Desktop/.aidev-ledger/documents/DEV.DECI.md` | Engineering decisions + rationale (hidden folder) |

**Buckets reference (the larger ecosystem):**
- Docs: `~/Desktop/93/Documents/` (Buckets.MVP.md, Gap Analysis, Coliseum/Passport/
  Treasury/Concierto/CALS specs) and `~/Desktop/93/BUCKETS_MVP_*` reviews.
- Code: `~/Desktop/93/my-app/src/` (Passport, Treasury, Coliseum, DNA, Concierto,
  Companon implementations — many partially stubbed; treat as architectural
  reference, verify before trusting).

---

## 6. Next steps (suggested order)

1. **Round out marketing pages**: About, Events, Spotlight Connects (priority —
   current activation), Awards (info only in Phase 1), Support, Contact. Reuse
   `Header`/`Footer` and the `InquiryForm` (pass `sourcePage` + `defaultInterest`).
2. **ReactBits slots**: hero background (SplashCursor/GridScan), MagicBento on
   Get Involved, once the key/MCP is configured.
3. **Compliance pass** (bundle's fuller Phase 1): SEO/JSON-LD (Organization,
   WebSite, Event), cookie consent, Privacy Policy, data deletion/export, GTM via
   config, CI gating (Lighthouse + axe-core). Targets: Lighthouse ≥90, WCAG 2.1 AA.
3. **Go live**: user sets up Supabase + Resend + Vercel (manual, when ready) per
   the SETUP runbook; then verify end-to-end inquiry submission.
4. **Phase 2 (Buckets on)**: Concierto voting for Awards, MediaID profiles +
   nominee directory, Coliseum leaderboards/Hall of Fame, Treasury Artist Fund —
   each gated behind an `org.buckets.*` flag.

---

## 7. Conventions & gotchas

- **White-label rule:** new org = edit `config/organization.ts` only. Never
  hardcode org-specific strings/colors in components — pull from `org`.
- **Tailwind v4:** theme tokens live in `app/globals.css` `@theme`, not a JS config.
- **Server-only:** `lib/supabase.ts` uses the service-role key — never import it
  into a client component.
- **Dev without keys:** expected to log "Supabase/Resend not configured"; form
  still returns success. Don't "fix" this — it's intentional.
- **Build/run:** `npm run dev` (localhost:3000), `npm run build` to verify.

---

## 8. How this work is tracked (aidev-ledger)

Build sessions are logged with **`aidev-ledger`** (global CLI; source `~/aidev-ledger`,
data `~/.aidev-ledger`). It separates labor from AI/tool cost for transparent
invoicing, and defines a non-destructive `billingStatus`
(`active|past_due|maintenance_mode|disabled`) the site may later read for a
contractual maintenance banner. To continue tracking: `aidev start --project
"Denver Spotlight"`, `aidev log`, `aidev stop`, `aidev invoice`. See
`~/aidev-ledger/COMMANDS.md`.
