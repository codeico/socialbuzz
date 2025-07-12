-- ================================================
-- SOCIALBUZZ COMPLETE DATABASE SCHEMA
-- ================================================
-- Drop existing tables if they exist
DROP TABLE IF EXISTS notification_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transaction_fees CASCADE;
DROP TABLE IF EXISTS payout_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin', 'super_admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending')),
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login TIMESTAMP,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    total_supporters INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- USER PROFILES TABLE
-- ================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    birth_date DATE,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    bank_details JSONB DEFAULT '{}',
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    kyc_documents JSONB DEFAULT '{}',
    donation_goal DECIMAL(15,2),
    donation_message TEXT,
    featured_content JSONB DEFAULT '[]',
    tags TEXT[],
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TRANSACTIONS TABLE
-- ================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('donation', 'payout', 'fee', 'refund', 'bonus')),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    external_transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    description TEXT,
    message TEXT,
    metadata JSONB DEFAULT '{}',
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2),
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- PAYOUT REQUESTS TABLE
-- ================================================
CREATE TABLE payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'completed')),
    bank_details JSONB NOT NULL,
    admin_notes TEXT,
    processing_fee DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2),
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TRANSACTION FEES TABLE
-- ================================================
CREATE TABLE transaction_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN ('platform_fee', 'payment_gateway_fee', 'processing_fee')),
    amount DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2),
    currency VARCHAR(3) DEFAULT 'IDR',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- NOTIFICATIONS TABLE
-- ================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('donation_received', 'payout_approved', 'payout_rejected', 'system_announcement', 'security_alert', 'new_follower')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- NOTIFICATION SETTINGS TABLE
-- ================================================
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    donation_notifications BOOLEAN DEFAULT TRUE,
    payout_notifications BOOLEAN DEFAULT TRUE,
    security_notifications BOOLEAN DEFAULT TRUE,
    marketing_notifications BOOLEAN DEFAULT FALSE,
    notification_frequency VARCHAR(20) DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'daily', 'weekly')),
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ================================================
-- SYSTEM SETTINGS TABLE
-- ================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key)
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_category ON user_profiles(category);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);

CREATE INDEX idx_payout_requests_user_id ON payout_requests(user_id);
CREATE INDEX idx_payout_requests_status ON payout_requests(status);
CREATE INDEX idx_payout_requests_created_at ON payout_requests(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_key ON system_settings(key);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Public profiles are viewable" ON users
    FOR SELECT USING (status = 'active' AND role IN ('creator', 'user'));

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- User profiles policies
CREATE POLICY "Users can view their own profile data" ON user_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public profile data is viewable" ON user_profiles
    FOR SELECT USING (EXISTS(
        SELECT 1 FROM users WHERE id = user_profiles.user_id 
        AND status = 'active' AND role IN ('creator', 'user')
    ));

CREATE POLICY "Users can update their own profile data" ON user_profiles
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        auth.uid()::text = recipient_id::text
    );

CREATE POLICY "Users can create transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Payout requests policies
CREATE POLICY "Users can view their own payout requests" ON payout_requests
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create payout requests" ON payout_requests
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Notification settings policies
CREATE POLICY "Users can manage their notification settings" ON notification_settings
    FOR ALL USING (auth.uid()::text = user_id::text);

-- System settings policies (admin only for modifications)
CREATE POLICY "Public settings are viewable" ON system_settings
    FOR SELECT USING (is_public = true);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_requests_updated_at BEFORE UPDATE ON payout_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- FUNCTIONS AND STORED PROCEDURES
-- ================================================

-- Function to calculate user stats
CREATE OR REPLACE FUNCTION calculate_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_donations DECIMAL(15,2),
    total_supporters INTEGER,
    avg_donation DECIMAL(15,2),
    last_donation_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(t.amount), 0) as total_donations,
        COUNT(DISTINCT t.user_id)::INTEGER as total_supporters,
        COALESCE(AVG(t.amount), 0) as avg_donation,
        MAX(t.created_at) as last_donation_date
    FROM transactions t
    WHERE t.recipient_id = user_uuid 
    AND t.type = 'donation' 
    AND t.status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Function to get transaction summary by period
