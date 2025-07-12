# 🔧 Troubleshooting Guide

## Error: "new row violates row-level security policy"

Jika Anda mendapatkan error ini saat mendaftar atau login:

```
User creation error: {
  code: '42501',
  details: null,
  hint: null,
  message: 'new row violates row-level security policy for table "users"'
}
```

### Solusi:

1. **Buka Supabase Dashboard** Anda
2. **Masuk ke SQL Editor**
3. **Jalankan query berikut** untuk memperbaiki RLS policies:

```sql
-- Disable RLS untuk development/testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads DISABLE ROW LEVEL SECURITY;
```

4. **Atau jalankan file SQL** yang sudah disediakan:
   - `docs/fix-rls-policies.sql` - Untuk memperbaiki RLS policies
   - `docs/add-missing-columns.sql` - Untuk menambahkan kolom yang hilang

### Langkah-langkah Detail:

#### 1. Pastikan Tabel Users Memiliki Kolom yang Diperlukan

```sql
-- Check kolom yang ada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

#### 2. Tambahkan Kolom yang Hilang (jika diperlukan)

```sql
-- Add missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_donations DECIMAL(15,2) DEFAULT 0.00;
```

#### 3. Disable RLS untuk Testing

```sql
-- Disable RLS untuk semua tabel
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
-- ... dst
```

#### 4. Verifikasi Environment Variables

Pastikan `.env.local` Anda memiliki:

```env
# Database - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Payment Gateway - Duitku
DUITKU_MERCHANT_CODE=your-merchant-code
DUITKU_API_KEY=your-api-key
```

## Error: "Database connection failed"

### Solusi:

1. Periksa URL Supabase Anda
2. Pastikan Service Role Key benar
3. Pastikan project Supabase aktif

## Error: "JWT secret not found"

### Solusi:

1. Pastikan `JWT_SECRET` ada di `.env.local`
2. JWT_SECRET harus minimal 32 karakter
3. Generate secret baru:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Error: "Payment gateway error"

### Solusi:

1. Periksa `DUITKU_MERCHANT_CODE` dan `DUITKU_API_KEY`
2. Pastikan menggunakan sandbox URL untuk testing
3. Periksa callback URL configuration

## Error: "File upload failed"

### Solusi:

1. Buat Storage Buckets di Supabase:
   - `avatars` (public: true)
   - `uploads` (public: true)
   - `assets` (public: true)

2. Set Storage Policies:

```sql
-- Allow public access for avatars
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## Development vs Production

### Development (Current Setup):

- RLS disabled untuk kemudahan testing
- Semua policies permissive
- Sandbox payment gateway

### Production (Recommended):

- Enable RLS dengan proper policies
- Implement proper authentication
- Use production payment gateway URLs
- Add rate limiting
- Enable HTTPS only

## Quick Commands

### Reset Database:

```sql
-- Hapus semua data (HATI-HATI!)
TRUNCATE users, user_profiles, transactions, donations, payout_requests, password_reset_tokens, notifications, file_uploads CASCADE;
```

### Create Test User:

```sql
-- Buat user untuk testing
INSERT INTO users (email, username, full_name, password_hash, role, is_verified)
VALUES ('test@example.com', 'testuser', 'Test User', '$2b$12$...', 'user', true);
```

### Check Recent Errors:

```sql
-- Lihat log errors (jika ada)
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

## Getting Help

Jika masih ada masalah:

1. Cek Supabase Dashboard → Logs
2. Periksa browser console untuk error
3. Cek network tab di browser developer tools
4. Pastikan semua dependencies ter-install dengan benar

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Logs untuk Debug

Tambahkan logging untuk debug:

```typescript
// Di API routes
console.log('Request body:', body);
console.log('Database response:', { data, error });
```

```bash
# Lihat logs Next.js
npm run dev
# Cek terminal untuk error messages
```
