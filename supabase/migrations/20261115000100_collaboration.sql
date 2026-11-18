-- Collaboration layer: team roles & signatures, project chat, tasks, notifications,
-- web-push subscriptions, team availability and meeting bookings.

-- ─── Team identity ────────────────────────────────────────────────────────
alter table public.profiles
  add column title         text,                              -- "CEO", "CTO", "Customer Rep"…
  add column signature     text,                              -- shown under team messages
  add column avatar_url    text,
  add column timezone      text not null default 'Africa/Lagos',
  add column last_seen_at  timestamptz,
  add column notify_email  boolean not null default true;

create function public.is_team() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
$$;

-- Team members work across every project; clients only their own.
create or replace function public.can_access_project(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_team()
      or exists (select 1 from public.projects where id = pid and client_id = auth.uid())
$$;

create or replace function public.can_access_invoice(iid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.invoices i
    where i.id = iid
      and public.can_access_project(i.project_id)
      and (i.status <> 'draft' or public.is_team())
  )
$$;

-- Clients see who they're talking to: team profiles are readable by any signed-in user.
create policy "team profiles visible" on public.profiles for select
  using (auth.uid() is not null and role in ('admin', 'staff'));
create policy "team reads profiles" on public.profiles for select using (public.is_team());

create or replace function public.guard_profile_update() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_admin()
     and (new.role is distinct from old.role
          or new.email is distinct from old.email
          or new.title is distinct from old.title) then
    raise exception 'Only an admin can change role, email or title';
  end if;
  return new;
end $$;

create or replace function public.guard_project_update() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_team()
     and (to_jsonb(new) - 'brief' - 'brief_submitted_at' - 'updated_at')
         is distinct from (to_jsonb(old) - 'brief' - 'brief_submitted_at' - 'updated_at') then
    raise exception 'Clients can only update the project brief';
  end if;
  return new;
end $$;

-- Day-to-day project work opens up to all team members; money stays admin-only.
drop policy "projects admin write" on public.projects;
create policy "projects team write" on public.projects for all using (public.is_team()) with check (public.is_team());
drop policy "milestones admin" on public.milestones;
create policy "milestones team" on public.milestones for all using (public.is_team()) with check (public.is_team());
drop policy "updates admin" on public.project_updates;
create policy "updates team" on public.project_updates for all using (public.is_team()) with check (public.is_team());
drop policy "tickets admin" on public.tickets;
create policy "tickets team" on public.tickets for all using (public.is_team()) with check (public.is_team());
drop policy "documents admin" on public.documents;
create policy "documents team" on public.documents for all using (public.is_team()) with check (public.is_team());
drop policy "project files admin write" on storage.objects;
create policy "project files team write" on storage.objects for all
  using (bucket_id = 'project-files' and public.is_team())
  with check (bucket_id = 'project-files' and public.is_team());
-- anyone on a project may attach files to its chat
create policy "project chat uploads" on storage.objects for insert
  with check (
    bucket_id = 'project-files'
    and (storage.foldername(name))[2] = 'chat'
    and public.can_access_project(((storage.foldername(name))[1])::uuid)
  );

-- ─── Project team ─────────────────────────────────────────────────────────
create table public.project_members (
  project_id uuid not null references public.projects on delete cascade,
  user_id    uuid not null references public.profiles on delete cascade,
  role       text,                                   -- "Project lead", "Designer"…
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);
alter table public.project_members enable row level security;
create policy "members read" on public.project_members for select using (public.can_access_project(project_id));
create policy "members team write" on public.project_members for all using (public.is_team()) with check (public.is_team());

-- ─── Chat ─────────────────────────────────────────────────────────────────
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects on delete cascade,
  author_id   uuid references public.profiles on delete set null,
  body        text not null default '' check (char_length(body) <= 8000),
  attachments jsonb not null default '[]',           -- [{ path, name, size, type }]
  reply_to    uuid references public.messages on delete set null,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz,
  deleted_at  timestamptz
);
create index on public.messages (project_id, created_at desc);
alter table public.messages enable row level security;
create policy "messages read" on public.messages for select using (public.can_access_project(project_id));
create policy "messages send" on public.messages for insert
  with check (author_id = auth.uid() and public.can_access_project(project_id));
create policy "messages edit own" on public.messages for update
  using (author_id = auth.uid()) with check (author_id = auth.uid());

create function public.guard_message_update() returns trigger language plpgsql as $$
begin
  if new.project_id <> old.project_id or new.author_id is distinct from old.author_id or new.created_at <> old.created_at then
    raise exception 'Messages can only be edited or deleted';
  end if;
  return new;
end $$;
create trigger messages_guard before update on public.messages
  for each row execute function public.guard_message_update();

create table public.conversation_reads (
  project_id   uuid not null references public.projects on delete cascade,
  user_id      uuid not null references public.profiles on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (project_id, user_id)
);
alter table public.conversation_reads enable row level security;
create policy "reads own" on public.conversation_reads for all
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.can_access_project(project_id));
create policy "reads team" on public.conversation_reads for select using (public.is_team());