CREATE OR REPLACE FUNCTION get_transaction_summary(
    start_date TIMESTAMP DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT CURRENT_DATE + INTERVAL '1 day'
)
RETURNS TABLE (
    total_transactions INTEGER,
    total_amount DECIMAL(15,2),
    total_fees DECIMAL(15,2),
    avg_transaction DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_transactions,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(fee_amount), 0) as total_fees,
        COALESCE(AVG(amount), 0) as avg_transaction
    FROM transactions
    WHERE created_at BETWEEN start_date AND end_date
    AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- MOCK DATA INSERTION
-- ================================================

-- Insert system settings
INSERT INTO system_settings (category, key, value, data_type, description, is_public) VALUES
('platform', 'name', 'SocialBuzz', 'string', 'Platform name', true),
('platform', 'version', '1.0.0', 'string', 'Platform version', true),
('platform', 'maintenance_mode', 'false', 'boolean', 'Maintenance mode status', true),
('platform', 'max_upload_size', '10485760', 'number', 'Max file upload size in bytes (10MB)', false),
('payment', 'duitku_merchant_code', 'DS17625', 'string', 'Duitku merchant code', false),
('payment', 'duitku_sandbox_mode', 'true', 'boolean', 'Duitku sandbox mode', false),
('payment', 'minimum_donation', '5000', 'number', 'Minimum donation amount in IDR', true),
('payment', 'maximum_donation', '10000000', 'number', 'Maximum donation amount in IDR', true),
('payment', 'platform_fee_percentage', '5', 'number', 'Platform fee percentage', false),
('payment', 'minimum_payout', '50000', 'number', 'Minimum payout amount', true),
('security', 'max_login_attempts', '5', 'number', 'Maximum login attempts', false),
('security', 'session_timeout', '86400', 'number', 'Session timeout in seconds (24 hours)', false),
('features', 'user_registration', 'true', 'boolean', 'Enable user registration', true),
('features', 'email_verification', 'true', 'boolean', 'Require email verification', false),
('features', 'kyc_required', 'false', 'boolean', 'Require KYC verification', false);

-- Insert users with correct password hashes
INSERT INTO users (id, email, username, password_hash, full_name, role, status, is_verified, email_verified, balance, total_earnings, total_donations, created_at) VALUES
-- Super Admin (password: admin123)
('00000000-0000-0000-0000-000000000001', 'admin@socialbuzz.com', 'admin', '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O', 'System Administrator', 'super_admin', 'active', true, true, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP - INTERVAL '365 days'),

-- Regular Admin (password: admin123)
('00000000-0000-0000-0000-000000000002', 'moderator@socialbuzz.com', 'moderator', '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O', 'Platform Moderator', 'admin', 'active', true, true, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP - INTERVAL '300 days'),

