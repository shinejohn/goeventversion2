/*
 * -------------------------------------------------------
 * Section: Products and Shop
 * We create the schema for products and shop functionality
 * -------------------------------------------------------
 */

-- Create products table
create table if not exists
  public.products (
    id uuid primary key default extensions.uuid_generate_v4 (),
    name varchar(255) not null,
    description text,
    category varchar(100) not null,
    subcategory varchar(100),
    price decimal(10,2) not null,
    compare_at_price decimal(10,2),
    currency varchar(3) default 'USD',
    images text[] default '{}',
    brand varchar(100),
    sku varchar(100) unique,
    in_stock boolean default true,
    stock_count integer default 0,
    rating decimal(3,2),
    review_count integer default 0,
    tags text[] default '{}',
    features text[] default '{}',
    is_new boolean default false,
    is_sale boolean default false,
    is_featured boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    created_by uuid references auth.users
  );

-- Enable RLS
alter table "public"."products" enable row level security;

-- Products are publicly readable
create policy "products_read" on public.products for select
  to authenticated, anon using (is_active = true);

-- Only admins can manage products
create policy "products_manage" on public.products for all
  to authenticated using (
    public.is_super_admin()
  );

-- Create vendors table
create table if not exists
  public.vendors (
    id uuid primary key default extensions.uuid_generate_v4 (),
    user_id uuid references auth.users on delete cascade,
    business_name varchar(255) not null,
    description text,
    email varchar(320) not null,
    phone varchar(50),
    website varchar(500),
    address text,
    city varchar(100),
    state varchar(100),
    country varchar(100),
    postal_code varchar(20),
    logo_url varchar(500),
    is_verified boolean default false,
    is_active boolean default true,
    commission_rate decimal(5,2) default 10.00,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
  );

-- Enable RLS
alter table "public"."vendors" enable row level security;

-- Vendors can read their own data
create policy "vendors_read_own" on public.vendors for select
  to authenticated using (
    user_id = auth.uid() OR
    public.is_super_admin()
  );

-- Vendors can update their own data
create policy "vendors_update_own" on public.vendors for update
  to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Anyone can apply to become a vendor
create policy "vendors_create" on public.vendors for insert
  to authenticated with check (user_id = auth.uid());

-- Create vendor products relationship
create table if not exists
  public.vendor_products (
    vendor_id uuid references public.vendors on delete cascade,
    product_id uuid references public.products on delete cascade,
    primary key (vendor_id, product_id)
  );

-- Enable RLS
alter table "public"."vendor_products" enable row level security;

-- Vendors can manage their own product associations
create policy "vendor_products_manage" on public.vendor_products for all
  to authenticated using (
    vendor_id IN (
      SELECT id FROM public.vendors WHERE user_id = auth.uid()
    ) OR
    public.is_super_admin()
  );

-- Create product categories table for better organization
create table if not exists
  public.product_categories (
    id varchar(50) primary key,
    name varchar(100) not null,
    icon varchar(10),
    display_order integer default 0,
    is_active boolean default true
  );

-- Insert default categories
insert into public.product_categories (id, name, icon, display_order) values
  ('t-shirts', 'T-Shirts', '👕', 1),
  ('hoodies', 'Hoodies', '🧥', 2),
  ('hats', 'Hats & Caps', '🧢', 3),
  ('accessories', 'Accessories', '🎒', 4),
  ('stickers', 'Stickers', '🏷️', 5),
  ('posters', 'Posters', '🖼️', 6),
  ('mugs', 'Mugs & Drinkware', '☕', 7),
  ('bags', 'Bags & Totes', '👜', 8),
  ('pins', 'Pins & Badges', '📌', 9)
ON CONFLICT (id) DO NOTHING;

-- Categories are publicly readable
grant select on public.product_categories to authenticated, anon;

