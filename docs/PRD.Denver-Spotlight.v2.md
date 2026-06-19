# PRD: Denver Spotlight — Community Organization Platform v2.0

**Document type:** Product Requirements / Vision
**Supersedes:** Denver Spotlight Website v1.0 (+ Email Capture addendum)
**Date:** 2026-06-17
**Positioning:** Deployment **#001** of the Buckets White-Label Community Template,
and the **front door** into the Buckets ecosystem.

---

## 1. Vision

Denver Spotlight is a premium, mobile-first website for a real community
organization — *and* the first proof that the same codebase can be re-skinned for
any festival, venue, label, or cultural brand. But it is more than a template
deployment: it is the **on-ramp** to **Buckets**, the artist/fan engagement
platform built on an event-sourcing core (Passport) and three "Trinity" systems
(MediaID DNA, Treasury, Coliseum Analytics).

The strategic insight: **a community website is the cheapest, most natural way to
acquire artists, fans, sponsors, and events into Buckets.** Every form submission,
vote, RSVP, and donation that the site captures is an *event* — and events are
exactly what Buckets is designed to consume. So we build the website not as a
dead-end marketing site, but as a **thin, beautiful presentation layer over the
Buckets protocol**, where deeper capability switches on progressively.

> One sentence: *Denver Spotlight is a white-label community site that doubles as a
> growth funnel and data on-ramp for the Buckets ecosystem.*

---

## 2. Two-Layer Architecture

The product is deliberately split into two layers so that the presentation can be
re-skinned per organization while the intelligence is shared.

```
┌──────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER  (per-organization, white-label)          │
│  Next.js 16 · React 19 · Tailwind v4 · ReactBits · Vercel     │
│  Driven entirely by config: logo, colors, copy, nav, forms.   │
│  Denver Spotlight = config #001.                              │
└───────────────────────────────┬──────────────────────────────┘
                                 │ emits events / reads projections
┌───────────────────────────────▼──────────────────────────────┐
│  BUCKETS PROTOCOL LAYER  (shared backend, opt-in per deploy)  │
│                                                                │
│   #0 PASSPORT  — immutable event log (every interaction)      │
│        │                                                       │
│   ┌────┴───────────────┬────────────────────┐                 │
│   ▼                    ▼                    ▼                  │
│  MediaID DNA        Treasury            Coliseum               │
│  (identity/match)   (payments/funds)    (metrics/leaderboards) │
│                                                                │
│  Content systems: Concierto (events/voting/ticketing) ·       │
│  Companon (sponsors/brands) · CALS (viral link sharing)       │
└────────────────────────────────────────────────────────────────┘
```

**Key principle — "Wrap, don't replace."** The website works fully on its own
(Phase 1 needs only Supabase + Resend). Buckets integration is **opt-in per
deployment via config flags**, so a simple client can run a marketing+forms site,
while Denver Spotlight progressively lights up voting, profiles, funds, and
analytics — all without rewriting the presentation layer.

---

## 3. The Buckets Ecosystem — and how the site uses each system

| Buckets system | What it is | How Denver Spotlight uses it | Phase |
|---|---|---|---|
| **Passport** | Append-only event log; the single source of truth | Every inquiry, vote, RSVP, donation, share is logged as a `passport_entry` | 1→ |
| **MediaID DNA** | Privacy-first identity + 4-domain DNA (Cultural/Behavioral/Economic/Spatial) for matching | Artist & community profiles; nominee directory; "artists like this"; sponsor↔artist fit | 2 |
| **Treasury** | Payments, payouts, revenue splits (Stripe Connect) | Artist Fund donations, ticketing, sponsor payments, transparent payout splits | 2→3 |
| **Coliseum** | Metrics aggregation + leaderboards from Passport events | Awards tallies, Hall of Fame, "trending nominees," city/venue leaderboards | 2 |
| **Concierto** | Events: RSVPs, voting, ticketing | Spotlight Connects RSVPs; Denver Spotlight Awards voting + ballots | 2 |
| **Companon** | Brand/sponsor campaigns with DNA targeting | Sponsor onboarding → matched to artists/audiences by DNA | 3 |
| **CALS** | Cross-app link sync / viral sharing + attribution | Shareable nominee/ballot links; "shared with you"; referral attribution | 3 |

