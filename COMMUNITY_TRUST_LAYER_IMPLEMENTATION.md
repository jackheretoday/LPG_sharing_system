# Community Trust Layer Implementation Guide

## 1. Objective
Build a trust-first system for LPG sharing with these requirements:
- 3 user types: Household, Verified Reseller, Volunteer Inspector
- KYC-lite onboarding: phone OTP + address pin + optional ID verification
- Trust score per user based on:
  - successful exchanges
  - safety checklist completion rate
  - dispute rate
  - emergency response speed
- Badges shown on profile/listings:
  - Verified Household
  - Safety Compliant
  - Fast Responder

## 2. High-Level Design
Use a layered model:

1. Identity Layer
- Signup/login
- role assignment
- OTP verification

2. Verification Layer
- address pin verification
- optional ID upload and review
- inspector approval workflow

3. Reputation Layer
- trust score engine
- badge assignment
- fraud and abuse controls

4. Moderation Layer
- dispute handling
- temporary suspension
- manual trust override by admins

## 3. Recommended Tech Stack

## 3.1 Frontend
- React + Tailwind CSS
- Form handling: React Hook Form
- Validation: Zod
- API client: Axios or fetch

## 3.2 Backend
- Node.js + Express
- Validation: Zod or Joi
- Authentication tokens: JWT
- Password hashing: bcryptjs (if password fallback is needed)

## 3.3 Database (Best Free Path)
Option A (recommended): Supabase
- Postgres database
- Auth support
- Row Level Security
- Storage bucket for optional ID docs

Option B: Firebase
- Firestore + Auth
- Easier phone OTP setup in some cases
- Less SQL flexibility for scoring analytics

## 3.4 Caching/Rate Limits (optional)
- Upstash Redis free tier for OTP attempt throttling and abuse prevention

## 4. APIs: Which Are Needed and Which Are Free

## 4.1 Phone OTP
Do you need an external API?
- If strict phone OTP is mandatory: yes, usually an SMS provider is needed.

Free options:
- Firebase Auth Phone: easy integration, but production usage may incur cost after limits.
- Supabase Phone Auth: depends on provider integration and may involve SMS cost.

Practical recommendation:
- Development: use test OTP mode or mock OTP service.
- Production: connect Twilio/MSG91/Fast2SMS and set spending limits.

## 4.2 Address Pin Validation
Do you need an external API?
- Not mandatory.

Free options:
- Use static India PIN code dataset (CSV/table) in your database.
- Optional geocoding with OpenStreetMap Nominatim (free with strict usage policy).

## 4.3 Optional ID Verification
Do you need an external API?
- Not required for MVP.

Free option for MVP:
- Upload ID image to storage.
- Manual approval by Volunteer Inspector or Admin.

Paid automation later:
- HyperVerge, Signzy, Onfido, etc.

## 4.4 Maps and Nearby Matching
Free option:
- Leaflet + OpenStreetMap tiles.

## 4.5 Safety and Alerts
No external paid API needed for MVP.
- Store safety checklist results in your own backend.

## 5. How to Get and Configure Services

## 5.1 Supabase (free project)
1. Create account at supabase.com.
2. Create new project.
3. Get project URL and anon key from Project Settings.
4. Add environment variables in backend:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## 5.2 SMS Provider (if needed)
1. Create account (Twilio or local SMS provider).
2. Complete sender setup (region rules apply).
3. Get API key and sender id.
4. Add environment variables:
- SMS_API_KEY
- SMS_SENDER_ID
- SMS_BASE_URL

## 5.3 OpenStreetMap / Nominatim
- No key needed for basic usage.
- Follow rate limits and add User-Agent header.
- For higher traffic, host your own geocoder or use a paid plan.

## 6. Data Model (Core Tables)

## 6.1 users
- id (uuid)
- phone
- name
- role (household, verified_reseller, volunteer_inspector)
- is_phone_verified
- created_at

## 6.2 user_verifications
- id
- user_id
- address_text
- pin_code
- is_pin_verified
- id_doc_url (nullable)
- id_status (not_submitted, pending, approved, rejected)
- reviewed_by
- reviewed_at

## 6.3 trust_metrics
- user_id
- total_exchanges
- successful_exchanges
- safety_checks_completed
- disputes_count
- avg_response_seconds
- trust_score
- updated_at