-- Create shopping cart table
create table if not exists
  public.cart_items (
    id uuid primary key default extensions.uuid_generate_v4 (),
    user_id uuid references auth.users on delete cascade,
    session_id uuid,
    product_id uuid references public.products on delete cascade,
    quantity integer not null default 1,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    CONSTRAINT cart_user_or_session CHECK (
      (user_id IS NOT NULL AND session_id IS NULL) OR 
      (user_id IS NULL AND session_id IS NOT NULL)
    )
  );

-- Enable RLS
alter table "public"."cart_items" enable row level security;

-- Users can manage their own cart
create policy "cart_items_manage_own" on public.cart_items for all
  to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Anonymous users can manage their session cart
create policy "cart_items_manage_session" on public.cart_items for all
  to anon using (session_id IS NOT NULL);

-- Create indexes for performance
create index idx_products_category on public.products(category);
create index idx_products_is_active on public.products(is_active);
create index idx_products_is_featured on public.products(is_featured);
create index idx_cart_items_user_id on public.cart_items(user_id);
create index idx_cart_items_session_id on public.cart_items(session_id);

-- Function to update product rating when reviews are added
create or replace function update_product_rating()
returns trigger as $$
begin
  update public.products
  set 
    rating = (
      select avg(rating) 
      from public.product_reviews 
      where product_id = NEW.product_id
    ),
    review_count = (
      select count(*) 
      from public.product_reviews 
      where product_id = NEW.product_id
    )
  where id = NEW.product_id;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Create product reviews table
create table if not exists
  public.product_reviews (
    id uuid primary key default extensions.uuid_generate_v4 (),
    product_id uuid references public.products on delete cascade,
    user_id uuid references auth.users on delete cascade,
    rating integer check (rating >= 1 and rating <= 5),
    title varchar(255),
    review text,
    is_verified_purchase boolean default false,
    helpful_count integer default 0,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
  );

-- Enable RLS
alter table "public"."product_reviews" enable row level security;

-- Reviews are publicly readable
create policy "reviews_read" on public.product_reviews for select
  to authenticated, anon using (true);

-- Users can create reviews
create policy "reviews_create" on public.product_reviews for insert
  to authenticated with check (user_id = auth.uid());

-- Users can update their own reviews
create policy "reviews_update_own" on public.product_reviews for update
  to authenticated using (user_id = auth.uid());

-- Trigger to update product rating
create trigger update_product_rating_trigger
  after insert or update or delete on public.product_reviews
  for each row execute function update_product_rating();

-- Insert some sample products
INSERT INTO public.products (name, description, category, price, images, in_stock, stock_count, is_featured, features) VALUES
('GoEventCity Classic T-Shirt', 'Show your support for local events with our comfortable classic tee', 't-shirts', 24.99, ARRAY['https://picsum.photos/seed/gec-tshirt/400/400'], true, 100, true, ARRAY['100% Cotton', 'Machine Washable', 'Screen Printed Design']),
('Event Explorer Hoodie', 'Stay warm at outdoor events with this cozy hoodie', 'hoodies', 49.99, ARRAY['https://picsum.photos/seed/gec-hoodie/400/400'], true, 50, true, ARRAY['80/20 Cotton/Poly Blend', 'Kangaroo Pocket', 'Drawstring Hood']),
('Local Music Cap', 'Support local artists with this adjustable cap', 'hats', 19.99, ARRAY['https://picsum.photos/seed/gec-cap/400/400'], true, 75, false, ARRAY['Adjustable Strap', 'Embroidered Logo', 'Cotton Twill']),
('Event Memory Stickers', 'Decorate your gear with these weatherproof vinyl stickers', 'stickers', 9.99, ARRAY['https://picsum.photos/seed/gec-stickers/400/400'], true, 200, false, ARRAY['Weatherproof Vinyl', '10 Unique Designs', 'UV Resistant']),
('Concert Venue Poster', 'Beautiful art print of iconic local venues', 'posters', 15.99, ARRAY['https://picsum.photos/seed/gec-poster/400/400'], true, 30, true, ARRAY['18x24 inches', 'Museum Quality Paper', 'Ready to Frame']);