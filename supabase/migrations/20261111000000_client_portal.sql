-- Eaglescroft client portal — schema, row-level security and storage.
-- Two roles: 'admin' (Eaglescroft staff) and 'client'. A client only ever sees
-- rows that hang off their own projects; admins see and manage everything.

-- ─── Types ────────────────────────────────────────────────────────────────
create type public.user_role        as enum ('admin', 'client');
create type public.project_status   as enum ('onboarding', 'in_progress', 'in_review', 'completed', 'on_hold');
create type public.milestone_status as enum ('upcoming', 'in_progress', 'done');
create type public.ticket_status    as enum ('open', 'in_progress', 'resolved');
create type public.invoice_kind     as enum ('deposit', 'milestone', 'balance', 'retainer', 'upsell');
create type public.invoice_status   as enum ('draft', 'sent', 'paid', 'void');
create type public.payment_status   as enum ('pending', 'success', 'failed');
create type public.document_kind    as enum ('deliverable', 'handover', 'contract', 'other');

-- ─── Profiles ─────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  email      text not null,
  full_name  text,
  company    text,
  phone      text,
  role       public.user_role not null default 'client',
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, company, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- ─── Projects ─────────────────────────────────────────────────────────────
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.profiles on delete cascade,
  title           text not null,
  service         text not null,                 -- template key, see src/lib/portal/templates.ts
  status          public.project_status not null default 'onboarding',
  progress        int not null default 0 check (progress between 0 and 100),
  summary         text,
  goals           jsonb not null default '[]',   -- [{ "title": "...", "target": "..." }]
  features        jsonb not null default '[]',   -- ["...", "..."]
  brief           jsonb not null default '{}',   -- intake answers keyed by question id
  brief_submitted_at timestamptz,
  start_date      date,
  due_date        date,
  currency        text not null default 'USD' check (currency in ('USD', 'NGN')),
  budget_minor    bigint not null default 0,      -- agreed project fee, minor units
  deposit_percent int not null default 50 check (deposit_percent between 0 and 100),
  revision_quota  int not null default 2 check (revision_quota >= 0),
  retainer_minor  bigint,                          -- monthly retainer, if any
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index on public.projects (client_id);

create function public.can_access_project(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin()
      or exists (select 1 from public.projects where id = pid and client_id = auth.uid())
$$;

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- ─── Timeline: milestones + day-by-day activity ───────────────────────────
create table public.milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects on delete cascade,
  title       text not null,
  description text,
  due_date    date,
  status      public.milestone_status not null default 'upcoming',
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);
create index on public.milestones (project_id, sort);

create table public.project_updates (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  author_id  uuid references public.profiles on delete set null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index on public.project_updates (project_id, created_at desc);

-- ─── Tickets & revisions ──────────────────────────────────────────────────
create table public.tickets (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects on delete cascade,
  author_id   uuid references public.profiles on delete set null,
  title       text not null,
  body        text not null,
  is_revision boolean not null default false,
  status      public.ticket_status not null default 'open',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index on public.tickets (project_id, created_at desc);
create trigger tickets_touch before update on public.tickets
  for each row execute function public.touch_updated_at();

create table public.ticket_messages (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.tickets on delete cascade,
  author_id  uuid references public.profiles on delete set null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index on public.ticket_messages (ticket_id, created_at);

-- ─── Billing ──────────────────────────────────────────────────────────────
create sequence public.invoice_number_seq;

create table public.invoices (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  number     text not null unique default (
    'EGS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 4, '0')
  ),
  kind       public.invoice_kind not null default 'deposit',
  status     public.invoice_status not null default 'draft',
  currency   text not null default 'USD' check (currency in ('USD', 'NGN')),
  due_date   date,
  issued_at  timestamptz,
  paid_at    timestamptz,
  notes      text,
  created_at timestamptz not null default now()
);
create index on public.invoices (project_id);

create table public.invoice_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices on delete cascade,
  description text not null,
  quantity    numeric(10, 2) not null default 1 check (quantity > 0),
  unit_minor  bigint not null check (unit_minor >= 0),
  sort        int not null default 0
);
create index on public.invoice_items (invoice_id, sort);

create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  invoice_id   uuid not null references public.invoices on delete cascade,
  amount_minor bigint not null check (amount_minor > 0),
  currency     text not null,
  provider     text not null check (provider in ('paystack', 'stripe', 'manual')),
  reference    text not null unique,          -- provider reference: makes webhooks idempotent
  status       public.payment_status not null default 'pending',
  paid_at      timestamptz,
  raw          jsonb,
  created_at   timestamptz not null default now()
);
create index on public.payments (invoice_id);

create function public.can_access_invoice(iid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.invoices i
    where i.id = iid
      and public.can_access_project(i.project_id)
      and (i.status <> 'draft' or public.is_admin())
  )
$$;

-- ─── Documents & reviews ──────────────────────────────────────────────────
create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects on delete cascade,
  title        text not null,
  kind         public.document_kind not null default 'deliverable',
  storage_path text not null,
  size_bytes   bigint,
  uploaded_by  uuid references public.profiles on delete set null,
  created_at   timestamptz not null default now()
);
create index on public.documents (project_id);

