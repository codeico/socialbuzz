-- ===============================================
-- SocialBuzz Database Schema
-- PostgreSQL Database Setup for Supabase
-- ===============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- USERS TABLE
-- ===============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_verified BOOLEAN DEFAULT false,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ===============================================
-- USER PROFILES TABLE
-- ===============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    website TEXT,
    location TEXT,
    social_links JSONB DEFAULT '{}',
    bank_account JSONB,
    preferences JSONB DEFAULT '{
        "emailNotifications": true,
        "pushNotifications": true,
        "privacyMode": false
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ===============================================
-- TRANSACTIONS TABLE
-- ===============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('donation', 'payout', 'fee')),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'IDR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_method TEXT NOT NULL,
    merchant_order_id TEXT UNIQUE NOT NULL,
    reference TEXT,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_merchant_order_id ON transactions(merchant_order_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ===============================================
-- DONATIONS TABLE
-- ===============================================
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'IDR',
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_recipient_id ON donations(recipient_id);
CREATE INDEX idx_donations_transaction_id ON donations(transaction_id);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- ===============================================
-- PAYOUT REQUESTS TABLE
-- ===============================================
CREATE TABLE payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'IDR',
    bank_account JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    notes TEXT,
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX idx_payout_requests_user_id ON payout_requests(user_id);
CREATE INDEX idx_payout_requests_status ON payout_requests(status);
CREATE INDEX idx_payout_requests_created_at ON payout_requests(created_at);

-- ===============================================
-- PASSWORD RESET TOKENS TABLE
-- ===============================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ===============================================
-- NOTIFICATIONS TABLE
-- ===============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ===============================================
-- SITE CONFIG TABLE
-- ===============================================
CREATE TABLE site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE UNIQUE INDEX idx_site_config_key ON site_config(key);

-- ===============================================
-- FILE UPLOADS TABLE
-- ===============================================
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    bucket TEXT NOT NULL,
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_bucket ON file_uploads(bucket);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);

-- ===============================================
-- FUNCTIONS AND TRIGGERS
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_requests_updated_at 
    BEFORE UPDATE ON payout_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at 
    BEFORE UPDATE ON site_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- HELPER FUNCTIONS
-- ===============================================

-- Function to increment user balance
CREATE OR REPLACE FUNCTION increment_user_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET balance = balance + amount,
        total_earnings = total_earnings + amount,
        updated_at = now()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement user balance
CREATE OR REPLACE FUNCTION decrement_user_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET balance = balance - amount,
        updated_at = now()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment user donations
