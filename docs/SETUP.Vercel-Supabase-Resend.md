# Setup Runbook — Supabase · Resend · Vercel

Follow this when you're ready to take Denver Spotlight live. The code already
reads these env vars and **degrades gracefully** until they're set (forms still
work in the UI; submissions just aren't persisted/emailed until configured).

Order: **Supabase → Resend → Vercel**.

---

## 1. Supabase (database)

1. Create a project at https://supabase.com (region close to your users).
2. Create the `inquiries` table — open **SQL Editor** and run the migration in
   `supabase/migrations/0001_inquiries.sql` (also reproduced below).
3. Grab credentials from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`
     (server-only; never expose to the browser — our `lib/supabase.ts` is
     server-only and uses it to bypass RLS for inserts).

```sql
create extension if not exists "pgcrypto";

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  phone text,
  organization text,
  interest_type text,
  message text,
  status text default 'new',
  source_page text,
  consent_to_contact boolean
);

-- RLS on; only the service role (server) writes. No public client access.
alter table inquiries enable row level security;
```

> Phase 2 only: also create `passport_entries` (see
> `docs/planning-bundle/backend_structure_document.md`) and flip
> `org.buckets.passport = true` in `config/organization.ts`.

---

## 2. Resend (email)

1. Create an account at https://resend.com.
2. **Add domain** `denverspotlight.org` → Resend shows DNS records (SPF, DKIM,
   and a return-path/MX). Add them at your DNS provider (or in Vercel → Domains →
   DNS once the domain is on Vercel). Wait for **Verified**.
3. Create an **API key** → `RESEND_API_KEY`.
4. Choose the sender + forwarding addresses:
   - `CONTACT_FROM_EMAIL` = `Denver Spotlight <info@denverspotlight.org>`
   - `CONTACT_FORWARD_TO` = where team notifications land (e.g.
     `info@denverspotlight.org` or a personal inbox).

> Email won't send until the domain is **verified** and `RESEND_API_KEY` +
> `CONTACT_FORWARD_TO` are set. Until then the API logs a warning and the form
> still reports success.

---

## 3. Vercel (hosting)

1. Push this repo to GitHub.
2. Import it at https://vercel.com → it auto-detects Next.js.
3. **Project Settings → Environment Variables** — add all of the vars below for
   Production (and Preview if you want previews to work).
4. **Domains** → add `denverspotlight.org` and follow Vercel's DNS instructions
   (this is also where you can host the Resend DNS records).
5. Deploy. Vercel handles HTTPS automatically.

---

## 4. Environment Variables (all)

Copy `.env.example` to `.env.local` for local dev, and set the same keys in
Vercel for production.

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API | DB project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API | server-only insert key |
| `RESEND_API_KEY` | Resend | send transactional email |
| `CONTACT_FROM_EMAIL` | you | verified sender, e.g. `Denver Spotlight <info@denverspotlight.org>` |
| `CONTACT_FORWARD_TO` | you | inbox that receives inquiry notifications |

---

## 5. Verify it works

1. `npm run dev`, open the site, go to **/get-involved**, submit the form.
2. Check the Supabase **inquiries** table for the new row.
3. Check `CONTACT_FORWARD_TO` for the notification email and the submitter's
   inbox for the confirmation.
4. Locally without env set: the form shows success and the server logs
   `Supabase not configured — dev mode` / `Resend not configured` — expected.
