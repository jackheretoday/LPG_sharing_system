create extension if not exists pgcrypto;

alter table public.users
  add column if not exists email text,
  add column if not exists password_hash text,
  add column if not exists is_email_verified boolean not null default false,
  add column if not exists email_verified_at timestamptz,
  add column if not exists is_suspended boolean not null default false,
  add column if not exists suspended_reason text,
  add column if not exists suspended_at timestamptz,
  add column if not exists avatar_url text,
  add column if not exists default_location text;

create unique index if not exists idx_users_email_unique
  on public.users (lower(email))
  where email is not null;

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  location text not null,
  resource_type text not null default 'cylinder',
  price numeric(10, 2) not null default 0,
  quantity integer not null default 1,
  status text not null default 'available',
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists buyer_id uuid references public.users(id) on delete set null,
  add column if not exists seller_name text,
  add column if not exists fill_level text,
  add column if not exists price text,
  add column if not exists tracking_id text;

create table if not exists public.resource_requests (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  requester_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete cascade,
  post_type text not null default 'update',
  title text not null,
  content text not null,
  location text,
  urgency text not null default 'medium',
  inventory jsonb not null default '{}'::jsonb,
  helpful_count integer not null default 0,
  comment_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_posts
  add column if not exists author_id uuid references public.users(id) on delete cascade,
  add column if not exists post_type text not null default 'update',
  add column if not exists title text not null default '',
  add column if not exists content text not null default '',
  add column if not exists location text,
  add column if not exists urgency text not null default 'medium',
  add column if not exists inventory jsonb not null default '{}'::jsonb,
  add column if not exists helpful_count integer not null default 0,
  add column if not exists comment_count integer not null default 0,
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  parent_comment_id uuid references public.community_comments(id) on delete cascade,
  content text not null,
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_comments
  add column if not exists post_id uuid references public.community_posts(id) on delete cascade,
  add column if not exists author_id uuid references public.users(id) on delete cascade,
  add column if not exists parent_comment_id uuid references public.community_comments(id) on delete cascade,
  add column if not exists content text not null default '',
  add column if not exists like_count integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  intensity text,
  leakage_sound text,
  duration text,
  status text not null default 'reported',
  assigned_provider_id uuid references public.users(id),
  notes text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  resource_request_id uuid references public.resource_requests(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  message_type text not null default 'text',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_resources_owner on public.resources(owner_id);
create index if not exists idx_resources_status on public.resources(status);
create index if not exists idx_resource_requests_resource on public.resource_requests(resource_id);
create index if not exists idx_resource_requests_requester on public.resource_requests(requester_id);
create index if not exists idx_community_posts_author on public.community_posts(author_id);
create index if not exists idx_community_posts_created on public.community_posts(created_at desc);
create index if not exists idx_community_comments_post on public.community_comments(post_id);
create index if not exists idx_emergency_requests_user on public.emergency_requests(user_id);
create index if not exists idx_emergency_requests_assigned on public.emergency_requests(assigned_provider_id);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);

drop trigger if exists trg_resources_updated_at on public.resources;
create trigger trg_resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

drop trigger if exists trg_resource_requests_updated_at on public.resource_requests;
create trigger trg_resource_requests_updated_at
before update on public.resource_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_community_posts_updated_at on public.community_posts;
create trigger trg_community_posts_updated_at
before update on public.community_posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_community_comments_updated_at on public.community_comments;
create trigger trg_community_comments_updated_at
before update on public.community_comments
for each row execute function public.set_updated_at();

drop trigger if exists trg_emergency_requests_updated_at on public.emergency_requests;
create trigger trg_emergency_requests_updated_at
before update on public.emergency_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();
