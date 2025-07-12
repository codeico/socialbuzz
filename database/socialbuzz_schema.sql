-- SocialBuzz Complete Database Schema
-- This file contains all tables, indexes, policies, and functions for the SocialBuzz platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS donation_goals CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS payout_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'creator', 'admin', 'super_admin');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE transaction_type AS ENUM ('donation', 'payout', 'refund', 'fee');
CREATE TYPE payout_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'failed');
CREATE TYPE notification_type AS ENUM ('donation_received', 'payout_approved', 'payout_completed', 'system_announcement', 'account_verified');

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    avatar TEXT,
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expires TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- USER PROFILES TABLE
-- ================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{
        "profileVisible": true,
        "showEarnings": true,
        "showDonations": true
    }',
    notification_settings JSONB DEFAULT '{
        "email": true,
        "push": true,
        "donations": true,
        "payouts": true,
        "marketing": false
    }',
    bank_account JSONB DEFAULT '{
        "bankName": "",
        "accountNumber": "",
        "accountHolderName": ""
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================================
-- TRANSACTIONS TABLE
-- ================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status transaction_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    donation_message TEXT,
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    callback_data JSONB,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- PAYOUT REQUESTS TABLE
-- ================================================
CREATE TABLE payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    bank_account JSONB NOT NULL,
    status payout_status DEFAULT 'pending',
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    reference_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- NOTIFICATIONS TABLE
-- ================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- DONATION GOALS TABLE
-- ================================================
CREATE TABLE donation_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- FAQS TABLE
-- ================================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- CONTACT SUBMISSIONS TABLE
-- ================================================
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SYSTEM SETTINGS TABLE
-- ================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    settings JSONB NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    updated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ADMIN LOGS TABLE
-- ================================================
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);
CREATE INDEX idx_transactions_payment_reference ON transactions(payment_reference);

-- Payout requests indexes
CREATE INDEX idx_payout_requests_user_id ON payout_requests(user_id);
CREATE INDEX idx_payout_requests_status ON payout_requests(status);
CREATE INDEX idx_payout_requests_created_at ON payout_requests(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Admin logs indexes
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payout_requests_updated_at BEFORE UPDATE ON payout_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donation_goals_updated_at BEFORE UPDATE ON donation_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user balances and totals
CREATE OR REPLACE FUNCTION update_user_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update recipient's total earnings and balance for completed donations
    IF NEW.status = 'completed' AND NEW.type = 'donation' AND NEW.recipient_id IS NOT NULL THEN
        UPDATE users 
        SET 
            total_earnings = total_earnings + NEW.net_amount,
            balance = balance + NEW.net_amount,
            updated_at = NOW()
        WHERE id = NEW.recipient_id;
    END IF;
    
    -- Update donor's total donations for completed donations
    IF NEW.status = 'completed' AND NEW.type = 'donation' AND NEW.user_id IS NOT NULL THEN
        UPDATE users 
        SET 
            total_donations = total_donations + NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    -- Update user balance for completed payouts
    IF NEW.status = 'completed' AND NEW.type = 'payout' AND NEW.user_id IS NOT NULL THEN
        UPDATE users 
        SET 
            balance = balance - NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating user totals
CREATE TRIGGER update_user_totals_trigger 
    AFTER UPDATE OF status ON transactions 
    FOR EACH ROW 
    WHEN (OLD.status != NEW.status)
    EXECUTE FUNCTION update_user_totals();

-- Function to update donation goal progress
CREATE OR REPLACE FUNCTION update_donation_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update donation goal progress when a donation is completed
    IF NEW.status = 'completed' AND NEW.type = 'donation' AND NEW.recipient_id IS NOT NULL THEN
        UPDATE donation_goals 
        SET 
            current_amount = (
                SELECT COALESCE(SUM(net_amount), 0)
                FROM transactions 
                WHERE recipient_id = NEW.recipient_id 
                AND type = 'donation' 
                AND status = 'completed'
                AND created_at >= donation_goals.created_at
            ),
            updated_at = NOW()
        WHERE user_id = NEW.recipient_id AND is_active = true;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating donation goal progress
CREATE TRIGGER update_donation_goal_progress_trigger 
    AFTER UPDATE OF status ON transactions 
    FOR EACH ROW 
    WHEN (OLD.status != NEW.status)
    EXECUTE FUNCTION update_donation_goal_progress();

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are viewable" ON users FOR SELECT USING (true); -- For public profile pages

-- User profiles policies
CREATE POLICY "Users can manage their own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id OR auth.uid() = recipient_id);
CREATE POLICY "Public can view completed donations for profiles" ON transactions FOR SELECT USING (status = 'completed' AND type = 'donation');

-- Payout requests policies
CREATE POLICY "Users can manage their own payout requests" ON payout_requests FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Donation goals policies
CREATE POLICY "Users can manage their own goals" ON donation_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view active goals" ON donation_goals FOR SELECT USING (is_active = true);

-- FAQs policies
CREATE POLICY "Public can view published FAQs" ON faqs FOR SELECT USING (is_published = true);

-- Contact submissions policies
CREATE POLICY "Anyone can create contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Admin-only policies (system_settings and admin_logs)
CREATE POLICY "Only admins can access system settings" ON system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);

CREATE POLICY "Only admins can access admin logs" ON admin_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);

-- ================================================
-- SAMPLE DATA FOR TESTING
-- ================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, username, password_hash, full_name, role, is_verified, email_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@socialbuzz.com', 'admin', '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O', 'System Administrator', 'super_admin', true, true);

