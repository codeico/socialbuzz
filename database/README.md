# SocialBuzz Database Schema

Complete database schema dengan mock data untuk aplikasi SocialBuzz - Platform donasi creator.

## 📊 Database Overview

### Tables Structure
- **users** - Data pengguna (admin, creator, user)
- **user_profiles** - Profil detail pengguna
- **transactions** - Semua transaksi (donasi, payout, fee)
- **payout_requests** - Permintaan pencairan dana
- **transaction_fees** - Detail biaya transaksi
- **notifications** - Sistem notifikasi
- **notification_settings** - Pengaturan notifikasi pengguna
- **system_settings** - Konfigurasi sistem

### Features Included
✅ **Row Level Security (RLS)** - Keamanan data tingkat baris  
✅ **Triggers** - Auto-update timestamps  
✅ **Indexes** - Optimasi performa query  
✅ **Functions** - Helper functions untuk statistik  
✅ **Views** - Query views untuk data umum  
✅ **Mock Data** - Data sample lengkap untuk testing  

## 🚀 Quick Setup

### 1. Jalankan Schema
```sql
-- Import schema lengkap
\i complete_socialbuzz_schema.sql
```

### 2. Verifikasi Installation
```sql
-- Cek total data
SELECT 'Users' as table_name, COUNT(*) as total FROM users
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
```

## 👥 Default Accounts

### Super Admin
- **Email**: admin@socialbuzz.com
- **Username**: admin
- **Password**: admin123
- **Role**: super_admin

### Regular Admin
- **Email**: moderator@socialbuzz.com
- **Username**: moderator
- **Password**: admin123
- **Role**: admin

### Creator Accounts (Password: password123)
1. **Gaming Pro** - gamingpro@socialbuzz.com
2. **Music Star** - musicstar@socialbuzz.com
3. **Digital Artist** - artcreator@socialbuzz.com
4. **Tech Reviewer** - techreview@socialbuzz.com
5. **Cooking Chef** - cookingchef@socialbuzz.com

### User Accounts (Password: user123)
1. **Ahmad Wijaya** - supporter1@gmail.com
2. **Siti Nurhaliza** - supporter2@gmail.com
3. **Budi Santoso** - supporter3@gmail.com
4. **Rina Melati** - supporter4@gmail.com
5. **Dedi Kurniawan** - supporter5@gmail.com

## 💰 Sample Financial Data

### Total Platform Statistics
- **Total Users**: 15 accounts
- **Active Creators**: 5 creators
- **Total Donations**: ~Rp 1,000,000
- **Platform Revenue**: ~Rp 50,000 (5% fee)
- **Completed Payouts**: Rp 800,000

### Creator Earnings
1. **Gaming Pro**: Rp 5,870,000 total earnings
2. **Music Star**: Rp 4,230,000 total earnings
3. **Tech Reviewer**: Rp 3,120,000 total earnings
4. **Digital Artist**: Rp 2,180,000 total earnings
5. **Cooking Chef**: Rp 1,890,000 total earnings

## 🔧 Useful Queries

### Get Creator Statistics
```sql
SELECT * FROM creator_stats ORDER BY total_earnings DESC;
```

### Daily Transaction Summary
```sql
SELECT * FROM transaction_summary LIMIT 30;
```

### User Transaction History
```sql
SELECT 
    t.*,
    sender.username as sender_name,
    recipient.username as recipient_name
FROM transactions t
LEFT JOIN users sender ON t.user_id = sender.id
LEFT JOIN users recipient ON t.recipient_id = recipient.id
WHERE t.user_id = 'USER_ID' OR t.recipient_id = 'USER_ID'
ORDER BY t.created_at DESC;
```

### Platform Revenue Report
```sql
SELECT 
    DATE_TRUNC('month', created_at) as month,
    SUM(fee_amount) as revenue,
    COUNT(*) as transaction_count
FROM transactions 
WHERE status = 'completed' 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### Top Creators by Donations
```sql
SELECT 
    u.username,
    u.full_name,
    COUNT(t.id) as donation_count,
    SUM(t.amount) as total_received,
    AVG(t.amount) as avg_donation
FROM users u
JOIN transactions t ON u.id = t.recipient_id
WHERE t.type = 'donation' AND t.status = 'completed'
GROUP BY u.id, u.username, u.full_name
ORDER BY total_received DESC;
```

### Recent Activity Feed
```sql
SELECT 
    t.created_at,
    t.type,
    t.amount,
    sender.username as from_user,
    recipient.username as to_user,
    t.message
FROM transactions t
LEFT JOIN users sender ON t.user_id = sender.id
LEFT JOIN users recipient ON t.recipient_id = recipient.id
WHERE t.status = 'completed'
ORDER BY t.created_at DESC
LIMIT 20;
```

## 🔐 Security Features

### Row Level Security Policies
- Users dapat melihat profil mereka sendiri
- Creator profiles dapat dilihat publik
- Transaksi hanya dapat dilihat oleh pihak terkait
- Notifikasi hanya dapat dilihat oleh pemilik

### Data Protection
- Password di-hash dengan bcrypt
- Sensitive data (API keys) tidak disimpan di plain text
- Admin logs untuk tracking perubahan penting

## 📈 Performance Optimizations

### Indexes Created
- Email, username lookups (users)
- Transaction queries (by user, date, status)
- Notification queries (by user, read status)
- System settings lookups

### Query Optimization
- Views untuk queries yang sering digunakan
- Functions untuk kalkulasi kompleks
- Proper JOIN strategies

## 🔄 Maintenance

### Regular Tasks
```sql
-- Update user statistics
UPDATE users SET total_supporters = (
    SELECT COUNT(DISTINCT user_id) FROM transactions 
    WHERE recipient_id = users.id AND type = 'donation' AND status = 'completed'
) WHERE role = 'creator';

-- Clean old notifications (older than 90 days)
DELETE FROM notifications 
WHERE created_at < CURRENT_DATE - INTERVAL '90 days' AND is_read = true;

-- Archive old transactions (optional)
-- CREATE TABLE transactions_archive AS 
-- SELECT * FROM transactions WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
```

### Backup Strategy
```bash
# Daily backup
pg_dump socialbuzz > "backup_$(date +%Y%m%d).sql"

# Restore from backup
psql socialbuzz < backup_20240101.sql
```

## 🚨 Troubleshooting

### Common Issues

**1. RLS Permission Denied**
```sql
-- Temporarily disable RLS for admin operations
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
-- Perform admin operations
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**2. Invalid Password Hash**
```sql
-- Regenerate password hash
UPDATE users SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email = 'user@example.com';
```

**3. Transaction Balance Mismatch**
```sql
-- Recalculate user balances
UPDATE users SET 
    balance = COALESCE(total_received.amount, 0) - COALESCE(total_spent.amount, 0)
FROM (
    SELECT recipient_id, SUM(net_amount) as amount 
    FROM transactions 
    WHERE type = 'donation' AND status = 'completed' 
    GROUP BY recipient_id
) total_received
LEFT JOIN (
    SELECT user_id, SUM(amount) as amount 
    FROM transactions 
    WHERE type = 'payout' AND status = 'completed' 
    GROUP BY user_id
) total_spent ON total_received.recipient_id = total_spent.user_id
WHERE users.id = total_received.recipient_id;
```

---

## 📞 Support

Jika ada masalah dengan database setup:
1. Cek log error di PostgreSQL
2. Verifikasi semua tables sudah dibuat
3. Test login dengan default accounts
4. Periksa RLS policies jika ada permission error

**Happy Coding! 🚀**