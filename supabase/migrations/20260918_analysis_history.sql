-- Run in Supabase → SQL Editor. Stores each completed threat analysis per user.
create table if not exists public.analysis_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  system_name  text not null,
  threat_count int  not null,
  risk_score   numeric not null,
  system       jsonb not null,
  result       jsonb not null,
  created_at   timestamptz not null default now()
);

create index if not exists analysis_history_user_created_idx
  on public.analysis_history (user_id, created_at desc);

alter table public.analysis_history enable row level security;

create policy "users manage own history"
  on public.analysis_history
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