## 6.4 badges
- id
- code (verified_household, safety_compliant, fast_responder)
- title
- description

## 6.5 user_badges
- user_id
- badge_id
- granted_at

## 6.6 disputes
- id
- exchange_id
- raised_by
- against_user_id
- reason
- status
- resolved_by
- resolved_at

## 7. Trust Score Formula (MVP)
Use a weighted score from 0 to 100.

trust_score =
- 40 percent success rate
- 25 percent safety completion rate
- 20 percent response speed score
- 15 percent dispute quality score

Example normalization:
- success_rate = successful_exchanges / max(total_exchanges, 1)
- safety_rate = safety_checks_completed / max(total_exchanges, 1)
- response_speed_score = clamp(1 - avg_response_seconds / 1800, 0, 1)
- dispute_score = clamp(1 - disputes_count / max(total_exchanges, 1), 0, 1)

Final:
trust_score = round((0.40*success_rate + 0.25*safety_rate + 0.20*response_speed_score + 0.15*dispute_score) * 100)

## 8. Badge Rules

Verified Household
- role = household
- phone verified true
- pin verified true

Safety Compliant
- at least 10 exchanges
- safety completion rate >= 95 percent

Fast Responder
- at least 10 accepted emergency requests
- average response <= 300 seconds

## 9. Required Backend Modules

1. Auth module
- signup/login
- OTP request/verify
- JWT session management

2. Verification module
- pin code check
- optional ID upload
- inspector review endpoint

3. Trust module
- score computation job
- badge assignment job
- profile trust summary endpoint

4. Moderation module
- dispute create/update
- user flag/suspend
- audit logs

5. Exchange integration module
- update trust metrics after every completed exchange

## 10. Suggested API Endpoints

Auth
- POST /api/auth/request-otp
- POST /api/auth/verify-otp
- POST /api/auth/login
- GET /api/auth/me

User and verification
- PATCH /api/users/profile
- POST /api/verification/pin-verify
- POST /api/verification/id-upload
- POST /api/verification/id-review

Trust and badges
- GET /api/trust/me
- GET /api/trust/user/:id
- POST /api/trust/recompute/:userId (admin/internal)

Disputes
- POST /api/disputes
- PATCH /api/disputes/:id
- GET /api/disputes

Exchange hooks
- POST /api/internal/exchange-completed
- POST /api/internal/emergency-response-logged

## 11. Security and Abuse Controls
- Rate limit OTP requests per phone and IP.
- Lock account for repeated failed OTP attempts.
- Store audit logs for verification decisions.
- Signed URLs for ID document access.
- Role-based access control on inspector/admin endpoints.

## 12. MVP Implementation Plan (4 Sprints)

Sprint 1
- role-based signup
- OTP flow
- pin verification

Sprint 2
- trust metrics table
- trust score calculation
- trust summary API

Sprint 3
- badge engine
- profile badge rendering
- dispute creation flow

Sprint 4
- inspector review workflow
- abuse controls and rate limits
- analytics dashboard for moderators

## 13. What Can Be Fully Free in MVP
Likely free:
- Backend (Render free tier, Railway trial, or local)
- Database and storage (Supabase free tier limits)
- Maps (OSM + Leaflet with policy compliance)
- Manual KYC review flow

May involve cost in production:
- SMS OTP at scale
- Advanced identity verification APIs
- High-volume geocoding

## 14. Final Recommendation
For your current stage, use this path:
- Supabase for database + storage + core auth
- Manual optional ID verification by volunteer inspectors
- Phone OTP in dev test mode first, then paid SMS provider later
- Trust score + badges as first-class product features from day one

This gives you a deployable, low-cost, real-world trust layer that can scale gradually without blocking MVP launch.

## 15. Supabase Database Schema (SQL - Ready to Run)

Run this in Supabase SQL Editor after project setup.

