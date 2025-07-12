-- Fix password hashes for existing users
-- Run this if you already have users in database but login fails

-- Update admin user password hash (password: admin123)
UPDATE users 
SET password_hash = '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O' 
WHERE email = 'admin@socialbuzz.com';

-- Update creator user password hash (password: creator123)
UPDATE users 
SET password_hash = '$2a$10$mIdx6B8ygfEIligjKHQ0But/pKYnMQvZmwIAfQrgt/BVvtE4FBLl2' 
WHERE email = 'creator@socialbuzz.com';

-- Update regular user password hash (password: user123)
UPDATE users 
SET password_hash = '$2a$10$THTEU8.ZPCQwnY4lhO5OX.IePEI1g1FENu263SGjNPAA88jF2ad3e' 
WHERE email = 'user@socialbuzz.com';

-- Verify the updates
SELECT email, username, role, password_hash 
FROM users 
WHERE email IN ('admin@socialbuzz.com', 'creator@socialbuzz.com', 'user@socialbuzz.com');

-- Check if users exist
SELECT 
    email,
    username,
    role,
    is_verified,
    email_verified,
    created_at
FROM users 
ORDER BY created_at;