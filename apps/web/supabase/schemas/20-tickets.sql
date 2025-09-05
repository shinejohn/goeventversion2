-- Tickets table for event ticketing system
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  
  -- Ticket details
  ticket_type text not null, -- 'general', 'reserved', 'vip', 'platinum'
  ticket_number text unique not null,
  qr_code text unique not null,
  
  -- Pricing
  price decimal(10,2) not null,
  service_fee decimal(10,2) default 0,
  total_amount decimal(10,2) not null,
  
  -- Purchase info
  purchase_date timestamp with time zone default now(),
  quantity integer default 1 check (quantity > 0),
  
  -- Status
  status text default 'active' check (status in ('active', 'used', 'cancelled', 'expired')),
  used_at timestamp with time zone,
  
  -- Attendee info (for multiple tickets)
  attendee_info jsonb default '[]'::jsonb, -- Array of {name, email} objects
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_tickets_event_id on public.tickets(event_id);
create index idx_tickets_user_id on public.tickets(user_id);
create index idx_tickets_account_id on public.tickets(account_id);
create index idx_tickets_status on public.tickets(status);
create index idx_tickets_qr_code on public.tickets(qr_code);

-- Enable RLS
alter table public.tickets enable row level security;

-- RLS Policies
create policy "Users can view their own tickets"
  on public.tickets for select
  to authenticated
  using (user_id = auth.uid() or account_id in (
    select id from public.accounts where id = auth.uid()
  ));

create policy "Users can create tickets for their events"
  on public.tickets for insert
  to authenticated
  with check (
    user_id = auth.uid() and
    account_id in (select id from public.accounts where id = auth.uid())
  );

-- Function to generate unique ticket number
create or replace function generate_ticket_number()
returns text as $$
begin
  return 'TKT-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 8);
end;
$$ language plpgsql;

-- Function to generate QR code data
create or replace function generate_qr_code()
returns text as $$
begin
  return 'WTF-' || gen_random_uuid()::text;
end;
$$ language plpgsql;

-- Trigger to auto-generate ticket number and QR code
create or replace function set_ticket_defaults()
returns trigger as $$
begin
  if new.ticket_number is null then
    new.ticket_number := generate_ticket_number();
  end if;
  
  if new.qr_code is null then
    new.qr_code := generate_qr_code();
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger set_ticket_defaults_trigger
before insert on public.tickets
for each row execute procedure set_ticket_defaults();