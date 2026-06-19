# Denver Spotlight Community Platform v2.0 — Project Requirements Document (PRD)

---

## 1. Project Overview

Denver Spotlight is a white-label, mobile-first community website template built on Next.js 16 and React 19 with Tailwind CSS v4. It serves two purposes: first, to give any cultural brand (festival, venue, label, nonprofit) a beautiful, fully configurable public site; and second, to act as the on-ramp for the Buckets ecosystem—a suite of event-sourcing, identity, payments, and analytics services. Every form submission, vote, RSVP or donation on the site becomes an immutable event that can feed into Buckets’ Passport, MediaID DNA, Treasury, and Coliseum systems.

We’re building v2.0 to replace the static marketing site of v1.0 with a robust foundation that:  
• Captures inquiries and interest via Supabase + Resend emails  
• Complies with performance, accessibility, privacy, and SEO best practices  
• Exposes a simple `config/organization.ts` contract to skin the site per client  
• Defines a clear event-emit abstraction (`emitEvent()`) to seamlessly switch on Buckets integration later

**Key success criteria for Phase 1:** live site with 90+ Lighthouse scores, WCAG 2.1 AA compliance, full mobile-first experience, working interest forms (Sponsor, Vendor, Volunteer, Artist Fund, etc.), and zero custom code per new organization—just config.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Phase 1)
- Marketing pages: Home, About, Events, Spotlight Connects, Awards Info, Get Involved, Support, Contact.  
- Config-driven theming: colors, fonts, logos, navigation, hero images via `config/organization.ts`.  
- Interest forms: Sponsor, Vendor, Volunteer, Paparazzi, Performer, General, Artist Fund ➔ saved in Supabase `inquiries` table + Resend for notifications.  
- Event-emit abstraction: `emitEvent()` writes to `inquiries` now and can extend to Passport when enabled.  
- Single-language (English/US).  
- Cookie-consent banner, Privacy Policy page, data deletion/export form (GDPR/CCPA).  
- SEO & social: dynamic `<title>`, `<meta>`, Open Graph, Twitter Cards, JSON-LD for Organization, WebSite, Events, BreadcrumbList.  
- Google Tag Manager snippet (optional via config) for analytics/tracking.  
- Performance & accessibility: Lighthouse 90+, WCAG 2.1 AA, mobile budgets (LCP ≤1.5s, TTI ≤2s, TBT <150 ms, CLS <0.1, JS bundle ≤150 KB gzipped), CI checks with Lighthouse and axe-core.

### Out-of-Scope (Phase 1)
- User authentication or login flows (passwordless/Supabase Auth).  
- Buckets-enabled features: Voting (Concierto), Profiles (MediaID), Leaderboards (Coliseum), Donations/Ticketing (Treasury), Sponsor matching (Companon), Viral sharing (CALS).  
- Admin dashboard or roles/UI for content editing.  
- Multi-tenant deployment on a single backend.  
- In-app CMS beyond MDX/JSON in code.

---

## 3. User Flow

A first-time visitor lands on denverspotlight.org (or any white-label domain). They see a fast-loading, full-screen hero section with configurable logo and tagline, followed by a left or top navigation bar linking to Home, About, Events, Awards Info, Get Involved, Support, and Contact. Scrolling down reveals event cards, sponsor logos, and calls to action. A cookie banner appears at first visit, and the footer contains Privacy Policy and social links.

When the user clicks “Get Involved” or any interest form link, a modal or dedicated page slides in. They select an inquiry type (e.g. “Volunteer” or “Artist Fund”), fill in name, email, phone, message, and consent checkbox, and hit “Submit.” The form calls `emitEvent('inquiry', payload)`, writes to Supabase, and triggers Resend to send confirmation and notification emails. A success toast confirms receipt—no login required. Behind the scenes, every submission is recorded in `inquiries` and queued for Passport once enabled.

---

## 4. Core Features

- **Config/Organization Contract**: Single `config/organization.ts` drives ID, domain, theme, fonts, logos, nav items, forms, and Buckets feature flags.  
- **Interest Forms**: Configurable form types ➔ Supabase `inquiries` ➔ Resend emails.  
- **Event Emitter Abstraction**: `emitEvent(type, data)` with pluggable Passport integration.  
- **Responsive Layout**: Next.js App Router + Tailwind v4, mobile-first, hero sections, card grid, full-screen modals.  
- **SEO & Social Metadata**: Next.js 16 Metadata API for dynamic titles, descriptions, canonical URLs, OG/Twitter tags, JSON-LD schemas.  
- **Cookie Consent & Privacy**: Banner, opt-in/out non-essential cookies, Privacy Policy page, data deletion/export form.  
- **Analytics Integration**: GTM snippet via config, asynchronous loading.  
- **Performance & Accessibility**: WCAG 2.1 AA, Lighthouse 90+ in perf, accessibility, best practices, SEO; mobile performance budgets; CI gating.  
- **Content in Code**: MDX components and JSON structures for static pages; versioned via Git; dynamic pages via React components.  
- **Environment Overrides**: `.env.development`, `.env.staging`, `.env.production` with overrides merged into base config.

