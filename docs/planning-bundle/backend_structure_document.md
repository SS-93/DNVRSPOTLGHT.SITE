# Backend Structure Document

This document explains the backend setup for Denver Spotlight v2.0. It uses everyday language so anyone can understand how data flows, where it lives, and how the system stays reliable, secure, and ready to grow.

## 1. Backend Architecture

Overall Setup

- Two-layer design:
  1. **Presentation Layer** (Next.js front end) runs separately and talks to the backend via simple API calls.
  2. **Buckets Protocol Layer** (shared backend services) handles event logging, identity, payments, and analytics.

Design Patterns & Frameworks

- **Event Sourcing**: Every user interaction becomes an immutable event. In Phase 1, events are recorded in an operational `inquiries` table. In Phase 2+, they also append to a global event log called **Passport**.
- **Serverless Functions**: Lightweight business logic (API routes, background processors) live close to users at the edge for fast responses.
- **Config-Driven Features**: A single `config/organization.ts` file toggles features (voting, donations, leaderboards) on or off without code changes.

Scalability, Maintainability & Performance

- **Serverless + CDN**: Frontend and APIs deploy on Vercel’s global CDN and edge functions, scaling automatically under load.
- **Shared Database**: One Postgres instance (Supabase) holds both form data and Buckets tables, avoiding multiple silos.
- **Modular Code**: Clear separation between form handling, event emission, and downstream processors keeps code easy to understand and update.

## 2. Database Management

Database Technologies

- **Supabase Postgres**: A managed PostgreSQL database that stores both operational data and, later, Buckets events and projections.
- **Extensions**:
  - **TimescaleDB**: For time-series optimizations on event logs.
  - **pgvector**: To power vector searches for MediaID DNA similarity.

Data Structure & Access

- **Operational Tables**: e.g. `inquiries` for form submissions.
- **Event Log**: `passport_entries` as an append-only table of all actions (inquiries, votes, RSVPs, donations).
- **Projection Tables**: Trinity systems (MediaID profiles, Coliseum leaderboards, Treasury payouts) read from events and maintain user-friendly views.

Best Practices

- **Schema Versioning**: All changes run as SQL migrations, tracked in version control.
- **Connection Pooling**: Supabase’s built-in pool handles many concurrent connections safely.
- **Data Retention & Archiving**: Legacy inquiry records can be purged or moved to cheaper storage if needed.

## 3. Database Schema

### Operational Table (Phase 1)

In human terms, the **inquiries** table collects every form submission:

- **id**: Unique identifier (UUID)
- **created_at**: Timestamp of submission
- **name**, **email**, **phone**: Contact info
- **organization**: Which group deployed the form
- **interest_type**: e.g. "volunteer", "sponsor"
- **message**: User’s free-text note
- **status**: e.g. "new", "contacted"
- **source_page**: Which page triggered the form
- **consent_to_contact**: Boolean for GDPR/CCPA

SQL Layout:

```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  organization TEXT,
  interest_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  source_page TEXT,
  consent_to_contact BOOLEAN
);
```

### Event Log (Phase 2+)

The **passport_entries** table is append-only and records every event:

- **id**: UUID
- **event_type**: e.g. "inquiry", "vote", "rsvp", "donation"
- **payload**: JSON blob of event details
- **created_at**: Timestamp

SQL Layout:

