-- Adds missing trust-layer tables for an existing Supabase project.
-- Safe to run on projects where public.users already exists.

create extension if not exists pgcrypto;

-- ID verification status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'id_status_type') THEN
    CREATE TYPE id_status_type AS ENUM ('not_submitted', 'pending', 'approved', 'rejected');
  END IF;
END
$$;

-- Dispute status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispute_status_type') THEN
    CREATE TYPE dispute_status_type AS ENUM ('open', 'under_review', 'resolved', 'rejected');
  END IF;
END
$$;

-- Verify users table exists because trust tables reference it.
DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'Required table public.users is missing. Create public.users first, then rerun this migration.';
  END IF;
END
$$;

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

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_verifications_status on public.user_verifications(id_status);
create index if not exists idx_exchanges_requester on public.exchanges(requester_id);
create index if not exists idx_exchanges_provider on public.exchanges(provider_id);
create index if not exists idx_disputes_status on public.disputes(status);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_verifications_updated_at on public.user_verifications;
create trigger trg_user_verifications_updated_at
before update on public.user_verifications
for each row execute function public.set_updated_at();

drop trigger if exists trg_disputes_updated_at on public.disputes;
create trigger trg_disputes_updated_at
before update on public.disputes
for each row execute function public.set_updated_at();

insert into public.badges (code, title, description)
values
  ('verified_household', 'Verified Household', 'Phone and pin-code verified household user'),
  ('safety_compliant', 'Safety Compliant', 'Maintains high safety checklist completion'),
  ('fast_responder', 'Fast Responder', 'Responds quickly to emergency requests')
on conflict (code) do nothing;