```sql
-- Recommended extension for UUID generation
create extension if not exists pgcrypto;

-- Role enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('household', 'verified_reseller', 'volunteer_inspector', 'admin');
  end if;
end$$;

-- ID verification status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'id_status_type') then
    create type id_status_type as enum ('not_submitted', 'pending', 'approved', 'rejected');
  end if;
end$$;

-- Dispute status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'dispute_status_type') then
    create type dispute_status_type as enum ('open', 'under_review', 'resolved', 'rejected');
  end if;
end$$;

-- App users table linked to auth.users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  name text not null,
  role user_role not null default 'household',
  is_phone_verified boolean not null default false,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  address_text text,
  pin_code text,
  is_pin_verified boolean not null default false,
  id_doc_url text,
  id_status id_status_type not null default 'not_submitted',
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trust_metrics (
  user_id uuid primary key references public.users(id) on delete cascade,
  total_exchanges integer not null default 0,
  successful_exchanges integer not null default 0,
  safety_checks_completed integer not null default 0,
  disputes_count integer not null default 0,
  accepted_emergency_requests integer not null default 0,
  avg_response_seconds integer not null default 0,
  trust_score integer not null default 0 check (trust_score between 0 and 100),
  updated_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  user_id uuid not null references public.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Minimal exchange log for trust score integration hooks
create table if not exists public.exchanges (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.users(id),
  provider_id uuid not null references public.users(id),
  status text not null default 'pending',
  safety_check_completed boolean not null default false,
  responded_in_seconds integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  exchange_id uuid not null references public.exchanges(id) on delete cascade,
  raised_by uuid not null references public.users(id),
  against_user_id uuid not null references public.users(id),
  reason text not null,
  status dispute_status_type not null default 'open',
  resolved_by uuid references public.users(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional audit table for moderation and verification actions
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_user_verifications_status on public.user_verifications(id_status);
create index if not exists idx_exchanges_requester on public.exchanges(requester_id);
create index if not exists idx_exchanges_provider on public.exchanges(provider_id);
create index if not exists idx_disputes_status on public.disputes(status);

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_verifications_updated_at on public.user_verifications;
create trigger trg_user_verifications_updated_at
before update on public.user_verifications
for each row execute function public.set_updated_at();

drop trigger if exists trg_disputes_updated_at on public.disputes;
create trigger trg_disputes_updated_at
before update on public.disputes
for each row execute function public.set_updated_at();

-- Seed default badges
insert into public.badges (code, title, description)
values
  ('verified_household', 'Verified Household', 'Phone and pin-code verified household user'),
  ('safety_compliant', 'Safety Compliant', 'Maintains high safety checklist completion'),
  ('fast_responder', 'Fast Responder', 'Responds quickly to emergency requests')
on conflict (code) do nothing;
```

### 15.1 Row Level Security (Starter Policies)

```sql
alter table public.users enable row level security;
alter table public.user_verifications enable row level security;
alter table public.trust_metrics enable row level security;
alter table public.user_badges enable row level security;
alter table public.disputes enable row level security;

-- Users can view own profile; public trust fields can be exposed via API view if needed.
create policy if not exists users_select_own on public.users
for select using (auth.uid() = id);

create policy if not exists users_update_own on public.users
for update using (auth.uid() = id)
with check (auth.uid() = id);

create policy if not exists verifications_select_own on public.user_verifications
for select using (auth.uid() = user_id);

create policy if not exists verifications_upsert_own on public.user_verifications
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists trust_select_own on public.trust_metrics
for select using (auth.uid() = user_id);

create policy if not exists user_badges_select_own on public.user_badges
for select using (auth.uid() = user_id);
```

### 15.2 Trust Score Recompute Query (Reference)

Use this logic inside backend service or scheduled job:

```sql
-- Example for one user_id parameter (:uid)
with src as (
  select
    user_id,
    total_exchanges,
    successful_exchanges,
    safety_checks_completed,
    disputes_count,
    avg_response_seconds,
    greatest(total_exchanges, 1)::numeric as safe_total
  from public.trust_metrics
  where user_id = :uid
), calc as (
  select
    user_id,
    round((
      0.40 * (successful_exchanges / safe_total) +
      0.25 * (safety_checks_completed / safe_total) +
      0.20 * greatest(least(1 - (avg_response_seconds::numeric / 1800), 1), 0) +
      0.15 * greatest(least(1 - (disputes_count / safe_total), 1), 0)
    ) * 100)::int as new_score
  from src
)
update public.trust_metrics t
set trust_score = c.new_score,
    updated_at = now()
from calc c
where t.user_id = c.user_id;
```