-- Insert sample creator user (password: creator123)
INSERT INTO users (id, email, username, password_hash, full_name, role, is_verified, email_verified, balance, total_earnings) VALUES
('00000000-0000-0000-0000-000000000002', 'creator@socialbuzz.com', 'creator1', '$2a$10$mIdx6B8ygfEIligjKHQ0But/pKYnMQvZmwIAfQrgt/BVvtE4FBLl2', 'John Creator', 'creator', true, true, 150000.00, 500000.00);

-- Insert sample regular user (password: user123)
INSERT INTO users (id, email, username, password_hash, full_name, role, is_verified, email_verified, total_donations) VALUES
('00000000-0000-0000-0000-000000000003', 'user@socialbuzz.com', 'user1', '$2a$10$THTEU8.ZPCQwnY4lhO5OX.IePEI1g1FENu263SGjNPAA88jF2ad3e', 'Jane Donor', 'user', true, true, 200000.00);

-- Insert user profiles
INSERT INTO user_profiles (user_id, bio, website, location, social_links) VALUES
('00000000-0000-0000-0000-000000000002', 'Content creator and streamer', 'https://johncreator.com', 'Jakarta, Indonesia', '{"twitter": "https://twitter.com/johncreator", "youtube": "https://youtube.com/@johncreator"}'),
('00000000-0000-0000-0000-000000000003', 'Supporting amazing creators!', '', 'Bandung, Indonesia', '{}');

-- Insert sample transactions
INSERT INTO transactions (reference_id, user_id, recipient_id, type, amount, fee, net_amount, status, payment_method, donation_message, donor_name, completed_at) VALUES
('TXN-001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'donation', 50000.00, 2500.00, 47500.00, 'completed', 'bank_transfer', 'Keep up the great content!', 'Jane Donor', NOW() - INTERVAL '1 day'),
('TXN-002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'donation', 100000.00, 5000.00, 95000.00, 'completed', 'e_wallet', 'Love your streams!', 'Jane Donor', NOW() - INTERVAL '2 hours');

-- Insert sample donation goal
INSERT INTO donation_goals (user_id, title, description, target_amount, current_amount) VALUES
('00000000-0000-0000-0000-000000000002', 'New Camera Equipment', 'Help me upgrade my streaming setup with a better camera and lighting!', 2000000.00, 142500.00);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('How do I start receiving donations?', 'Create an account, verify your email, and set up your profile. You can then share your profile link with your audience.', 'Getting Started', 1),
('What payment methods are supported?', 'We support bank transfers, e-wallets (GoPay, OVO, DANA), and credit/debit cards through our secure payment gateway.', 'Payments', 2),
('How do payouts work?', 'You can request a payout once you have a minimum balance. Payouts are processed within 1-3 business days.', 'Payouts', 3);

-- Insert default system settings
INSERT INTO system_settings (settings, created_by, updated_by) VALUES
('{
    "platform": {
        "name": "SocialBuzz",
        "description": "Creator donation platform",
        "logo_url": "",
        "primary_color": "#6366f1",
        "secondary_color": "#8b5cf6",
        "maintenance_mode": false,
        "maintenance_message": "We are currently performing maintenance. Please check back later."
    },
    "payment": {
        "duitku_merchant_code": "",
        "duitku_api_key": "",
        "duitku_sandbox_mode": true,
        "minimum_donation": 5000,
        "maximum_donation": 10000000,
        "platform_fee_percentage": 5,
        "auto_payout_threshold": 100000
    },
    "security": {
        "session_timeout": 24,
        "max_login_attempts": 5,
        "password_min_length": 8,
        "require_email_verification": true,
        "enable_2fa": false,
        "jwt_secret_rotation_days": 30
    },
    "features": {
        "user_registration": true,
        "public_profiles": true,
        "donation_goals": true,
        "obs_integration": true,
        "file_uploads": true,
        "max_file_size_mb": 10
    }
}', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');

-- ================================================
-- UTILITY FUNCTIONS
-- ================================================

-- Function to generate unique reference ID
CREATE OR REPLACE FUNCTION generate_reference_id(prefix TEXT DEFAULT 'TXN')
RETURNS TEXT AS $$
DECLARE
    ref_id TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        ref_id := prefix || '-' || LPAD(counter::TEXT, 6, '0');
        
        -- Check if reference ID already exists
        IF NOT EXISTS (SELECT 1 FROM transactions WHERE reference_id = ref_id) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    RETURN ref_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_donations_made', COALESCE(SUM(CASE WHEN user_id = user_uuid AND type = 'donation' AND status = 'completed' THEN amount ELSE 0 END), 0),
        'total_donations_received', COALESCE(SUM(CASE WHEN recipient_id = user_uuid AND type = 'donation' AND status = 'completed' THEN net_amount ELSE 0 END), 0),
        'total_transactions', COUNT(CASE WHEN (user_id = user_uuid OR recipient_id = user_uuid) AND status = 'completed' THEN 1 END),
        'pending_payouts', (SELECT COUNT(*) FROM payout_requests WHERE user_id = user_uuid AND status = 'pending')
    ) INTO result
    FROM transactions;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

-- This completes the SocialBuzz database schema
-- The schema includes:
-- 1. All necessary tables with proper relationships
-- 2. Indexes for optimal performance
-- 3. Row Level Security policies
-- 4. Triggers for data consistency
-- 5. Sample data for testing
-- 6. Utility functions

SELECT 'SocialBuzz database schema created successfully!' as status;