-- Popular Creators (password: password123)
('00000000-0000-0000-0000-000000000003', 'gaming.pro@socialbuzz.com', 'gamingpro', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Gaming Pro', 'creator', 'active', true, true, 2450000.00, 5870000.00, 125000.00, CURRENT_TIMESTAMP - INTERVAL '180 days'),

('00000000-0000-0000-0000-000000000004', 'music.star@socialbuzz.com', 'musicstar', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Music Star', 'creator', 'active', true, true, 1890000.00, 4230000.00, 89000.00, CURRENT_TIMESTAMP - INTERVAL '150 days'),

('00000000-0000-0000-0000-000000000005', 'art.creator@socialbuzz.com', 'artcreator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Digital Artist', 'creator', 'active', true, true, 967000.00, 2180000.00, 45000.00, CURRENT_TIMESTAMP - INTERVAL '120 days'),

('00000000-0000-0000-0000-000000000006', 'tech.review@socialbuzz.com', 'techreviewer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tech Reviewer', 'creator', 'active', true, true, 1456000.00, 3120000.00, 67000.00, CURRENT_TIMESTAMP - INTERVAL '90 days'),

('00000000-0000-0000-0000-000000000007', 'cooking.chef@socialbuzz.com', 'cookingchef', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Chef Indonesia', 'creator', 'active', true, true, 834000.00, 1890000.00, 34000.00, CURRENT_TIMESTAMP - INTERVAL '75 days'),

-- Regular Users/Supporters (password: user123)
('00000000-0000-0000-0000-000000000008', 'supporter1@gmail.com', 'supporter1', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Ahmad Wijaya', 'user', 'active', true, true, 150000.00, 0.00, 485000.00, CURRENT_TIMESTAMP - INTERVAL '60 days'),

('00000000-0000-0000-0000-000000000009', 'supporter2@gmail.com', 'supporter2', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Siti Nurhaliza', 'user', 'active', true, true, 75000.00, 0.00, 320000.00, CURRENT_TIMESTAMP - INTERVAL '45 days'),

('00000000-0000-0000-0000-000000000010', 'supporter3@gmail.com', 'supporter3', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Budi Santoso', 'user', 'active', true, true, 200000.00, 0.00, 275000.00, CURRENT_TIMESTAMP - INTERVAL '30 days'),

('00000000-0000-0000-0000-000000000011', 'supporter4@gmail.com', 'supporter4', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Rina Melati', 'user', 'active', true, true, 125000.00, 0.00, 450000.00, CURRENT_TIMESTAMP - INTERVAL '25 days'),

('00000000-0000-0000-0000-000000000012', 'supporter5@gmail.com', 'supporter5', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Dedi Kurniawan', 'user', 'active', true, true, 90000.00, 0.00, 380000.00, CURRENT_TIMESTAMP - INTERVAL '20 days'),

-- New Users
('00000000-0000-0000-0000-000000000013', 'newuser1@gmail.com', 'newuser1', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Fajar Ramadhan', 'user', 'active', false, false, 50000.00, 0.00, 0.00, CURRENT_TIMESTAMP - INTERVAL '5 days'),

('00000000-0000-0000-0000-000000000014', 'newcreator@gmail.com', 'newcreator', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Maya Sari', 'creator', 'active', true, true, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP - INTERVAL '3 days'),

-- Suspended User
('00000000-0000-0000-0000-000000000015', 'suspended@example.com', 'suspendeduser', '$2a$10$ELYc8T6zzzJrPl9bF/jHfOGWJJgSKn8eQh8K0xVcTp5qkVqG.DzG6', 'Suspended User', 'user', 'suspended', false, false, 0.00, 0.00, 15000.00, CURRENT_TIMESTAMP - INTERVAL '15 days');

-- Insert user profiles
INSERT INTO user_profiles (user_id, bio, website, location, social_links, preferences, bank_details, category, donation_goal, donation_message, tags) VALUES

-- Admin profiles
('00000000-0000-0000-0000-000000000001', 'System Administrator - Managing SocialBuzz platform', 'https://socialbuzz.com', 'Jakarta, Indonesia', '{}', '{"theme": "dark", "language": "id"}', '{}', 'admin', NULL, NULL, '{}'),

('00000000-0000-0000-0000-000000000002', 'Platform Moderator - Ensuring community guidelines', 'https://socialbuzz.com', 'Bandung, Indonesia', '{}', '{"theme": "light", "language": "id"}', '{}', 'admin', NULL, NULL, '{}'),

-- Creator profiles
('00000000-0000-0000-0000-000000000003', 'Professional Gamer & Streamer. Playing the latest games and sharing tips! 🎮', 'https://gamingpro.tv', 'Surabaya, Indonesia', '{"youtube": "https://youtube.com/gamingpro", "twitch": "https://twitch.tv/gamingpro", "instagram": "@gamingpro_id"}', '{"theme": "gaming", "obs_alerts": true}', '{"bank_name": "BCA", "account_number": "1234567890", "account_name": "Gaming Pro"}', 'gaming', 10000000.00, 'Support my gaming content and help me get better equipment! Every donation helps me create better content for you all! 🎮✨', '{"gaming", "streaming", "esports", "reviews"}'),

('00000000-0000-0000-0000-000000000004', 'Singer & Music Producer. Creating original songs and covers! 🎵', 'https://musicstar.id', 'Yogyakarta, Indonesia', '{"youtube": "https://youtube.com/musicstar", "spotify": "https://spotify.com/artist/musicstar", "instagram": "@musicstar_official"}', '{"theme": "music", "notification_sound": "piano"}', '{"bank_name": "Mandiri", "account_number": "9876543210", "account_name": "Music Star"}', 'music', 8000000.00, 'Help me produce more original music! Your support means everything to me! 🎵❤️', '{"music", "singing", "covers", "original"}'),

('00000000-0000-0000-0000-000000000005', 'Digital Artist specializing in character design and illustrations', 'https://artcreator.portfolio.com', 'Bali, Indonesia', '{"instagram": "@artcreator_bali", "artstation": "https://artstation.com/artcreator", "twitter": "@artcreator"}', '{"theme": "artistic", "preferred_currency": "IDR"}', '{"bank_name": "BNI", "account_number": "5432167890", "account_name": "Digital Artist"}', 'art', 5000000.00, 'Support my art journey! Help me get new drawing tools and software! 🎨', '{"art", "digital", "illustration", "character design"}'),

('00000000-0000-0000-0000-000000000006', 'Tech Reviewer & Gadget Enthusiast. Honest reviews for better tech decisions!', 'https://techreview.blog', 'Jakarta, Indonesia', '{"youtube": "https://youtube.com/techreviewer", "instagram": "@techreviewer_id", "twitter": "@techreviewer"}', '{"theme": "tech", "review_schedule": "weekly"}', '{"bank_name": "CIMB", "account_number": "7890123456", "account_name": "Tech Reviewer"}', 'technology', 6000000.00, 'Help me buy the latest gadgets to review! Your support helps me provide honest reviews! 📱💻', '{"technology", "reviews", "gadgets", "tech tips"}'),

('00000000-0000-0000-0000-000000000007', 'Indonesian Chef sharing traditional and modern recipes!', 'https://cookingchef.recipe', 'Medan, Indonesia', '{"youtube": "https://youtube.com/cookingchef", "instagram": "@chef_indonesia", "tiktok": "@cookingchef_id"}', '{"theme": "food", "recipe_language": "id"}', '{"bank_name": "BRI", "account_number": "1357924680", "account_name": "Cooking Chef"}', 'cooking', 4000000.00, 'Support my cooking channel! Help me upgrade my kitchen equipment! 👨‍🍳🍳', '{"cooking", "recipes", "indonesian food", "tutorials"}'),

-- User profiles
('00000000-0000-0000-0000-000000000008', 'Gaming enthusiast and tech lover. Supporting my favorite creators!', NULL, 'Jakarta, Indonesia', '{"instagram": "@ahmad_wijaya"}', '{"theme": "dark"}', '{"bank_name": "BCA", "account_number": "1111222233", "account_name": "Ahmad Wijaya"}', 'supporter', NULL, NULL, '{"gaming", "technology"}'),

('00000000-0000-0000-0000-000000000009', 'Music lover and art enthusiast. Love supporting creative content!', NULL, 'Bandung, Indonesia', '{"instagram": "@siti_nurhaliza"}', '{"theme": "light"}', '{"bank_name": "Mandiri", "account_number": "4444555566", "account_name": "Siti Nurhaliza"}', 'supporter', NULL, NULL, '{"music", "art"}'),

('00000000-0000-0000-0000-000000000010', 'Food blogger and cooking enthusiast', 'https://budisantoso.blog', 'Surabaya, Indonesia', '{"instagram": "@budi_santoso", "blog": "https://budisantoso.blog"}', '{"theme": "light"}', '{"bank_name": "BNI", "account_number": "7777888899", "account_name": "Budi Santoso"}', 'supporter', NULL, NULL, '{"food", "cooking", "blogging"}'),

('00000000-0000-0000-0000-000000000011', 'Content creator supporter and community member', NULL, 'Yogyakarta, Indonesia', '{"instagram": "@rina_melati"}', '{"theme": "auto"}', '{"bank_name": "BRI", "account_number": "0000111122", "account_name": "Rina Melati"}', 'supporter', NULL, NULL, '{"community", "support"}'),

('00000000-0000-0000-0000-000000000012', 'Tech worker supporting gaming and tech content', NULL, 'Semarang, Indonesia', '{"linkedin": "dedi-kurniawan"}', '{"theme": "dark"}', '{"bank_name": "CIMB", "account_number": "3333444455", "account_name": "Dedi Kurniawan"}', 'supporter', NULL, NULL, '{"technology", "gaming"}'),

('00000000-0000-0000-0000-000000000013', 'New to the platform, excited to explore!', NULL, 'Malang, Indonesia', '{}', '{"theme": "light"}', '{}', 'general', NULL, NULL, '{}'),

('00000000-0000-0000-0000-000000000014', 'Aspiring content creator, just getting started!', NULL, 'Denpasar, Indonesia', '{"instagram": "@maya_sari"}', '{"theme": "light"}', '{}', 'lifestyle', 1000000.00, 'Just started my journey as a content creator! Any support is greatly appreciated! 🌟', '{"lifestyle", "beginner", "journey"}'),

('00000000-0000-0000-0000-000000000015', 'Account suspended for violation of community guidelines', NULL, NULL, '{}', '{}', '{}', 'general', NULL, NULL, '{}');

-- Insert transactions (donations, payouts, fees)
INSERT INTO transactions (id, user_id, recipient_id, type, amount, status, payment_method, reference_id, description, message, fee_amount, net_amount, completed_at, created_at) VALUES

-- Recent donations to Gaming Pro
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'donation', 100000.00, 'completed', 'bank_transfer', 'TRX-001', 'Donation via Bank Transfer', 'Great stream today! Keep it up! 🎮', 5000.00, 95000.00, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 'donation', 50000.00, 'completed', 'e_wallet', 'TRX-002', 'Donation via E-Wallet', 'Amazing gameplay! 👏', 2500.00, 47500.00, CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '5 hours'),

('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'donation', 75000.00, 'completed', 'credit_card', 'TRX-003', 'Donation via Credit Card', 'Love your content!', 3750.00, 71250.00, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Donations to Music Star
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000004', 'donation', 80000.00, 'completed', 'bank_transfer', 'TRX-004', 'Donation via Bank Transfer', 'Beautiful voice! Keep singing! 🎵', 4000.00, 76000.00, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),

('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000004', 'donation', 60000.00, 'completed', 'e_wallet', 'TRX-005', 'Donation via E-Wallet', 'Your original songs are amazing!', 3000.00, 57000.00, CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '6 hours'),

-- Donations to Digital Artist
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'donation', 45000.00, 'completed', 'bank_transfer', 'TRX-006', 'Donation via Bank Transfer', 'Love your art style! 🎨', 2250.00, 42750.00, CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP - INTERVAL '8 hours'),

-- Donations to Tech Reviewer
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000006', 'donation', 90000.00, 'completed', 'credit_card', 'TRX-007', 'Donation via Credit Card', 'Your reviews helped me choose my phone!', 4500.00, 85500.00, CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP - INTERVAL '12 hours'),

-- Donations to Cooking Chef
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000007', 'donation', 35000.00, 'completed', 'e_wallet', 'TRX-008', 'Donation via E-Wallet', 'Tried your recipe, it was delicious! 👨‍🍳', 1750.00, 33250.00, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Older transactions
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'donation', 150000.00, 'completed', 'bank_transfer', 'TRX-009', 'Donation via Bank Transfer', 'Thank you for the entertainment!', 7500.00, 142500.00, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),

('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000004', 'donation', 120000.00, 'completed', 'credit_card', 'TRX-010', 'Donation via Credit Card', 'Keep making great music!', 6000.00, 114000.00, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Pending donation
('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', 'donation', 25000.00, 'pending', 'bank_transfer', 'TRX-011', 'Donation via Bank Transfer', 'First donation on this platform!', 1250.00, 23750.00, NULL, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

-- Payout transactions
('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', NULL, 'payout', 500000.00, 'completed', 'bank_transfer', 'PAY-001', 'Payout to Bank Account', NULL, 10000.00, 490000.00, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),

('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', NULL, 'payout', 300000.00, 'completed', 'bank_transfer', 'PAY-002', 'Payout to Bank Account', NULL, 6000.00, 294000.00, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '6 days');

-- Insert payout requests
INSERT INTO payout_requests (id, user_id, amount, status, bank_details, admin_notes, processing_fee, net_amount, processed_by, processed_at, completed_at, created_at) VALUES

-- Completed payout requests
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 500000.00, 'completed', '{"bank_name": "BCA", "account_number": "1234567890", "account_name": "Gaming Pro"}', 'Verified and processed successfully', 10000.00, 490000.00, '00000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),

('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 300000.00, 'completed', '{"bank_name": "Mandiri", "account_number": "9876543210", "account_name": "Music Star"}', 'Account verified, payment sent', 6000.00, 294000.00, '00000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '6 days'),

-- Pending payout requests
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 200000.00, 'pending', '{"bank_name": "BNI", "account_number": "5432167890", "account_name": "Digital Artist"}', NULL, 4000.00, 196000.00, NULL, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),

('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 250000.00, 'processing', '{"bank_name": "CIMB", "account_number": "7890123456", "account_name": "Tech Reviewer"}', 'Under review by finance team', 5000.00, 245000.00, '00000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '6 hours', NULL, CURRENT_TIMESTAMP - INTERVAL '12 hours');

-- Insert transaction fees
INSERT INTO transaction_fees (transaction_id, fee_type, amount, percentage, description) VALUES
('10000000-0000-0000-0000-000000000001', 'platform_fee', 5000.00, 5.00, 'Platform service fee'),
('10000000-0000-0000-0000-000000000002', 'platform_fee', 2500.00, 5.00, 'Platform service fee'),
('10000000-0000-0000-0000-000000000003', 'platform_fee', 3750.00, 5.00, 'Platform service fee'),
('10000000-0000-0000-0000-000000000004', 'platform_fee', 4000.00, 5.00, 'Platform service fee'),
('10000000-0000-0000-0000-000000000005', 'platform_fee', 3000.00, 5.00, 'Platform service fee'),
('10000000-0000-0000-0000-000000000012', 'processing_fee', 10000.00, 2.00, 'Payout processing fee'),
('10000000-0000-0000-0000-000000000013', 'processing_fee', 6000.00, 2.00, 'Payout processing fee');

-- Insert notifications
INSERT INTO notifications (user_id, type, title, message, data, is_read, priority, created_at) VALUES

-- Recent notifications for creators
('00000000-0000-0000-0000-000000000003', 'donation_received', 'New Donation Received!', 'You received a donation of Rp 100,000 from Ahmad Wijaya with message: "Great stream today! Keep it up! 🎮"', '{"amount": 100000, "donor": "Ahmad Wijaya", "transaction_id": "10000000-0000-0000-0000-000000000001"}', false, 'high', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

('00000000-0000-0000-0000-000000000003', 'donation_received', 'New Donation Received!', 'You received a donation of Rp 50,000 from Siti Nurhaliza with message: "Amazing gameplay! 👏"', '{"amount": 50000, "donor": "Siti Nurhaliza", "transaction_id": "10000000-0000-0000-0000-000000000002"}', false, 'high', CURRENT_TIMESTAMP - INTERVAL '5 hours'),

('00000000-0000-0000-0000-000000000003', 'payout_approved', 'Payout Request Approved', 'Your payout request of Rp 500,000 has been approved and processed. The funds will be transferred to your bank account within 1-3 business days.', '{"amount": 500000, "payout_id": "20000000-0000-0000-0000-000000000001"}', true, 'high', CURRENT_TIMESTAMP - INTERVAL '2 days'),

('00000000-0000-0000-0000-000000000004', 'donation_received', 'New Donation Received!', 'You received a donation of Rp 80,000 from Rina Melati with message: "Beautiful voice! Keep singing! 🎵"', '{"amount": 80000, "donor": "Rina Melati", "transaction_id": "10000000-0000-0000-0000-000000000004"}', false, 'high', CURRENT_TIMESTAMP - INTERVAL '3 hours'),

('00000000-0000-0000-0000-000000000004', 'payout_approved', 'Payout Request Approved', 'Your payout request of Rp 300,000 has been approved and processed.', '{"amount": 300000, "payout_id": "20000000-0000-0000-0000-000000000002"}', true, 'high', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Notifications for users
('00000000-0000-0000-0000-000000000008', 'system_announcement', 'Welcome to SocialBuzz!', 'Thank you for joining our creator support platform. Start supporting your favorite creators today!', '{}', true, 'normal', CURRENT_TIMESTAMP - INTERVAL '60 days'),

('00000000-0000-0000-0000-000000000013', 'system_announcement', 'Welcome to SocialBuzz!', 'Welcome to SocialBuzz! Discover amazing creators and support them with donations. Your first donation gets a 10% bonus!', '{"bonus": "10%", "first_time": true}', false, 'normal', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Security notifications
('00000000-0000-0000-0000-000000000015', 'security_alert', 'Account Suspended', 'Your account has been temporarily suspended due to violation of community guidelines. Please contact support for more information.', '{"reason": "community_guidelines", "support_email": "support@socialbuzz.com"}', false, 'urgent', CURRENT_TIMESTAMP - INTERVAL '15 days');

-- Insert notification settings for all users
INSERT INTO notification_settings (user_id, email_notifications, push_notifications, donation_notifications, payout_notifications, security_notifications, marketing_notifications) VALUES
('00000000-0000-0000-0000-000000000001', true, true, true, true, true, false),
('00000000-0000-0000-0000-000000000002', true, true, true, true, true, false),
('00000000-0000-0000-0000-000000000003', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000004', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000005', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000006', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000007', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000008', true, false, false, false, true, true),
('00000000-0000-0000-0000-000000000009', true, true, false, false, true, false),
('00000000-0000-0000-0000-000000000010', true, true, false, false, true, true),
('00000000-0000-0000-0000-000000000011', true, false, false, false, true, false),
('00000000-0000-0000-0000-000000000012', false, true, false, false, true, false),
('00000000-0000-0000-0000-000000000013', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000014', true, true, true, true, true, true),
('00000000-0000-0000-0000-000000000015', false, false, false, false, true, false);

-- Update user supporter counts based on transactions
UPDATE users SET total_supporters = (
    SELECT COUNT(DISTINCT t.user_id)
    FROM transactions t 
    WHERE t.recipient_id = users.id 
    AND t.type = 'donation' 
    AND t.status = 'completed'
) WHERE role = 'creator';

-- ================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================

-- Creator statistics view
CREATE OR REPLACE VIEW creator_stats AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.avatar,
    up.category,
    u.is_verified,
    u.total_earnings,
    u.total_supporters,
    up.donation_goal,
    COALESCE(recent_donations.donation_count_30d, 0) as donations_last_30_days,
    COALESCE(recent_donations.amount_30d, 0) as earnings_last_30_days,
    last_donation.last_donation_date,
    u.created_at as joined_date
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN (
    SELECT 
        recipient_id,
        COUNT(*) as donation_count_30d,
        SUM(amount) as amount_30d
    FROM transactions
    WHERE type = 'donation' 
    AND status = 'completed'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY recipient_id
) recent_donations ON u.id = recent_donations.recipient_id
LEFT JOIN (
    SELECT 
        recipient_id,
        MAX(created_at) as last_donation_date
    FROM transactions
    WHERE type = 'donation' 
    AND status = 'completed'
    GROUP BY recipient_id
) last_donation ON u.id = last_donation.recipient_id
WHERE u.role = 'creator' AND u.status = 'active';

-- Transaction summary view
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    DATE(created_at) as transaction_date,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN type = 'donation' THEN 1 ELSE 0 END) as donation_count,
    SUM(CASE WHEN type = 'payout' THEN 1 ELSE 0 END) as payout_count,
    SUM(CASE WHEN type = 'donation' THEN amount ELSE 0 END) as total_donations,
    SUM(CASE WHEN type = 'payout' THEN amount ELSE 0 END) as total_payouts,
    SUM(fee_amount) as total_fees,
    AVG(CASE WHEN type = 'donation' THEN amount ELSE NULL END) as avg_donation
FROM transactions
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY transaction_date DESC;

-- ================================================
-- FINAL STATISTICS
-- ================================================

-- Display summary statistics
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'SOCIALBUZZ DATABASE SCHEMA COMPLETED';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Total Users: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Total Creators: %', (SELECT COUNT(*) FROM users WHERE role = 'creator');
    RAISE NOTICE 'Total Transactions: %', (SELECT COUNT(*) FROM transactions);
    RAISE NOTICE 'Total Donations: Rp %', (SELECT TO_CHAR(SUM(amount), 'FM999,999,999') FROM transactions WHERE type = 'donation' AND status = 'completed');
    RAISE NOTICE 'Total Platform Revenue: Rp %', (SELECT TO_CHAR(SUM(fee_amount), 'FM999,999,999') FROM transactions WHERE status = 'completed');
    RAISE NOTICE '================================================';
END $$;