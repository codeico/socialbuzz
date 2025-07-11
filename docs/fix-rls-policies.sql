-- ===============================================
-- Fix RLS Policies untuk Registration & Login
-- ===============================================

-- Hapus semua policies yang ada untuk users table
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own donations" ON donations;
DROP POLICY IF EXISTS "Users can view own payout requests" ON payout_requests;
DROP POLICY IF EXISTS "Users can create own payout requests" ON payout_requests;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can create own file uploads" ON file_uploads;

-- Disable RLS temporarily untuk testing
-- Nanti bisa di-enable lagi setelah implement proper auth
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads DISABLE ROW LEVEL SECURITY;

-- Atau jika ingin tetap menggunakan RLS, buat policy yang membolehkan semua operasi
-- untuk development/testing (JANGAN DIGUNAKAN DI PRODUCTION!)

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON users FOR ALL USING (true);

-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON user_profiles FOR ALL USING (true);

-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON transactions FOR ALL USING (true);

-- ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON donations FOR ALL USING (true);

-- ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON payout_requests FOR ALL USING (true);

-- ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON password_reset_tokens FOR ALL USING (true);

-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON notifications FOR ALL USING (true);

-- ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON site_config FOR ALL USING (true);

-- ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for development" ON file_uploads FOR ALL USING (true);

-- ===============================================
-- CATATAN PENTING:
-- ===============================================
-- RLS di-disable untuk development/testing
-- Untuk production, Anda perlu:
-- 1. Enable RLS kembali
-- 2. Buat proper policies berdasarkan business logic
-- 3. Gunakan Supabase Auth untuk proper user authentication
-- 4. Implementasi proper JWT validation di policies
-- ===============================================