The website does not reimplement these — it **emits events to Passport and reads
projections** (leaderboards, profiles, fund totals). This keeps each org's site
thin and lets improvements to Buckets benefit every deployment at once.

---

## 4. Phased Roadmap

### Phase 1 — Launch (standalone, Passport-ready)
*Goal: a beautiful live site that captures community interest and is wired to emit
events the moment Buckets is connected.*
- All marketing routes (Home, About, Events, Spotlight Connects, Awards info,
  Get Involved, Support, Contact).
- Interest forms (Sponsor, Vendor, Volunteer, Paparazzi, Performer, General,
  Artist Fund) → `inquiries` table + **Resend** notification & confirmation email.
- **Event-emit abstraction** in place from day one: a single `emitEvent()` helper
  that writes to `inquiries` now and is one config flag away from also writing a
  `passport_entry`. (This is the cheap insurance that makes Phase 2 painless.)
- No auth required. Mobile-first. Lighthouse 90+ across the board.

### Phase 2 — Engagement (Buckets Trinity switches on)
*Goal: turn visitors into identities, votes into leaderboards, donations into a
transparent fund.*
- **Concierto voting** for Denver Spotlight Awards (ballots, categories,
  nominees) + Spotlight Connects RSVPs.
- **MediaID profiles**: artist/community profiles, nominee directory (ReactBits
  `InfiniteMenu`), "artists like this" via DNA similarity.
- **Coliseum**: live award tallies, trending nominees, Hall of Fame, city/venue
  leaderboards (ReactBits `AnimatedList`, `ScrollStack`).
- **Treasury**: Artist Fund donations via Stripe with transparent split display.

### Phase 3 — Network (ecosystem + multi-org)
*Goal: viral growth and sponsor monetization; prove the template across orgs.*
- **CALS** deep links + share attribution (referral credit to Treasury).
- **Companon** sponsor onboarding with DNA-matched artist/audience targeting.
- **Multi-deployment**: a 2nd organization live on the same template + Buckets
  backend, validating the white-label thesis.
- Admin dashboard + analytics (Coliseum-powered) and contact export.

---

## 5. White-Label Configuration Contract

A new organization deploys by editing **config only** — never application logic.

```ts
// config/organization.ts
export const org = {
  id: "denver-spotlight",                 // = Buckets project / tenant id
  name: "Denver Spotlight",
  domain: "denverspotlight.org",
  contactEmail: "info@denverspotlight.org",

  theme: {                                // → CSS vars / Tailwind v4 @theme
    primary: "#E000FF",
    secondary: "#D9D9D9",
    background: "#000000",
    surface: "#09090B",
    cardSurface: "#121218",
    heroGradient: "linear-gradient(135deg,#9B00FF 0%,#E000FF 50%,#FF4AF2 100%)",
  },
  fonts: { heading: "Cinzel", ui: "Inter", impact: "Anton" },

  logos: { primary: "/LOGOS/Denver Spotlight Logo (1).png",
           secondary: "/LOGOS/Spotlight Connects Logo (1).png" },

  nav: [ /* CardNav items */ ],
  forms: [ "sponsor","vendor","volunteer","paparazzi","performer","contact","artist-fund" ],

  buckets: {                              // opt-in ecosystem integration
    enabled: false,                       // Phase 1 = false → inquiries only
    passport: false,                      // emit passport_entries
    concierto: false,                     // voting / RSVP
    treasury: false,                      // donations / ticketing
    coliseum: false,                      // leaderboards / hall of fame
    mediaId: false,                       // profiles / directory
  },
};
```

The `buckets.*` flags are the master switches that progressively reveal Phase
2/3 features. A minimal client ships with everything `false`; Denver Spotlight
flips them on over time.

---

## 6. Tech Stack (as built)

**Presentation:** Next.js **16** (App Router) · React **19** · TypeScript ·
Tailwind **v4** (`@theme` tokens) · ReactBits components · Vercel ·
`denverspotlight.org`.

