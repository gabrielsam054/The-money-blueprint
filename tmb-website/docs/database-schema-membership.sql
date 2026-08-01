-- The Modern Money Blueprint — Membership subscriptions
-- Run in addition to the previous schema files, not replacing them.

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paystack_subscription_code text unique,
  paystack_customer_code text,
  plan_code text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'cancelled', 'past_due')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, plan_code)
);

alter table subscriptions enable row level security;

-- Users can read their own subscription status. All writes happen via
-- the webhook (app/api/webhooks/paystack), using the service-role
-- client — Paystack is the actual source of truth for subscription
-- state, not anything the client could set directly, so there's no
-- insert/update policy for the regular authenticated role here.
create policy "users can read their own subscription" on subscriptions
  for select using (auth.uid() = user_id);