```sql
CREATE TABLE passport_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Projection Tables (Phase 2+)

Examples:

- **mediaid_profiles**: Stores user profiles with DNA vectors
- **coliseum_leaderboards**: Aggregates vote tallies per nominee
- **treasury_payments**: Tracks donation transactions and splits

Each of these has its own schema, rebuilt or updated by background jobs reading from `passport_entries`.

## 4. API Design and Endpoints

Approach: RESTful endpoints via Next.js API routes or edge functions. All routes accept and return JSON. Authentication is optional in Phase 1 and passwordless (magic link) in Phase 2.

Key Endpoints (Phase 1)

- **POST /api/inquiries**: Accepts form data
  - Body: `{ name, email, phone, interest_type, message, source_page, consent_to_contact }`
  - Action: Inserts into `inquiries` and sends emails via Resend
- **GET /api/config**: Returns `config/organization.ts` at runtime for front-end setup

Phase 2+ Endpoints (when buckets.enabled = true)

- **POST /api/events**: General event emitter
  - Body: `{ event_type, payload }`
  - Action: Inserts into `passport_entries`, then enqueues background processing
- **GET /api/profiles**: Returns paginated MediaID profiles
- **GET /api/leaderboards**: Returns current tallies for voting
- **POST /api/donations**: Charges via Stripe Connect, records a donation event

Authentication & Authorization

- **Public**: `/api/inquiries`, `/api/events` (when enabled)
- **Protected**: `/api/donations`, `/api/profiles` if user must be signed in; uses Supabase Auth’s JWT in headers

## 5. Hosting Solutions

- **Frontend & Edge Functions**: Hosted on **Vercel**
  - Automatic global CDN, HTTPS, and scaling
  - Preview URLs for pull requests
- **Database & Auth**: Hosted by **Supabase** (managed Postgres)
  - Built-in auth, database, and storage
- **Email Delivery**: Hosted by **Resend**

Benefits

- **Reliability**: 99.9% uptime SLAs, automatic failover
- **Scalability**: Zero-config scaling on Vercel edge functions; Postgres scales vertically and via read replicas
- **Cost-Effectiveness**: Pay-as-you-go pricing; serverless eliminates idle costs for low-traffic deployments

## 6. Infrastructure Components

Load Balancing & CDN

- Vercel’s global edge network automatically routes users to the closest server.

Caching

- **HTTP Caching**: Next.js sets cache headers for static assets.
- **Edge Cache**: API responses can be cached at the edge where appropriate (e.g. leaderboards refreshed every minute).

Background Processing

- **Edge Functions & Workers**: Small tasks (e.g. converting inquiry to passport event, updating projections) run in parallel as serverless jobs.

Logging & Queuing

- Events from `/api/events` go into a queue (e.g. Supabase’s replication or a simple job table) and processed asynchronously.

Content Delivery

- All front-end assets (JS, CSS, images) delivered over Vercel’s CDN.

## 7. Security Measures

Authentication & Authorization

- Phase 1: Public APIs with no login.
- Phase 2: Passwordless login via Supabase Auth (magic links). JWT tokens secure protected routes.

Data Encryption

- **In transit**: HTTPS/TLS everywhere (Vercel, Supabase, Resend).
- **At rest**: Supabase encrypts Postgres storage.

Environment Variables

- All API keys and secrets kept in Vercel and Supabase environment settings, never in code.

Privacy & Compliance

- **Cookie Consent**: Banner on first load, opt-in/out for marketing/analytics cookies.
- **Data Deletion Requests**: API route to delete or export a user’s data on request (tied to `inquiries` or `passport_entries`).
- **GDPR/CCPA**: Privacy policy page, consent logs, and deletion workflows.

Rate Limiting & Abuse

- Basic rate limits on form submissions and event endpoint to avoid spam.

## 8. Monitoring and Maintenance

Performance Monitoring

- **Vercel Analytics**: Tracks request times, error rates, geographic distribution.
- **Database Metrics**: Supabase dashboard for query performance, connections, CPU.
- **CI Audits**: GitHub Actions run Lighthouse and axe-core checks on every pull request to catch regressions early.

Error Tracking

- **Sentry** (or similar) for capturing serverless function exceptions and unhandled promise rejections.

Uptime & Alerts

- **Uptime Robot** or Vercel’s built-in monitoring pings `/health` endpoint every minute and alerts on downtime.

Maintenance Strategy

- **Non-Destructive Feature Flags**: `buckets.*` flags can be toggled without code deploys, allowing safe rollouts.
- **Database Migrations**: Use a migration tool (e.g. `pg-migrate`) with a clear rollback path.
- **Scheduled Reviews**: Monthly audits of schema growth, index efficiency, and log retention.

## 9. Conclusion and Overall Backend Summary

Denver Spotlight’s backend is a lean, serverless-friendly system built on Supabase and Vercel. In Phase 1, it simply collects form submissions and sends emails. As the project grows, it seamlessly becomes a full event-sourcing platform by:

- Emitting immutable events to **Passport**
- Powering profiles via **MediaID DNA**
- Handling payments in **Treasury**
- Showing real-time leaderboards through **Coliseum**

All of this is driven by one configuration file, hosted on scalable cloud services, and protected by modern security and compliance practices. The result is a fast, maintainable, and future-proof backend that supports both a beautiful front end and the growing needs of the Buckets ecosystem.