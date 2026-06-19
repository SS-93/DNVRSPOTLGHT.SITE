-- Denver Spotlight — Phase 1 operational table for form submissions.
-- Run in Supabase SQL Editor (or via the Supabase CLI).

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
  status text default 'new',         -- new | contacted | approved | archived
  source_page text,
  consent_to_contact boolean
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);
create index if not exists inquiries_interest_type_idx on inquiries (interest_type);

-- Row Level Security: enabled, with no public policies.
-- The server uses the service_role key (which bypasses RLS) to insert.
-- The anon/public client therefore has no read/write access.
alter table inquiries enable row level security;
