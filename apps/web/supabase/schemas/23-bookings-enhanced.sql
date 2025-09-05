-- Enhanced bookings table with all required fields from UI
alter table public.bookings 
add column if not exists booking_number text unique,
add column if not exists event_name text,
add column if not exists event_type text,
add column if not exists guest_count integer default 1,
add column if not exists start_time time,
add column if not exists end_time time,
add column if not exists setup_requirements text,
add column if not exists services jsonb default '[]'::jsonb, -- Array of selected services
add column if not exists contact_person jsonb default '{}'::jsonb, -- {name, email, phone}
add column if not exists special_requests text,
add column if not exists subtotal decimal(10,2),
add column if not exists service_fee decimal(10,2),
add column if not exists payment_method text,
add column if not exists payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
add column if not exists qr_code text unique;

-- Add indexes for new fields
create index if not exists idx_bookings_booking_number on public.bookings(booking_number);
create index if not exists idx_bookings_payment_status on public.bookings(payment_status);

-- Function to generate booking number
create or replace function generate_booking_number()
returns text as $$
begin
  return 'BK-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6);
end;
$$ language plpgsql;

-- Function to generate booking QR code
create or replace function generate_booking_qr()
returns text as $$
begin
  return 'BOOK-' || gen_random_uuid()::text;
end;
$$ language plpgsql;

-- Update trigger for booking defaults
create or replace function set_booking_defaults()
returns trigger as $$
begin
  if new.booking_number is null then
    new.booking_number := generate_booking_number();
  end if;
  
  if new.qr_code is null then
    new.qr_code := generate_booking_qr();
  end if;
  
  -- Calculate service fee (10% of subtotal)
  if new.service_fee is null and new.subtotal is not null then
    new.service_fee := round(new.subtotal * 0.1, 2);
  end if;
  
  -- Calculate total
  if new.subtotal is not null and new.service_fee is not null then
    new.total_price := new.subtotal + new.service_fee;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create or replace the trigger
drop trigger if exists set_booking_defaults_trigger on public.bookings;
create trigger set_booking_defaults_trigger
before insert or update on public.bookings
for each row execute procedure set_booking_defaults();