CREATE OR REPLACE FUNCTION increment_user_donations(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET total_donations = total_donations + amount,
        updated_at = now()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment user earnings
CREATE OR REPLACE FUNCTION increment_user_earnings(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET total_earnings = total_earnings + amount,
        updated_at = now()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- ===============================================

-- Create storage buckets
-- You need to run these in the Supabase Dashboard Storage section:
-- 1. Create bucket: avatars (public: true)
-- 2. Create bucket: uploads (public: true)
-- 3. Create bucket: assets (public: true)

-- ===============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can view their own profiles
CREATE POLICY "Users can view own profiles" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update own profiles" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = recipient_id);

-- Users can view their own donations
CREATE POLICY "Users can view own donations" ON donations
    FOR SELECT USING (auth.uid() = donor_id OR auth.uid() = recipient_id);

-- Users can view their own payout requests
CREATE POLICY "Users can view own payout requests" ON payout_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own payout requests
CREATE POLICY "Users can create own payout requests" ON payout_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own file uploads
CREATE POLICY "Users can view own file uploads" ON file_uploads
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own file uploads
CREATE POLICY "Users can create own file uploads" ON file_uploads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (you'll need to create these based on your auth system)
-- CREATE POLICY "Admins can view all data" ON users FOR ALL USING (is_admin());
-- CREATE POLICY "Admins can manage all data" ON transactions FOR ALL USING (is_admin());

-- ===============================================
-- INITIAL DATA
-- ===============================================

-- Insert default site configuration
INSERT INTO site_config (key, value) VALUES
('site_settings', '{
    "siteName": "SocialBuzz",
    "siteDescription": "Support Your Favorite Creators",
    "siteUrl": "https://socialbuzz.com",
    "platformFee": 5.0,
    "minDonationAmount": 1000,
    "maxDonationAmount": 10000000,
    "supportEmail": "support@socialbuzz.com",
    "socialLinks": {
        "twitter": "https://twitter.com/socialbuzz",
        "instagram": "https://instagram.com/socialbuzz"
    },
    "paymentMethods": ["bank_transfer", "virtual_account", "e_wallet"],
    "maintenanceMode": false
}'),
('payment_settings', '{
    "duitkuMerchantCode": "",
    "duitkuApiKey": "",
    "duitkuBaseUrl": "https://sandbox.duitku.com/webapi/api",
    "callbackUrl": "/api/v1/payment/callback",
    "returnUrl": "/payment/success"
}'),
('email_settings', '{
    "smtpHost": "",
    "smtpPort": 587,
    "smtpUser": "",
    "smtpPassword": "",
    "fromEmail": "noreply@socialbuzz.com",
    "fromName": "SocialBuzz"
}');

-- Create a default super admin user (update with your own credentials)
-- Note: You should hash the password using bcrypt before inserting
-- INSERT INTO users (email, username, full_name, password_hash, role, is_verified) VALUES
-- ('admin@socialbuzz.com', 'admin', 'Super Admin', '$2b$12$...', 'super_admin', true);

-- ===============================================
-- VIEWS FOR ANALYTICS
-- ===============================================

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.balance,
    u.total_earnings,
    u.total_donations,
    COUNT(DISTINCT d.id) as received_donations_count,
    COUNT(DISTINCT t.id) as sent_donations_count,
    u.created_at
FROM users u
LEFT JOIN donations d ON u.id = d.recipient_id
LEFT JOIN transactions t ON u.id = t.user_id AND t.type = 'donation'
GROUP BY u.id, u.username, u.full_name, u.balance, u.total_earnings, u.total_donations, u.created_at;

-- View for transaction statistics
CREATE VIEW transaction_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM transactions
GROUP BY DATE_TRUNC('day', created_at), type, status
ORDER BY date DESC;

-- View for donation statistics
CREATE VIEW donation_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    COUNT(CASE WHEN is_anonymous = true THEN 1 END) as anonymous_count
FROM donations
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- ===============================================
-- CLEANUP FUNCTIONS
-- ===============================================

-- Function to clean up expired password reset tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS VOID AS $$
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at < now() OR used_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old notifications (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS VOID AS $$
BEGIN
    DELETE FROM notifications 
    WHERE created_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- COMMENTS
-- ===============================================

-- Add comments to tables
COMMENT ON TABLE users IS 'Main users table containing authentication and profile data';
COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON TABLE transactions IS 'All financial transactions including donations and payouts';
COMMENT ON TABLE donations IS 'Specific donation records linked to transactions';
COMMENT ON TABLE payout_requests IS 'User payout withdrawal requests';
COMMENT ON TABLE password_reset_tokens IS 'Temporary tokens for password reset functionality';
COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON TABLE site_config IS 'Site-wide configuration settings';
COMMENT ON TABLE file_uploads IS 'File upload tracking and metadata';

-- Add comments to important columns
COMMENT ON COLUMN users.balance IS 'Current available balance for withdrawal';
COMMENT ON COLUMN users.total_earnings IS 'Total lifetime earnings from donations';
COMMENT ON COLUMN users.total_donations IS 'Total amount donated to others';
COMMENT ON COLUMN transactions.merchant_order_id IS 'Unique order ID for payment gateway';
COMMENT ON COLUMN transactions.reference IS 'Payment gateway reference number';
COMMENT ON COLUMN donations.is_anonymous IS 'Whether the donation was made anonymously';
COMMENT ON COLUMN payout_requests.bank_account IS 'JSON containing bank account details';

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_transactions_user_type_status ON transactions(user_id, type, status);
CREATE INDEX idx_donations_recipient_created ON donations(recipient_id, created_at);
CREATE INDEX idx_payout_requests_user_status ON payout_requests(user_id, status);
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, is_read, created_at);

-- ===============================================
-- FINAL NOTES
-- ===============================================

-- 1. Remember to create the storage buckets in Supabase Dashboard
-- 2. Update the RLS policies based on your authentication system
-- 3. Insert your own super admin user with proper password hashing
-- 4. Configure the site_config values with your actual settings
-- 5. Set up scheduled jobs to run cleanup functions periodically
-- 6. Consider adding more indexes based on your query patterns
-- 7. Set up database backups and monitoring
-- 8. Review and adjust the decimal precision for financial amounts based on your requirements