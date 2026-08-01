-- The Modern Money Blueprint — Reviews
-- Run in addition to the previous schema files, not replacing them.

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) between 10 and 1000),
  reviewer_name text,
  reviewer_role text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (user_id) -- one review per purchaser; they can edit it while pending
);

alter table reviews enable row level security;

-- The public homepage needs to read approved reviews WITHOUT requiring
-- login — this policy allows that specifically, and only for approved
-- rows.
create policy "anyone can read approved reviews" on reviews
  for select using (status = 'approved');

-- A logged-in user can also see their OWN review regardless of status
-- (so they can see it's still pending) — combined with the policy
-- above via OR, per how Postgres RLS combines multiple permissive
-- policies for the same operation.
create policy "users can read their own review" on reviews
  for select using (auth.uid() = user_id);

-- Insert is only allowed while the row being created is 'pending' — a
-- user cannot insert a review already marked 'approved'.
create policy "users can insert their own pending review" on reviews
  for insert with check (auth.uid() = user_id and status = 'pending');

-- Update is only allowed while the EXISTING row is still 'pending', and
-- only if the row STAYS 'pending' after the update — this is what
-- actually prevents a user from approving their own review by updating
-- the status column directly (RLS doesn't restrict which columns an
-- UPDATE touches, only which rows and what the resulting row looks
-- like, so this check has to cover the status value explicitly rather
-- than relying on the app not offering that field in its own form).
-- Approving a review means changing its status to 'approved' directly
-- in the Supabase table editor, which uses your own elevated access and
-- isn't subject to this policy.
create policy "users can edit their own pending review" on reviews
  for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');
