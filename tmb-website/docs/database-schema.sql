-- The Modern Money Blueprint — Phase 2 schema
-- Run in the Supabase SQL editor once a project exists.
-- All tables key off Supabase's built-in auth.users; RLS scopes every
-- row to auth.uid() so users can only ever read/write their own data.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_number int not null check (chapter_number between 1 and 49),
  completed_at timestamptz not null default now(),
  unique (user_id, chapter_number)
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_number int not null,
  note text,
  created_at timestamptz not null default now()
);

create table downloads_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_slug text not null, -- e.g. 'net-worth-tracker', 'ai-prompt-library'
  downloaded_at timestamptz not null default now()
);

create table worksheet_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  worksheet_slug text not null,
  responses jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, worksheet_slug)
);

-- Phase 2 AI Coach: conversation + message history, scoped to the user.
create table coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references coach_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table reading_progress enable row level security;
alter table bookmarks enable row level security;
alter table downloads_log enable row level security;
alter table worksheet_responses enable row level security;
alter table coach_conversations enable row level security;
alter table coach_messages enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own progress" on reading_progress for all using (auth.uid() = user_id);
create policy "own bookmarks" on bookmarks for all using (auth.uid() = user_id);
create policy "own downloads" on downloads_log for all using (auth.uid() = user_id);
create policy "own worksheets" on worksheet_responses for all using (auth.uid() = user_id);
create policy "own conversations" on coach_conversations for all using (auth.uid() = user_id);
create policy "own messages" on coach_messages for all using (
  auth.uid() = (select user_id from coach_conversations where id = conversation_id)
);
