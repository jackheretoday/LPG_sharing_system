-- Adds LPG prediction and usage tracking tables for LPG sharing system

-- LPG Cylinder Status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lpg_status_type') THEN
    CREATE TYPE lpg_status_type AS ENUM ('active', 'critical', 'empty', 'refill_requested', 'refilled');
  END IF;
END
$$;

-- LPG User Cylinders Table
create table if not exists public.lpg_cylinders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  cylinder_id text not null,
  current_weight_kg numeric(10, 2) not null default 20.0,
  max_capacity_kg numeric(10, 2) not null default 20.0,
  status lpg_status_type not null default 'active',
  last_refill_date timestamptz default now(),
  refill_frequency_days integer default 30,
  purchase_date timestamptz default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT unique_user_cylinder UNIQUE(user_id, cylinder_id)
);

-- LPG Daily Usage Tracking Table
create table if not exists public.lpg_daily_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  cylinder_id uuid not null references public.lpg_cylinders(id) on delete cascade,
  usage_date date not null,
  usage_kg numeric(10, 2) not null,
  usage_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT unique_user_daily_usage UNIQUE(user_id, cylinder_id, usage_date)
);

-- LPG Prediction Results Table
create table if not exists public.lpg_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  cylinder_id uuid not null references public.lpg_cylinders(id) on delete cascade,
  current_weight_kg numeric(10, 2) not null,
  daily_avg_usage_kg numeric(10, 2) not null,
  predicted_empty_days integer not null,
  predicted_empty_date date not null,
  confidence_score numeric(3, 2),
  alert_status boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- LPG Alert Configuration Table
create table if not exists public.lpg_alert_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  alert_threshold_days integer not null default 7,
  alert_enabled boolean not null default true,
  notification_methods text[] default ARRAY['email', 'in_app'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- LPG Alerts Log Table
create table if not exists public.lpg_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  cylinder_id uuid not null references public.lpg_cylinders(id) on delete cascade,
  alert_type text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for better query performance
create index if not exists idx_lpg_cylinders_user_id on public.lpg_cylinders(user_id);
create index if not exists idx_lpg_daily_usage_user_id on public.lpg_daily_usage(user_id);
create index if not exists idx_lpg_daily_usage_date on public.lpg_daily_usage(usage_date);
create index if not exists idx_lpg_predictions_user_id on public.lpg_predictions(user_id);
create index if not exists idx_lpg_alerts_user_id on public.lpg_alerts(user_id);
create index if not exists idx_lpg_alerts_is_read on public.lpg_alerts(is_read);

-- Enable RLS (Row Level Security) for user data privacy
alter table public.lpg_cylinders enable row level security;
alter table public.lpg_daily_usage enable row level security;
alter table public.lpg_predictions enable row level security;
alter table public.lpg_alert_config enable row level security;
alter table public.lpg_alerts enable row level security;

-- RLS Policies for lpg_cylinders
create policy "Users can view their own cylinders" on public.lpg_cylinders
  for select using (auth.uid() = user_id);
create policy "Users can insert their own cylinders" on public.lpg_cylinders
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own cylinders" on public.lpg_cylinders
  for update using (auth.uid() = user_id);
create policy "Users can delete their own cylinders" on public.lpg_cylinders
  for delete using (auth.uid() = user_id);

-- RLS Policies for lpg_daily_usage
create policy "Users can view their own usage" on public.lpg_daily_usage
  for select using (auth.uid() = user_id);
create policy "Users can insert their own usage" on public.lpg_daily_usage
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own usage" on public.lpg_daily_usage
  for update using (auth.uid() = user_id);

-- RLS Policies for lpg_predictions
create policy "Users can view their own predictions" on public.lpg_predictions
  for select using (auth.uid() = user_id);
create policy "Users can insert their own predictions" on public.lpg_predictions
  for insert with check (auth.uid() = user_id);

-- RLS Policies for lpg_alert_config
create policy "Users can manage their own alert config" on public.lpg_alert_config
  for all using (auth.uid() = user_id);

-- RLS Policies for lpg_alerts
create policy "Users can view their own alerts" on public.lpg_alerts
  for select using (auth.uid() = user_id);
create policy "Users can update their own alerts" on public.lpg_alerts
  for update using (auth.uid() = user_id);
