create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  source text not null default 'landing-page',
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_key
  on public.waitlist_signups (email);

grant insert on public.waitlist_signups to anon;

alter table public.waitlist_signups enable row level security;

drop policy if exists "Allow public waitlist inserts" on public.waitlist_signups;
create policy "Allow public waitlist inserts"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);