-- ─── Tasks ────────────────────────────────────────────────────────────────
create type public.task_status   as enum ('todo', 'in_progress', 'review', 'done');
create type public.task_priority as enum ('low', 'medium', 'high');

create table public.tasks (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects on delete cascade,
  title          text not null check (char_length(title) between 1 and 200),
  description    text,
  status         public.task_status not null default 'todo',
  priority       public.task_priority not null default 'medium',
  assignee_id    uuid references public.profiles on delete set null,
  due_date       date,
  created_by     uuid references public.profiles on delete set null,
  client_visible boolean not null default true,
  sort           double precision not null default 0,
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index on public.tasks (project_id, status, sort);
create index on public.tasks (assignee_id);
create trigger tasks_touch before update on public.tasks for each row execute function public.touch_updated_at();
alter table public.tasks enable row level security;

create function public.is_project_client(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.projects where id = pid and client_id = auth.uid())
$$;

create policy "tasks read" on public.tasks for select
  using (public.is_team() or (client_visible and public.is_project_client(project_id)));
create policy "tasks create" on public.tasks for insert
  with check (
    public.is_team()
    or (public.is_project_client(project_id) and created_by = auth.uid() and client_visible)
  );
create policy "tasks update" on public.tasks for update
  using (public.is_team() or (public.is_project_client(project_id) and client_visible and (assignee_id = auth.uid() or created_by = auth.uid())));
create policy "tasks delete" on public.tasks for delete
  using (public.is_team() or created_by = auth.uid());

-- Clients may move their tasks along (status); everything else is the team's call.
create function public.guard_task_update() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_team()
     and (to_jsonb(new) - 'status' - 'completed_at' - 'updated_at' - 'sort')
         is distinct from (to_jsonb(old) - 'status' - 'completed_at' - 'updated_at' - 'sort') then
    raise exception 'Clients can only change a task''s status';
  end if;
  new.completed_at = case when new.status = 'done' then coalesce(old.completed_at, now()) else null end;
  return new;
end $$;
create trigger tasks_guard before update on public.tasks for each row execute function public.guard_task_update();

-- ─── Notifications & push ─────────────────────────────────────────────────
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles on delete cascade,
  kind       text not null,                           -- message, task, ticket, invoice, payment, meeting, update
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "notifications own read" on public.notifications for select using (user_id = auth.uid());
create policy "notifications own update" on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  user_agent text,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push own" on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── Availability & meetings ──────────────────────────────────────────────
create extension if not exists btree_gist with schema extensions;

create table public.availability (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles on delete cascade,
  weekday      smallint not null check (weekday between 0 and 6),   -- 0 = Sunday
  start_minute int not null check (start_minute between 0 and 1439),
  end_minute   int not null check (end_minute between 1 and 1440),
  check (end_minute > start_minute)
);
create index on public.availability (user_id, weekday);
alter table public.availability enable row level security;
create policy "availability read" on public.availability for select using (auth.uid() is not null);
create policy "availability own" on public.availability for all
  using (user_id = auth.uid() and public.is_team()) with check (user_id = auth.uid() and public.is_team());
create policy "availability admin" on public.availability for all using (public.is_admin()) with check (public.is_admin());

create type public.meeting_status as enum ('scheduled', 'cancelled', 'completed');

create table public.meetings (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references public.projects on delete set null,
  host_id     uuid not null references public.profiles on delete cascade,
  client_id   uuid references public.profiles on delete set null,
  title       text not null,
  agenda      text,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      public.meeting_status not null default 'scheduled',
  meeting_url text,
  created_by  uuid references public.profiles on delete set null,
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at),
  constraint meetings_no_double_booking
    exclude using gist (host_id with =, tstzrange(starts_at, ends_at) with &&) where (status = 'scheduled')
);
create index on public.meetings (client_id, starts_at);
create index on public.meetings (host_id, starts_at);
alter table public.meetings enable row level security;
create policy "meetings read" on public.meetings for select using (public.is_team() or client_id = auth.uid());
create policy "meetings book" on public.meetings for insert
  with check (public.is_team() or (client_id = auth.uid() and created_by = auth.uid()));
create policy "meetings update" on public.meetings for update
  using (public.is_team() or client_id = auth.uid());

create function public.guard_meeting_update() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_team()
     and (to_jsonb(new) - 'status') is distinct from (to_jsonb(old) - 'status') then
    raise exception 'Clients can only cancel a meeting';
  end if;
  if auth.uid() is not null and not public.is_team() and new.status not in ('scheduled', 'cancelled') then
    raise exception 'Clients can only cancel a meeting';
  end if;
  return new;
end $$;
create trigger meetings_guard before update on public.meetings for each row execute function public.guard_meeting_update();

-- ─── Avatars (public bucket, one folder per user) ─────────────────────────
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;
create policy "avatars read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars own write" on storage.objects for all
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ─── Realtime ─────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.messages, public.notifications, public.tasks;
