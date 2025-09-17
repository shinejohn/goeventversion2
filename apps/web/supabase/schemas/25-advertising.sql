/*
 * -------------------------------------------------------
 * Section: Advertising System
 * Schema for advertising packages, purchases, and contact inquiries
 * -------------------------------------------------------
 */

-- Advertising packages table (static data about available plans)
create table if not exists
  public.advertising_packages (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    slug varchar(100) unique not null,
    price_cents integer not null, -- Store price in cents to avoid decimal issues
    billing_period varchar(50) not null, -- 'monthly', 'annual', etc.
    description text,
    features jsonb not null default '[]'::jsonb, -- Array of feature strings
    is_active boolean default true,
    sort_order integer default 0,
    highlighted boolean default false, -- For "best value" badges
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );

comment on table public.advertising_packages is 'Available advertising packages/plans';
comment on column public.advertising_packages.price_cents is 'Price in cents (e.g., 4900 = $49.00)';
comment on column public.advertising_packages.features is 'Array of feature descriptions as JSON';

-- Advertising purchases/subscriptions
create table if not exists
  public.advertising_purchases (
    id uuid primary key default gen_random_uuid(),
    account_id uuid references public.accounts(id) on delete cascade,
    package_id uuid references public.advertising_packages(id),
    
    -- Customer information
    business_name varchar(255) not null,
    contact_name varchar(255) not null,
    email varchar(320) not null,
    phone varchar(50),
    
    -- Subscription details
    status varchar(50) not null default 'pending', -- pending, active, cancelled, expired
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    next_billing_date timestamp with time zone,
    
    -- Payment information (store minimal info, use payment provider for full details)
    payment_method varchar(50), -- 'card', 'invoice', etc.
    last_four_digits varchar(4), -- Last 4 digits of card
    billing_zip varchar(20),
    stripe_customer_id varchar(255), -- Reference to Stripe customer
    stripe_subscription_id varchar(255), -- Reference to Stripe subscription
    
    -- Tracking
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    cancelled_at timestamp with time zone,
    cancellation_reason text
  );

comment on table public.advertising_purchases is 'Active advertising subscriptions/purchases';
comment on column public.advertising_purchases.status is 'Subscription status: pending, active, cancelled, expired';

-- Index for faster lookups
create index idx_advertising_purchases_account_id on public.advertising_purchases(account_id);
create index idx_advertising_purchases_status on public.advertising_purchases(status);
create index idx_advertising_purchases_email on public.advertising_purchases(email);

-- Contact form submissions
create table if not exists
  public.advertising_contacts (
    id uuid primary key default gen_random_uuid(),
    
    -- Contact information
    company varchar(255) not null,
    contact_name varchar(255) not null,
    phone varchar(50) not null,
    email varchar(320) not null,
    address text not null,
    message text,
    
    -- Lead tracking
    status varchar(50) default 'new', -- new, contacted, qualified, converted, closed
    assigned_to varchar(255), -- Sales rep name/email
    notes text, -- Internal notes
    
    -- Source tracking
    referrer_url text,
    utm_source varchar(100),
    utm_medium varchar(100),
    utm_campaign varchar(100),
    
    -- Timestamps
    created_at timestamp with time zone default now(),
    contacted_at timestamp with time zone,
    converted_at timestamp with time zone
  );

comment on table public.advertising_contacts is 'Sales contact form submissions';
comment on column public.advertising_contacts.status is 'Lead status: new, contacted, qualified, converted, closed';

-- Index for sales team
create index idx_advertising_contacts_status on public.advertising_contacts(status);
create index idx_advertising_contacts_created_at on public.advertising_contacts(created_at desc);

-- Purchase history for analytics
create table if not exists
  public.advertising_purchase_history (
    id uuid primary key default gen_random_uuid(),
    purchase_id uuid references public.advertising_purchases(id) on delete cascade,
    event_type varchar(50) not null, -- 'created', 'renewed', 'upgraded', 'downgraded', 'cancelled'
    old_package_id uuid references public.advertising_packages(id),
    new_package_id uuid references public.advertising_packages(id),
    amount_cents integer,
    notes text,
    created_at timestamp with time zone default now()
  );

