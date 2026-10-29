# DeepLabs — Doomsday Reveal Site
Next.js 14 (App Router) + Tailwind + Framer Motion + Supabase. Free tiers only.

## Setup
1. Create a free project at supabase.com.
2. SQL Editor → paste & run `supabase/schema.sql` (tables, RLS, public view, 12 seeded rows).
3. Auth → Users → **Add user** (email + password, auto-confirm). Auth → Providers → disable "Allow new users to sign up" (no public registration).
4. Make that user admin by running the last commented statement in `schema.sql` with your email.
5. `cp .env.example .env.local` and fill in Project URL + anon/publishable key (Project Settings → API). Never use the service-role key here.
6. `npm install && npm run dev` → http://localhost:3000 (admin at `/admin/login`).

## Deploy (Vercel)
Push to GitHub → Import on vercel.com → add the two env vars → Deploy.

## Security model
- Anon users have **no** access to `problem_statements`; they read only the `public_problems` view, which returns title/description/category **only when revealed**.
- Only users with `profiles.role='admin'` can select/update (RLS + `is_admin()`); users cannot write `profiles`. Only title/description/category/is_revealed are updatable.
- Policy: `revealed_at` is set on reveal and cleared on hide (DB trigger).
- Sync: visitors poll every 10s and on tab focus (no Realtime needed).

## Run WITHOUT Supabase (local mode)
Leave the `NEXT_PUBLIC_SUPABASE_*` vars unset and create `.env.local` with `ADMIN_PASSWORD=your-password`.
Reveals are stored in `data/problems.json`; admin signs in at `/admin/login` with just that password (httpOnly cookie).
Unrevealed text is never sent to visitors (filtered server-side). Run `npm run build && npm start` on a laptop/VPS and share its URL/LAN IP.
**Not for Vercel**: serverless disks are not persistent, so reveals would be lost. Use Supabase mode there.

## Already ran the old 6-card SQL? Run this once to upgrade to 12 cards
```sql
alter table public.problem_statements drop constraint problem_statements_number_check;
alter table public.problem_statements add constraint problem_statements_number_check check (number between 1 and 12);
insert into public.problem_statements(number) select generate_series(7,12);
```