---

## 5. Tech Stack & Tools

**Frontend:**  
- Next.js 16 (App Router, Proxy.ts)  
- React 19.2  
- TypeScript  
- Tailwind CSS v4 (Oxide Engine, CSS-first `@theme`, native CSS variables)  
- ReactBits components (InfiniteMenu, AnimatedList, ScrollStack)  
- Vercel hosting & Edge Functions

**Backend (Phase 1):**  
- Supabase Postgres for `inquiries` table  
- Resend API for transactional emails  
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_FORWARD_TO`, `CONTACT_FROM_EMAIL`

**Future Buckets Ecosystem (config-driven):**  
- Passport (immutable event log)  
- MediaID DNA (profiles & matching)  
- Treasury (Stripe Connect payments/donations)  
- Coliseum (metrics & leaderboards)  
- Concierto (voting & RSVPs)  
- Companon (sponsor campaigns)  
- CALS (link sharing & attribution)

**IDE & Dev Tools:**  
- VS Code with ESLint, Prettier, Tailwind IntelliSense  
- CI: GitHub Actions for lint, type checks, Lighthouse & axe-core audits  
- Optional AI plugins: Cursor for code completion, Windsurf for scaffolding

---

## 6. Non-Functional Requirements

- **Performance:** Lighthouse >= 90 across Performance, Accessibility, Best Practices, SEO; mobile budgets (LCP ≤1.5s, TTI ≤2s, TBT <150ms, CLS <0.1, JS ≤150 KB gzipped).  
- **Accessibility:** WCAG 2.1 AA (4.5:1 color contrast, keyboard navigable, proper ARIA, semantic HTML).  
- **Security & Privacy:** GDPR/CCPA compliance (cookie banner, privacy policy, data deletion), secure env var handling, no sensitive data in client bundles.  
- **SEO & Social:** Dynamic metadata, proper canonical links, JSON-LD schemas.  
- **Usability:** Mobile-first, intuitive forms, clear toasts and modals, consistent theming.  
- **Reliability:** 99.9% uptime on Vercel/Supabase, graceful error pages, retry logic on transient failures.  
- **Maintainability:** Single codebase, config-only white-label extension, Git-based content updates, documented `config/organization.ts` contract.

---

## 7. Constraints & Assumptions

- **Single Language:** English (US) only in Phase 1; i18n to be added later.  
- **Buckets Disabled Initially:** All `buckets.*` flags false; no external API calls to Buckets services in Phase 1.  
- **Auth Deferred:** No login flows until Phase 2 (magic-link via Supabase Auth).  
- **Stripe Config:** Stripe Connect keys and payout splits defined via env vars and config; no dynamic UI for splits in Phase 1/2.  
- **Environment Management:** Base `config/organization.ts` plus `.env.*` overrides.  
- **Content Workflow:** Static pages managed in code (MDX/JSON) with PR reviews.  
- **Hosting:** Vercel for frontend; shared Supabase for backend; Resend for email.  
- **Domain & SSL:** Client supplies DNS access; automatic SSL on Vercel.

---

## 8. Known Issues & Potential Pitfalls

- **Next.js 16 & React 19 Migration:** Must handle async `params` in App Router, replace `middleware.ts` with `proxy.ts`, adopt `use cache`. Mitigation: follow Next.js 16 migration guide; include example proxy.  
- **Tailwind v4 Plugins:** Some v3 plugins may not work; ensure CSS-first config and run upgrade tool.  
- **Email Deliverability:** Resend domains must be warmed up; set SPF/DKIM records early.  
- **GTM & Privacy:** Loading GTM scripts asynchronously; ensure non-essential cookies blocked until consent.  
- **Supabase Limits:** Monitor row counts on `inquiries`; consider partitioning or TTL if volume spikes.  
- **Feature Flags Misconfiguration:** Accidental Buckets flags on/off may expose broken UI. Mitigation: CI check on `config/organization.ts` to validate flags.  
- **Performance Regression:** New dependencies or MDX imports can bloat JS bundles. Mitigation: bundle analysis in CI; enforce max bundle size.


---

*This PRD outlines all requirements for Phase 1 of Denver Spotlight v2.0. It’s designed so downstream technical documents (Tech Stack spec, Frontend Guidelines, Backend Structure, App Flow, File Structure, IDE Rules) can be generated unambiguously.*