create table public.reviews (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects on delete cascade,
  author_id  uuid references public.profiles on delete set null,
  rating     int not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now()
);

-- ─── Row-level security ───────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.milestones      enable row level security;
alter table public.project_updates enable row level security;
alter table public.tickets         enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.invoices        enable row level security;
alter table public.invoice_items   enable row level security;
alter table public.payments        enable row level security;
alter table public.documents       enable row level security;
alter table public.reviews         enable row level security;

-- profiles: read self (admins read all); clients may edit contact fields only (guarded below)
create policy "profiles read" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin write" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

create function public.guard_profile_update() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_admin()
     and (new.role is distinct from old.role or new.email is distinct from old.email) then
    raise exception 'Only an admin can change role or email';
  end if;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

create policy "projects read" on public.projects for select
  using (client_id = auth.uid() or public.is_admin());
create policy "projects admin write" on public.projects for all
  using (public.is_admin()) with check (public.is_admin());
-- clients submit their brief; every other column is admin-managed (guarded below)
create policy "projects client brief" on public.projects for update
  using (client_id = auth.uid()) with check (client_id = auth.uid());

create function public.guard_project_update() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and not public.is_admin()
     and (to_jsonb(new) - 'brief' - 'brief_submitted_at' - 'updated_at')
         is distinct from (to_jsonb(old) - 'brief' - 'brief_submitted_at' - 'updated_at') then
    raise exception 'Clients can only update the project brief';
  end if;
  return new;
end $$;
create trigger projects_guard before update on public.projects
  for each row execute function public.guard_project_update();

create policy "milestones read" on public.milestones for select using (public.can_access_project(project_id));
create policy "milestones admin" on public.milestones for all using (public.is_admin()) with check (public.is_admin());

create policy "updates read" on public.project_updates for select using (public.can_access_project(project_id));
create policy "updates admin" on public.project_updates for all using (public.is_admin()) with check (public.is_admin());

create policy "tickets read" on public.tickets for select using (public.can_access_project(project_id));
create policy "tickets create" on public.tickets for insert
  with check (public.can_access_project(project_id) and author_id = auth.uid());
create policy "tickets admin" on public.tickets for all using (public.is_admin()) with check (public.is_admin());

create policy "ticket messages read" on public.ticket_messages for select
  using (exists (select 1 from public.tickets t where t.id = ticket_id and public.can_access_project(t.project_id)));
create policy "ticket messages create" on public.ticket_messages for insert
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.tickets t where t.id = ticket_id and public.can_access_project(t.project_id))
  );

create policy "invoices read" on public.invoices for select using (public.can_access_invoice(id));
create policy "invoices admin" on public.invoices for all using (public.is_admin()) with check (public.is_admin());

create policy "invoice items read" on public.invoice_items for select using (public.can_access_invoice(invoice_id));
create policy "invoice items admin" on public.invoice_items for all using (public.is_admin()) with check (public.is_admin());

create policy "payments read" on public.payments for select using (public.can_access_invoice(invoice_id));
create policy "payments admin" on public.payments for all using (public.is_admin()) with check (public.is_admin());

create policy "documents read" on public.documents for select using (public.can_access_project(project_id));
create policy "documents admin" on public.documents for all using (public.is_admin()) with check (public.is_admin());

create policy "reviews read" on public.reviews for select using (public.can_access_project(project_id));
create policy "reviews client write" on public.reviews for insert
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
  );
create policy "reviews client update" on public.reviews for update
  using (author_id = auth.uid()) with check (author_id = auth.uid());

-- ─── Storage: private bucket, files live under <project_id>/... ───────────
insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false)
on conflict (id) do nothing;

create policy "project files read" on storage.objects for select
  using (bucket_id = 'project-files' and public.can_access_project(((storage.foldername(name))[1])::uuid));
create policy "project files admin write" on storage.objects for all
  using (bucket_id = 'project-files' and public.is_admin())
  with check (bucket_id = 'project-files' and public.is_admin());
