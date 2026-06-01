create extension if not exists "pgcrypto";

create schema if not exists exptrack;

grant usage on schema exptrack to anon, authenticated;

create table if not exists exptrack.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  date date not null default current_date,
  description text,
  category text not null default 'Others',
  created_at timestamptz not null default now()
);

create table if not exists exptrack.category_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  keyword text not null,
  category text not null,
  created_at timestamptz not null default now(),
  unique (user_id, keyword)
);

create table if not exists exptrack.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  invested_amount numeric(12, 2) not null check (invested_amount >= 0),
  current_value numeric(12, 2) not null check (current_value >= 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on exptrack.expenses to authenticated;
grant select, insert, update, delete on exptrack.category_rules to authenticated;
grant select, insert, update, delete on exptrack.investments to authenticated;

alter table exptrack.expenses enable row level security;
alter table exptrack.category_rules enable row level security;
alter table exptrack.investments enable row level security;

drop policy if exists "Users can manage their expenses" on exptrack.expenses;
create policy "Users can manage their expenses"
on exptrack.expenses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their category rules" on exptrack.category_rules;
create policy "Users can manage their category rules"
on exptrack.category_rules
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their investments" on exptrack.investments;
create policy "Users can manage their investments"
on exptrack.investments
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists expenses_user_date_idx on exptrack.expenses (user_id, date desc);
create index if not exists category_rules_user_keyword_idx on exptrack.category_rules (user_id, keyword);
create index if not exists investments_user_date_idx on exptrack.investments (user_id, date desc);
