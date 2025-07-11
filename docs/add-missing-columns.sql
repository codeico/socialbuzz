-- ===============================================
-- Add Missing Columns to Users Table
-- ===============================================

-- Add password_hash column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add last_login column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Make sure password_hash is NOT NULL for existing users
-- (You might need to set a default value or handle this differently)
-- ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

-- Add any other missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_donations DECIMAL(15,2) DEFAULT 0.00;

-- Update existing users to have default values
UPDATE users SET 
    balance = COALESCE(balance, 0.00),
    total_earnings = COALESCE(total_earnings, 0.00),
    total_donations = COALESCE(total_donations, 0.00)
WHERE balance IS NULL OR total_earnings IS NULL OR total_donations IS NULL;

-- ===============================================
-- Check if all required columns exist
-- ===============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;