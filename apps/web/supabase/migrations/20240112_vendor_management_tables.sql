-- Additional tables and fields for vendor management system
-- Extends the existing marketplace system with vendor-specific functionality

-- =====================================================
-- USER PROFILES TABLE (for account settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name VARCHAR(100),
  phone_number VARCHAR(50),
  location VARCHAR(200),
  bio TEXT,
  profile_image_url TEXT,
  theme VARCHAR(10) DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER NOTIFICATION SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  event_reminders BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PERFORMER PORTFOLIO TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS performer_portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'audio')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT, -- For video/audio in seconds
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PERFORMER AVAILABILITY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS performer_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(performer_id, date)
);

-- =====================================================
-- USER ADDRESSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(2) DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER PAYMENT METHODS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- card, bank_account, etc.
  brand VARCHAR(50), -- visa, mastercard, etc.
  last4 VARCHAR(4),
  exp_month INT,
  exp_year INT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADD PAYOUT_ID TO ORDER_ITEMS (missing field)
-- =====================================================
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS payout_id UUID REFERENCES vendor_payouts(id) ON DELETE SET NULL;

-- =====================================================
-- VENDOR DAILY STATS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_vendor_daily_stats(
  p_vendor_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS TABLE (
  date DATE,
  orders BIGINT,
  revenue DECIMAL(10,2),
  customers BIGINT,
  views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(p_start_date::date, p_end_date::date, '1 day'::interval)::date as date
  ),
  daily_orders AS (
    SELECT 
      DATE(oi.created_at) as order_date,
      COUNT(*) as order_count,
      SUM(oi.vendor_commission) as daily_revenue,
      COUNT(DISTINCT o.user_id) as unique_customers
    FROM order_items oi
    JOIN marketplace_orders o ON oi.order_id = o.id
    WHERE oi.vendor_id = p_vendor_id
      AND DATE(oi.created_at) BETWEEN p_start_date AND p_end_date
    GROUP BY DATE(oi.created_at)
  )
  SELECT 
    ds.date,
    COALESCE(do.order_count, 0) as orders,
    COALESCE(do.daily_revenue, 0) as revenue,
    COALESCE(do.unique_customers, 0) as customers,
    0::BIGINT as views -- Placeholder for product views
  FROM date_series ds
  LEFT JOIN daily_orders do ON ds.date = do.order_date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- UPDATE EXISTING TABLES WITH MISSING FIELDS
-- =====================================================

-- Add missing fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'));

-- Add missing fields to vendor_profiles
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS policies JSONB DEFAULT '{}';

-- =====================================================
-- ENABLE RLS ON NEW TABLES
-- =====================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

-- User profiles: Users manage their own
CREATE POLICY "Users manage own profile" ON user_profiles
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User notification settings: Users manage their own
CREATE POLICY "Users manage own notifications" ON user_notification_settings
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Performer portfolio: Public read, performers manage their own
CREATE POLICY "Public read performer portfolio" ON performer_portfolio
  FOR SELECT USING (is_active = true);

CREATE POLICY "Performers manage own portfolio" ON performer_portfolio
  FOR ALL USING (performer_id IN (
    SELECT id FROM performers WHERE user_id = auth.uid()
  ))
  WITH CHECK (performer_id IN (
    SELECT id FROM performers WHERE user_id = auth.uid()
  ));

-- Performer availability: Performers manage their own
CREATE POLICY "Performers manage own availability" ON performer_availability
  FOR ALL USING (performer_id IN (
    SELECT id FROM performers WHERE user_id = auth.uid()
  ))
  WITH CHECK (performer_id IN (
    SELECT id FROM performers WHERE user_id = auth.uid()
  ));

-- User addresses: Users manage their own
CREATE POLICY "Users manage own addresses" ON user_addresses
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User payment methods: Users manage their own
CREATE POLICY "Users manage own payment methods" ON user_payment_methods
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_settings_user_id ON user_notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_performer_portfolio_performer_id ON performer_portfolio(performer_id);
CREATE INDEX IF NOT EXISTS idx_performer_portfolio_media_type ON performer_portfolio(media_type);
CREATE INDEX IF NOT EXISTS idx_performer_availability_performer_id ON performer_availability(performer_id);
CREATE INDEX IF NOT EXISTS idx_performer_availability_date ON performer_availability(date);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_payout_id ON order_items(payout_id);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_notification_settings_updated_at BEFORE UPDATE ON user_notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performer_availability_updated_at BEFORE UPDATE ON performer_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_payment_methods_updated_at BEFORE UPDATE ON user_payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE user_addresses 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON user_addresses
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE user_payment_methods 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_payment_trigger
  BEFORE INSERT OR UPDATE ON user_payment_methods
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment();