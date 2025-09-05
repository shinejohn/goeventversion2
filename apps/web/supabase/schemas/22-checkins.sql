-- Check-ins table for social check-in feature
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  
  -- Check-in location
  venue_id uuid references public.venues(id) on delete set null,
  venue_name text not null, -- Store name in case venue is deleted
  event_id uuid references public.events(id) on delete set null,
  
  -- Location data
  location point, -- PostGIS point (longitude, latitude)
  location_accuracy numeric, -- Accuracy in meters
  address text,
  
  -- Check-in details
  check_in_time timestamp with time zone default now(),
  check_out_time timestamp with time zone,
  is_active boolean default true,
  
  -- Social features
  note text,
  mood text,
  privacy text default 'friends' check (privacy in ('public', 'friends', 'private')),
  photos text[] default '{}', -- Array of photo URLs
  
  -- Engagement
  likes_count integer default 0,
  comments_count integer default 0,
  
  -- Event details (denormalized for performance)
  event_details jsonb, -- {name, date, time, imageUrl, ticketId, calendarEventId}
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Check-in likes
create table if not exists public.checkin_likes (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid references public.checkins(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(checkin_id, user_id)
);

-- Check-in comments
create table if not exists public.checkin_comments (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid references public.checkins(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  comment text not null,
  created_at timestamp with time zone default now()
);

-- Indexes
create index idx_checkins_user_id on public.checkins(user_id);
create index idx_checkins_venue_id on public.checkins(venue_id);
create index idx_checkins_event_id on public.checkins(event_id);
create index idx_checkins_is_active on public.checkins(is_active);
create index idx_checkins_privacy on public.checkins(privacy);
create index idx_checkins_location on public.checkins using gist(location);
create index idx_checkin_likes_checkin on public.checkin_likes(checkin_id);
create index idx_checkin_comments_checkin on public.checkin_comments(checkin_id);

-- Enable RLS
alter table public.checkins enable row level security;
alter table public.checkin_likes enable row level security;
alter table public.checkin_comments enable row level security;

-- RLS Policies for check-ins
create policy "Users can view check-ins based on privacy"
  on public.checkins for select
  to authenticated
  using (
    user_id = auth.uid() or
    privacy = 'public' or
    (privacy = 'friends' and user_id in (
      -- This would check friend relationships
      select user_id from public.checkins where user_id = auth.uid() limit 1
    ))
  );

create policy "Users can create their own check-ins"
  on public.checkins for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own check-ins"
  on public.checkins for update
  to authenticated
  using (user_id = auth.uid());

-- RLS Policies for likes
create policy "Users can view likes"
  on public.checkin_likes for select
  to authenticated
  using (true);

create policy "Users can like check-ins"
  on public.checkin_likes for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can unlike their own likes"
  on public.checkin_likes for delete
  to authenticated
  using (user_id = auth.uid());

-- Function to increment likes count
create or replace function increment_checkin_likes()
returns trigger as $$
begin
  update public.checkins 
  set likes_count = likes_count + 1
  where id = new.checkin_id;
  return new;
end;
$$ language plpgsql;

-- Function to decrement likes count
create or replace function decrement_checkin_likes()
returns trigger as $$
begin
  update public.checkins 
  set likes_count = greatest(0, likes_count - 1)
  where id = old.checkin_id;
  return old;
end;
$$ language plpgsql;

-- Triggers for like counts
create trigger increment_likes_trigger
after insert on public.checkin_likes
for each row execute procedure increment_checkin_likes();

create trigger decrement_likes_trigger
after delete on public.checkin_likes
for each row execute procedure decrement_checkin_likes();