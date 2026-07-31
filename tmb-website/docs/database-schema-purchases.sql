-- The Modern Money Blueprint — Paystack purchases
-- Run this in the Supabase SQL editor in ADDITION to the original
-- docs/database-schema.sql (this is a new table, not a replacement).

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paystack_reference text not null unique,
  amount int not null,           -- in pesewas (GHS subunit): 34000 = GHS 340.00
  currency text not null default 'GHS',
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  product text not null default 'book',
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

alter table purchases enable row level security;

-- Users can read their own purchase history.
create policy "select own purchases" on purchases for select using (auth.uid() = user_id);

-- The /api/checkout route inserts a pending record using the user's own
-- session, and /checkout/callback updates it after verifying with
-- Paystack — both act as that same logged-in user, so these policies
-- allow it. The webhook (app/api/webhooks/paystack) instead uses the
-- service-role client, which bypasses RLS entirely, since it has no
-- user session to act as.
create policy "insert own purchases" on purchases for insert with check (auth.uid() = user_id);
create policy "update own purchases" on purchases for update using (auth.uid() = user_id);