**Phase 1 backend:** Supabase (`inquiries` table) · **Resend** (`info@denverspotlight.org`,
`POST /api/inquiries`). Env: `RESEND_API_KEY`, `CONTACT_FORWARD_TO`,
`CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

**Buckets backend (Phase 2+):** shared Supabase (Postgres + TimescaleDB +
pgvector) with `passport_entries` and Trinity tables; Edge Functions for the
background event processor.

**Ops layer:** `aidev-ledger` tracks build cost/time; per-project
`billingStatus` (`active|past_due|maintenance_mode|disabled`) enables a
*non-destructive* contractual maintenance banner.

---

## 7. Data Model Evolution

```
Phase 1:   form submit → inquiries (id, created_at, name, email, phone,
                          organization, interest_type, message, status,
                          source_page, consent_to_contact)

Phase 2+:  form submit → emitEvent() ─┬→ inquiries (operational record)
                                      └→ passport_entries (immutable event)
                                              │ background processor
                                              ├→ MediaID DNA  (identity/match)
                                              ├→ Treasury     (fund/payment)
                                              └→ Coliseum     (metrics)
```

`emitEvent()` is the seam: built in Phase 1 writing only to `inquiries`, extended
in Phase 2 to also append a Passport event when `org.buckets.passport` is true.

---

## 8. Communication Layer (Resend)

Form submission flow (Phase 1, unchanged from v1 addendum, now event-aware):
1. Validate → 2. `emitEvent()` (inquiries [+ passport]) → 3. Resend team
notification (`New Denver Spotlight Inquiry: [type]`) → 4. optional confirmation
email → 5. success UI. Future: newsletters, voting reminders, Spotlight Connects
announcements — all as Passport-logged communication events.

---

## 9. Routes (carried from v1, annotated with Buckets hooks)

| Route | Phase 1 | Buckets hook (Phase 2+) |
|---|---|---|
| `/` | Hero, Spotlight Connects banner, mission, opportunities, sponsors | trending nominees (Coliseum) |
| `/about` | mission/vision/history/team | — |
| `/events` | event hub cards | live RSVP counts (Concierto) |
| `/events/spotlight-connects` | overview/schedule/artists/sponsors + RSVP CTA | RSVP (Concierto), share (CALS) |
| `/events/awards` | info: history/categories/winners | **voting** (Concierto + Coliseum) |
| `/get-involved` | MagicBento cards → forms | DNA-matched opportunities |
| `/support` | Artist Fund + donations | **Treasury** donations + splits |
| `/contact` | general contact | Passport event |

---

## 10. Design System (Tailwind v4)

Brand tokens defined in `app/globals.css` via `@theme { --color-primary: #E000FF; ... }`
(v4 CSS-first theming — no `tailwind.config.js`). Typography: luxury-editorial
headings (Cinzel), Inter UI, Anton impact. UX: large type, motion, visual
hierarchy, event-forward, mobile-first. Avoid generic SaaS styling.

---

## 11. Success Metrics

- **Phase 1:** Lighthouse ≥90 (Perf/A11y/BP/SEO); inquiry submissions captured +
  emailed; <2s mobile load.
- **Phase 2:** votes cast; profiles created; fund $ raised; leaderboard accuracy.
- **Phase 3:** referral attribution; sponsor matches; **a 2nd org deployed** on
  the same template (the white-label proof).

---

## 12. Open Questions

1. Single shared Buckets/Supabase backend across all org deployments (multi-tenant
   with RLS by `org.id`) vs. one backend per org? (Leaning multi-tenant.)
2. Does the existing Buckets codebase (`~/Desktop/93/my-app`) become the backend,
   or do we extract a clean Buckets "protocol" service the websites talk to?
3. Reuse the existing DNVR Spotlight voting UI (`my-app/src/components/dnvrspotlight`)
   for Phase 2, ported to Next + Concierto?
4. Auth model for Phase 2 profiles (Supabase Auth + MediaID).

---

*This PRD intentionally lets Phase 1 ship as a standalone site while making every
Phase-2/3 capability a config flag away — so Denver Spotlight is useful today and
becomes a Buckets node tomorrow without a rewrite.*
