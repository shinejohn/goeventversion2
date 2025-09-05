-- Calendars table for personal and shared calendars
create table if not exists public.calendars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  
  -- Calendar details
  name text not null,
  description text,
  slug text unique,
  color text default '#4F46E5', -- Hex color for calendar
  
  -- Visibility and access
  visibility text default 'private' check (visibility in ('public', 'private', 'friends')),
  is_shared boolean default false,
  contributors uuid[] default '{}', -- Array of user IDs who can add events
  
  -- Settings
  categories text[] default '{}', -- Event categories for this calendar
  timezone text default 'America/New_York',
  
  -- Sync settings
  sync_settings jsonb default '{}'::jsonb,
  external_calendar_url text, -- For importing from Google/Apple/etc
  
  -- Monetization (for public calendars)
  is_monetized boolean default false,
  subscription_price decimal(10,2),
  one_time_price decimal(10,2),
  
  -- Stats
  subscriber_count integer default 0,
  event_count integer default 0,
  view_count integer default 0,
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Calendar events junction table
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid references public.calendars(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade,
  
  -- For external or custom events not in main events table
  custom_event jsonb, -- {title, description, start_datetime, end_datetime, location, etc}
  
  -- Display settings
  color text, -- Override calendar color for this event
  reminder_minutes integer default 30,
  
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id)
);

-- Calendar subscriptions
create table if not exists public.calendar_subscriptions (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid references public.calendars(id) on delete cascade not null,
  subscriber_id uuid references auth.users(id) on delete cascade not null,
  
  -- Subscription details
  subscription_type text check (subscription_type in ('free', 'paid', 'one_time')),
  amount_paid decimal(10,2),
  
  -- Settings
  notifications_enabled boolean default true,
  
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone,
  
  unique(calendar_id, subscriber_id)
);

-- Indexes
create index idx_calendars_owner_id on public.calendars(owner_id);
create index idx_calendars_account_id on public.calendars(account_id);
create index idx_calendars_slug on public.calendars(slug);
create index idx_calendars_visibility on public.calendars(visibility);
create index idx_calendar_events_calendar_id on public.calendar_events(calendar_id);
create index idx_calendar_events_event_id on public.calendar_events(event_id);
create index idx_calendar_subscriptions_subscriber on public.calendar_subscriptions(subscriber_id);

-- Enable RLS
alter table public.calendars enable row level security;
alter table public.calendar_events enable row level security;
alter table public.calendar_subscriptions enable row level security;

-- RLS Policies for calendars
create policy "Users can view their own calendars"
  on public.calendars for select
  to authenticated
  using (owner_id = auth.uid() or visibility = 'public');

create policy "Users can create their own calendars"
  on public.calendars for insert
  to authenticated
  with check (owner_id = auth.uid() and account_id in (
    select id from public.accounts where id = auth.uid()
  ));

create policy "Users can update their own calendars"
  on public.calendars for update
  to authenticated
  using (owner_id = auth.uid() or auth.uid() = any(contributors));

-- RLS Policies for calendar events
create policy "Users can view events in accessible calendars"
  on public.calendar_events for select
  to authenticated
  using (
    calendar_id in (
      select id from public.calendars 
      where owner_id = auth.uid() 
      or visibility = 'public'
      or auth.uid() = any(contributors)
    )
  );

create policy "Calendar owners and contributors can add events"
  on public.calendar_events for insert
  to authenticated
  with check (
    calendar_id in (
      select id from public.calendars 
      where owner_id = auth.uid() 
      or auth.uid() = any(contributors)
    )
  );

-- Function to generate calendar slug
create or replace function generate_calendar_slug(calendar_name text)
returns text as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 1;
begin
  base_slug := lower(regexp_replace(calendar_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  
  while exists(select 1 from public.calendars where slug = final_slug) loop
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  end loop;
  
  return final_slug;
end;
$$ language plpgsql;

-- Trigger to auto-generate slug
create or replace function set_calendar_slug()
returns trigger as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := generate_calendar_slug(new.name);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_calendar_slug_trigger
before insert on public.calendars
for each row execute procedure set_calendar_slug();