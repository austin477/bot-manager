-- Bot Manager — initial schema
-- Run this in the Supabase SQL editor (project: tfzlvludpvowovvwvrta)

-- ─── bot_runs ────────────────────────────────────────────────────────────────
create table if not exists public.bot_runs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  prompt      text not null,
  model       text not null,
  status      text not null default 'queued'
                check (status in ('queued', 'running', 'completed', 'failed')),
  result      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  user_id     uuid references auth.users(id) on delete set null
);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bot_runs_set_updated_at on public.bot_runs;
create trigger bot_runs_set_updated_at
  before update on public.bot_runs
  for each row execute function public.set_updated_at();

-- ─── bot_templates ───────────────────────────────────────────────────────────
create table if not exists public.bot_templates (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text not null default '',
  default_prompt  text not null default '',
  default_model   text not null default 'claude-sonnet-4-6',
  tools           text[] not null default '{}',
  created_at      timestamptz not null default now(),
  user_id         uuid references auth.users(id) on delete set null
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS (rows visible to anyone with the anon key — lock down later with auth)
alter table public.bot_runs      enable row level security;
alter table public.bot_templates enable row level security;

-- Open read/write policies for now (replace with user-scoped policies once auth is wired)
create policy "anon_select_runs"    on public.bot_runs      for select using (true);
create policy "anon_insert_runs"    on public.bot_runs      for insert with check (true);
create policy "anon_update_runs"    on public.bot_runs      for update using (true);
create policy "anon_select_tpl"     on public.bot_templates for select using (true);
create policy "anon_insert_tpl"     on public.bot_templates for insert with check (true);

-- ─── Realtime ────────────────────────────────────────────────────────────────
-- Enable realtime on bot_runs so the dashboard gets live updates
alter publication supabase_realtime add table public.bot_runs;
