-- Run once in Supabase SQL Editor.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now());
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
-- No insert/update/delete policies: users can never change roles via the API.

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id) values (new.id); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create table public.problem_statements (
  id uuid primary key default gen_random_uuid(),
  number int not null unique check (number between 1 and 12),
  title text not null default '' check (char_length(title) <= 120),
  description text not null default '' check (char_length(description) <= 2000),
  category text check (char_length(category) <= 40),
  is_revealed boolean not null default false,
  revealed_at timestamptz,
  updated_at timestamptz not null default now());
insert into public.problem_statements(number) select generate_series(1,12);
alter table public.problem_statements enable row level security;
create policy "admin read" on public.problem_statements for select to authenticated using (public.is_admin());
create policy "admin update" on public.problem_statements for update to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.problem_statements from anon, authenticated;
grant select, update(title, description, category, is_revealed) on public.problem_statements to authenticated;

-- Policy: revealed_at is set when revealed and CLEARED when hidden.
create function public.touch_problem() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.is_revealed and not old.is_revealed then new.revealed_at := now();
  elsif not new.is_revealed then new.revealed_at := null; end if;
  return new;
end $$;
create trigger touch_problem before update on public.problem_statements for each row execute function public.touch_problem();

-- Public view (runs with owner rights, so it bypasses RLS but only exposes safe columns).
create view public.public_problems as
  select number, is_revealed,
    case when is_revealed then title end as title,
    case when is_revealed then description end as description,
    case when is_revealed then category end as category
  from public.problem_statements;
grant select on public.public_problems to anon, authenticated;

-- Make your first admin (after signing up / creating the user in Auth > Users):
-- update public.profiles set role='admin' where id = (select id from auth.users where email='you@example.com');