comment on table public.advertising_purchase_history is 'History of changes to advertising purchases';

-- Enable RLS
alter table public.advertising_packages enable row level security;
alter table public.advertising_purchases enable row level security;
alter table public.advertising_contacts enable row level security;
alter table public.advertising_purchase_history enable row level security;

-- RLS Policies

-- Advertising packages are public read
create policy "Anyone can view active advertising packages"
  on public.advertising_packages for select
  using (is_active = true);

-- Users can view their own purchases
create policy "Users can view their own advertising purchases"
  on public.advertising_purchases for select
  using (
    account_id = auth.uid() or
    public.has_role_on_account(account_id)
  );

-- Users can create purchases for their accounts
create policy "Users can create advertising purchases"
  on public.advertising_purchases for insert
  with check (
    account_id = auth.uid() or
    public.has_permission(auth.uid(), account_id, 'billing.manage'::public.app_permissions)
  );

-- Users can update their own purchases
create policy "Users can update their advertising purchases"
  on public.advertising_purchases for update
  using (
    account_id = auth.uid() or
    public.has_permission(auth.uid(), account_id, 'billing.manage'::public.app_permissions)
  );

-- Anyone can submit a contact form
create policy "Anyone can submit advertising contact form"
  on public.advertising_contacts for insert
  with check (true);

-- Only admins can view contact submissions
create policy "Only admins can view advertising contacts"
  on public.advertising_contacts for select
  using (public.is_super_admin());

-- Only admins can update contact submissions
create policy "Only admins can update advertising contacts"
  on public.advertising_contacts for update
  using (public.is_super_admin());

-- Purchase history follows purchase permissions
create policy "Users can view their purchase history"
  on public.advertising_purchase_history for select
  using (
    exists (
      select 1 from public.advertising_purchases p
      where p.id = purchase_id
      and (p.account_id = auth.uid() or public.has_role_on_account(p.account_id))
    )
  );

-- Insert default packages
insert into public.advertising_packages (name, slug, price_cents, billing_period, description, features, sort_order, highlighted) values
  ('Basic', 'basic', 4900, 'monthly', 'Perfect for small businesses and occasional events', 
   '["Event promotion for up to 3 events", "Standard listing placement", "Basic performance analytics", "Community directory listing"]'::jsonb,
   1, false),
  ('Professional', 'professional', 9900, 'monthly', 'Ideal for regular event organizers and venues',
   '["Event promotion for up to 10 events", "Featured listing placement", "Advanced performance analytics", "Email newsletter inclusion", "Social media promotion", "Priority support"]'::jsonb,
   2, true),
  ('Enterprise', 'enterprise', 24900, 'monthly', 'For major venues and event series',
   '["Unlimited event promotions", "Premium listing placement", "Comprehensive analytics dashboard", "Dedicated email campaigns", "Homepage showcase rotation", "Dedicated account manager", "Custom reporting"]'::jsonb,
   3, false)
on conflict (slug) do nothing;

-- Function to handle purchase status updates
create or replace function public.update_advertising_purchase_status()
returns trigger as $$
begin
  -- Log status changes
  if old.status is distinct from new.status then
    insert into public.advertising_purchase_history (
      purchase_id,
      event_type,
      old_package_id,
      new_package_id,
      notes
    ) values (
      new.id,
      case 
        when new.status = 'active' and old.status = 'pending' then 'created'
        when new.status = 'cancelled' then 'cancelled'
        else 'status_change'
      end,
      new.package_id,
      new.package_id,
      format('Status changed from %s to %s', old.status, new.status)
    );
  end if;
  
  -- Update timestamp
  new.updated_at = now();
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for status updates
create trigger advertising_purchase_status_update
  before update on public.advertising_purchases
  for each row
  execute function public.update_advertising_purchase_status();