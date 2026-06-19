# Tech Stack Document

This document explains the technology choices for the Denver Spotlight Community Platform v2.0 in everyday language. It answers “why” each tool or framework was picked and “how” it fits into the big picture, without assuming you have a technical background.

## Frontend Technologies

We chose these tools to build a fast, mobile-first, and configurable website that looks great out of the box and adapts to any organization’s brand—all by editing a single configuration file.

- **Next.js 16 (App Router)**
  • Gives us a simple file-based system for creating pages and layouts.  
  • Supports dynamic metadata (page titles, descriptions, Open Graph tags) for better SEO and social sharing.  
  • Enables on-the-fly server-side rendering and edge caching for speed.

- **React 19**
  • Lets us build interactive UI components (forms, modals, lists) in a familiar way.  
  • Works seamlessly with Next.js to handle user interactions without reloading the page.

- **TypeScript**
  • Adds a layer of safety by checking our code as we write it, catching typos or simple mistakes before they reach production.

- **Tailwind CSS v4**
  • Provides a set of utility classes (e.g., `bg-primary`, `text-center`) for styling without writing raw CSS files.  
  • Uses a theme system driven by CSS variables, so colors, fonts, and spacing are all configurable via `config/organization.ts`.

- **ReactBits Components**
  • A small library of pre-built UI pieces (infinite scroll menus, animated lists, scroll stacks) that match our design system.  
  • Helps us move faster by reusing battle-tested components.

- **MDX (Markdown + JSX)**
  • Lets us write static pages (About, Events, Support) in Markdown, sprinkled with React components for rich layouts.  
  • Keeps content under version control so updates go through the same code review process as features.

- **Next.js Metadata API & JSON-LD**
  • Automatically injects `<title>`, `<meta>`, Open Graph, Twitter Card tags, and structured data (Organization, WebSite, Event schemas) for improved search ranking and richer social previews.

- **Vercel for Hosting**
  • Deploys our frontend globally with zero-configuration HTTPS, automatic scaling, and instant rollback.  
  • Runs edge functions for any server-side logic (proxying, API routes) close to the user.

## Backend Technologies

Our backend setup is lean for Phase 1 (launch) and ready to plug into the full Buckets ecosystem later by flipping simple feature flags.

- **Supabase (Postgres)**
  • Stores form submissions in an `inquiries` table during Phase 1.  
  • Later hosts shared Buckets tables (`passport_entries`, projections for profiles, leaderboards) when you turn on Passport, MediaID, Coliseum, etc.

- **Resend API**
  • Handles transactional emails (confirmation to the user, notifications to the team) after each form submission.  
  • Configurable sender address, forward-to email, and API key via environment variables.

- **Stripe Connect (via Treasury)**
  • Powers secure payments, donations, and ticket purchases.  
  • Manages split payouts between the platform, organization, and artists.

- **Supabase Auth (Phase 2+ for Sign-In)**
  • Provides passwordless (magic-link) email login in Phase 2, tying votes, RSVPs, and donations to a persistent identity.  
  • Can be extended with social logins (Google, Apple) via a configuration flag.

- **Edge Functions & Background Processors**
  • Run lightweight code at the edge to transform or route incoming events.  
  • Process events from Supabase into Passport, trigger downstream services, and update projections.

## Infrastructure and Deployment

We rely on modern, cloud-native tools to keep deployment simple, repeatable, and reliable.

- **Vercel Platform**  
  • Global CDN with automatic HTTPS, instant preview URLs on each pull request, and zero-downtime production deploys.  
  • Runs both the Next.js frontend and serverless functions (API routes and event processors).

- **GitHub & GitHub Actions**  
  • Git for version control and collaboration.  
  • CI pipeline that runs: ESLint, TypeScript checks, Lighthouse performance & SEO tests, and axe-core accessibility audits on every pull request.

- **Environment-Based Configuration**  
  • A single `config/organization.ts` holds all white-label settings (colors, logos, nav, feature flags).  
  • `.env.development`, `.env.staging`, `.env.production` files (or environment variables in Vercel) override only what changes per environment.

- **Aidev-Ledger**  
  • Tracks build cost and time per project.  
  • Monitors billing status (active, past_due, maintenance_mode, disabled) and displays a maintenance banner if needed.

## Third-Party Integrations

These external services add essential capabilities without re-inventing the wheel.

- **Resend** for reliable transactional email delivery.  
- **Stripe Connect** for secure payment processing and split-payout management.  
- **Google Tag Manager** (config-driven snippet) to drop in Google Analytics, Facebook Pixel, Hotjar, or any other tracking script without code changes.  
- **Cookie-Consent Banner** with opt-in/out controls for marketing/analytics cookies, supporting GDPR and CCPA requirements.

## Security and Performance Considerations

We built in best practices from day one to protect user data and keep the site lightning fast.

- **GDPR/CCPA Compliance**  
  • Cookie-consent banner, Privacy Policy page, and user data deletion/export request form.  
  • All tracking scripts gated behind explicit consent.

- **Authentication & Data Protection**  
  • Passwordless email login via Supabase Auth (Phase 2)—no permanent passwords to manage.  
  • Secure storage of API keys and secrets in environment variables; no sensitive data in client bundles.

- **Performance Budgets & Accessibility**  
  • Lighthouse score ≥ 90 for Performance, Accessibility, Best Practices, and SEO.  
  • Mobile performance goals: Largest Contentful Paint ≤ 1.5 s (mid-tier 3G), Time to Interactive ≤ 2 s, Total Blocking Time < 150 ms, Cumulative Layout Shift < 0.1, JS bundle ≤ 150 KB gzipped.  
  • WCAG 2.1 AA compliance: 4.5:1 contrast ratio, keyboard navigability, proper ARIA roles.

- **CI Gating**  
  • Automated checks on each PR block merges if performance or accessibility regress below targets.

## Conclusion and Overall Tech Stack Summary

Denver Spotlight v2.0 is built to be:

- **White-Label & Config-Driven**: One codebase, endless brands—just update `config/organization.ts` to change theme, content, navigation, and ecosystem feature flags.
- **Fast & Mobile-First**: Next.js, Vercel, and Tailwind CSS ensure a snappy experience on any device with performance goals baked in.  
- **Event-Sourcing-Ready**: A simple `emitEvent()` helper writes to a lightweight `inquiries` table today and becomes a full Passport event tomorrow with a single config flip.  
- **Scalable & Maintainable**: GitHub Actions guard code quality; environment overrides keep deployments consistent; MDX in code ensures content changes flow through standard reviews.  
- **Secure & Compliant**: GDPR/CCPA features, passwordless auth, and best-practice handling of secrets and tracking scripts.

This tech stack aligns perfectly with the project’s vision—offering a premium, mobile-first community website that not only looks great but also serves as the growth on-ramp into the Buckets ecosystem without rewriting a line of presentation code.