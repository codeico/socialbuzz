# 🌐 Panduan Instalasi SocialBuzz di Shared Hosting Domainesia

## 📋 Daftar Isi

- [Overview Shared Hosting](#overview-shared-hosting)
- [Persyaratan Hosting](#persyaratan-hosting)
- [Persiapan & Setup Database](#persiapan--setup-database)
- [Upload & Konfigurasi Files](#upload--konfigurasi-files)
- [Deployment Strategy](#deployment-strategy)
- [Optimisasi untuk Shared Hosting](#optimisasi-untuk-shared-hosting)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## ⚠️ Penting: Keterbatasan Shared Hosting

### 🚫 Fitur yang Tidak Didukung di Shared Hosting
- **Real-time WebSocket**: Live streaming dan chat real-time
- **Background Jobs**: Automated tasks dan cron jobs kompleks
- **Server-Side Rendering**: Dynamic SSR dengan database queries
- **File System Access**: Limited write permissions
- **Process Management**: PM2, forever, atau process managers lainnya
- **Custom Server**: Node.js server dengan express/socket.io

### ✅ Solusi Alternatif
Untuk mendapatkan fitur lengkap SocialBuzz, disarankan menggunakan:
- **VPS Hosting** (Lihat: [INSTALASI_VPS.md](./INSTALASI_VPS.md))
- **Cloud Hosting** (AWS, Google Cloud, DigitalOcean)
- **Vercel/Netlify** untuk frontend + Supabase untuk backend

---

## 🏠 Overview Shared Hosting

### 📦 Paket Hosting Domainesia yang Cocok

#### 🥇 Paket Signature (Recommended)
```
CPU: 1 Core
RAM: 1 GB
Storage: 20 GB NVMe
Database: MySQL 5GB
Node.js: ✅ Support
SSL: Free
Price: ~Rp 149,000/tahun
```

#### 🥈 Paket Hunter
```
CPU: 1 Core
RAM: 2 GB
Storage: 40 GB NVMe
Database: MySQL 10GB
Node.js: ✅ Support
SSL: Free
Price: ~Rp 299,000/tahun
```

### 🔧 Teknologi yang Didukung
- **Node.js**: Version 16.x, 18.x
- **Database**: MySQL 5.7/8.0
- **SSL**: Let's Encrypt (Free)
- **Storage**: NVMe SSD
- **PHP**: 7.4, 8.0, 8.1 (jika diperlukan)

---

## 📋 Persyaratan Hosting

### 1. 🛒 Pembelian Hosting

```
1. Kunjungi: https://www.domainesia.com
2. Pilih paket "Signature" atau "Hunter"
3. Pilih domain atau gunakan domain existing
4. Checkout dan aktivasi hosting
5. Akses cPanel melalui email yang diterima
```

### 2. 🔧 Aktifkan Node.js

```
1. Login ke cPanel
2. Cari "Node.js App" atau "Setup Node.js App"
3. Klik "Create Application"
4. Pilih Node.js version 18.x
5. Set Application Root: public_html/socialbuzz
6. Set Application URL: yourdomain.com
7. Klik "Create"
```

### 3. 🗄️ Setup Database MySQL

```
1. Di cPanel, cari "MySQL Databases"
2. Create Database: "socialbuzz_db"
3. Create User: "socialbuzz_user"
4. Set Password: [strong password]
5. Add User to Database dengan ALL PRIVILEGES
6. Catat detail koneksi database
```

---

## 🗃️ Persiapan & Setup Database

### 1. 📥 Konversi Schema PostgreSQL ke MySQL

Karena Domainesia menggunakan MySQL, kita perlu mengkonversi schema:

```sql
-- create_mysql_schema.sql
-- SocialBuzz MySQL Schema untuk Shared Hosting

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS payout_requests;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;
SET foreign_key_checks = 1;

-- Users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar TEXT,
    role ENUM('user', 'creator', 'admin', 'super_admin') DEFAULT 'user',
    status ENUM('active', 'suspended', 'banned', 'pending') DEFAULT 'active',
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    total_supporters INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE user_profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    birth_date DATE,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'id',
    social_links JSON,
    preferences JSON,
    bank_details JSON,
    kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    kyc_documents JSON,
    donation_goal DECIMAL(15,2),
    donation_message TEXT,
    featured_content JSON,
    tags JSON,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    recipient_id CHAR(36),
    type ENUM('donation', 'payout', 'fee', 'refund', 'bonus') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    external_transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    description TEXT,
    message TEXT,
    metadata JSON,
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2),
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Payout requests table
CREATE TABLE payout_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status ENUM('pending', 'processing', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    bank_details JSON NOT NULL,
    admin_notes TEXT,
    processing_fee DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2),
    processed_by CHAR(36),
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE system_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_setting (category, setting_key)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Insert system settings
INSERT INTO system_settings (category, setting_key, setting_value, data_type, description, is_public) VALUES
('platform', 'name', 'SocialBuzz', 'string', 'Platform name', 1),
('platform', 'version', '1.0.0', 'string', 'Platform version', 1),
('payment', 'minimum_donation', '5000', 'number', 'Minimum donation amount in IDR', 1),
('payment', 'maximum_donation', '10000000', 'number', 'Maximum donation amount in IDR', 1),
('payment', 'platform_fee_percentage', '5', 'number', 'Platform fee percentage', 0);

-- Insert sample admin user (password: admin123)
INSERT INTO users (id, email, username, password_hash, full_name, role, status, is_verified, email_verified) VALUES
('admin-uuid-1234-5678-9012', 'admin@yourdomain.com', 'admin', '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O', 'Administrator', 'super_admin', 'active', 1, 1);
```

### 2. 📤 Import Database Schema

```
1. Di cPanel, cari "phpMyAdmin"
2. Login dengan kredensial database
3. Pilih database "socialbuzz_db"
4. Klik tab "Import"
5. Upload file "create_mysql_schema.sql"
6. Klik "Go" untuk execute
```

---

## 📁 Upload & Konfigurasi Files

### 1. 🏗️ Build Static Version

Karena shared hosting tidak mendukung server-side rendering penuh, kita perlu build static version:

```bash
# Di local development environment
# Edit next.config.js untuk static export
```

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable server-side features
  experimental: {
    serverActions: false,
  }
}

module.exports = nextConfig
```

```bash
# Build static version
npm run build

# Files akan ada di folder "out/"
```

### 2. 📋 Konfigurasi Environment untuk Shared Hosting

Buat file `.env.production`:

```env
# Shared Hosting Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=socialbuzz_db
DB_USER=socialbuzz_user
DB_PASSWORD=your_mysql_password

# JWT Secret
JWT_SECRET=your_very_long_jwt_secret_key_minimum_32_characters

# Payment Gateway - Duitku
DUITKU_MERCHANT_CODE=your_merchant_code
DUITKU_API_KEY=your_api_key
DUITKU_SANDBOX_MODE=false

# File Upload (using hosting storage)
UPLOAD_PATH=/home/yourusername/public_html/uploads
MAX_UPLOAD_SIZE=10485760  # 10MB (sesuai limit hosting)

# Email (menggunakan hosting email)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_email_password

# Disable real-time features
ENABLE_WEBSOCKET=false
ENABLE_LIVE_STREAMING=false
```

### 3. 📤 Upload Files via File Manager

```
1. Di cPanel, buka "File Manager"
2. Navigate ke public_html/
3. Create folder "socialbuzz"
4. Upload semua files dari "out/" folder
5. Upload files API ke "api/" folder
6. Set permissions 755 untuk folders, 644 untuk files
```

### 4. 🔧 Konfigurasi .htaccess

Buat file `.htaccess` di public_html/socialbuzz/:

```apache
# .htaccess for SocialBuzz on Shared Hosting

RewriteEngine On

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# API routes
RewriteRule ^api/(.*)$ api/$1 [QSA,L]

# Next.js static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Protect sensitive files
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
```

---

## 🚀 Deployment Strategy

### 1. 📝 Simplified API Structure

Karena keterbatasan shared hosting, buat API sederhana dengan PHP:

```php
<?php
// api/auth/login.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once '../config/database.php';
require_once '../utils/jwt.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE email = ? AND status = 'active'");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $token = generateJWT([
            'userId' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ]);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>
```

### 2. 🔧 Database Configuration (PHP)

```php
<?php
// api/config/database.php
$host = 'localhost';
$dbname = 'socialbuzz_db';
$username = 'socialbuzz_user';
$password = 'your_mysql_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
?>
```

### 3. 🔑 JWT Utility (PHP)

```php
<?php
// api/utils/jwt.php
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['exp'] = time() + (24 * 60 * 60); // 24 hours
    $payload = json_encode($payload);
    
    $headerEncoded = base64UrlEncode($header);
    $payloadEncoded = base64UrlEncode($payload);
    
    $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $_ENV['JWT_SECRET'], true);
    $signatureEncoded = base64UrlEncode($signature);
    
    return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    
    $expectedSignature = hash_hmac('sha256', $header . "." . $payload, $_ENV['JWT_SECRET'], true);
    $expectedSignatureEncoded = base64UrlEncode($expectedSignature);
    
    if ($signature !== $expectedSignatureEncoded) {
        return false;
    }
    
    $payloadData = json_decode(base64UrlDecode($payload), true);
    
    if ($payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}
?>
```

---

## ⚡ Optimisasi untuk Shared Hosting

### 1. 🔄 Frontend Optimizations

```javascript
// Optimize for shared hosting
// utils/api.js - Simplified API client
class ApiClient {
  constructor() {
    this.baseURL = 'https://yourdomain.com/api';
    this.token = localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/${endpoint}.php`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      this.token = response.token;
    }
    
    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    this.token = null;
  }

  // User methods
  async getProfile() {
    return await this.request('users/profile', {
      method: 'GET',
    });
  }

  // Transaction methods
  async createDonation(data) {
    return await this.request('payments/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
```

### 2. 📱 Progressive Enhancement

```javascript
// components/ProgressiveFeatures.js
import { useState, useEffect } from 'react';

export function useProgressiveFeatures() {
  const [features, setFeatures] = useState({
    realTime: false,
    fileUpload: true,
    notifications: false,
    liveStreaming: false,
  });

  useEffect(() => {
    // Check if we're on shared hosting
    const isSharedHosting = !window.WebSocket || !window.RTCPeerConnection;
    
    setFeatures({
      realTime: !isSharedHosting,
      fileUpload: true,
      notifications: 'Notification' in window,
      liveStreaming: !isSharedHosting && 'MediaRecorder' in window,
    });
  }, []);

  return features;
}

// Usage in components
export function DonationForm() {
  const features = useProgressiveFeatures();
  
  return (
    <div>
      {features.realTime ? (
        <RealTimeDonationAlert />
      ) : (
        <StaticDonationForm />
      )}
    </div>
  );
}
```

### 3. 💾 Local Storage Management

```javascript
// utils/storage.js
class StorageManager {
  constructor() {
    this.prefix = 'socialbuzz_';
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }

  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }

  // Cache API responses
  cacheResponse(key, data, ttl = 300000) { // 5 minutes default
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    this.set(`cache_${key}`, cacheData);
  }

  getCachedResponse(key) {
    const cached = this.get(`cache_${key}`);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.remove(`cache_${key}`);
      return null;
    }

    return cached.data;
  }
}

export const storage = new StorageManager();
```

---

## 📊 Monitoring & Maintenance

### 1. 🔍 Error Tracking for Shared Hosting

```php
<?php
// api/utils/logger.php
class Logger {
    private $logFile;
    
    public function __construct() {
        $this->logFile = __DIR__ . '/../logs/app.log';
        
        // Create logs directory if not exists
        $logDir = dirname($this->logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
    }
    
    public function log($level, $message, $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? json_encode($context) : '';
        $logEntry = "[$timestamp] $level: $message $contextStr" . PHP_EOL;
        
        file_put_contents($this->logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    public function error($message, $context = []) {
        $this->log('ERROR', $message, $context);
    }
    
    public function info($message, $context = []) {
        $this->log('INFO', $message, $context);
    }
    
    public function warning($message, $context = []) {
        $this->log('WARNING', $message, $context);
    }
}

// Global logger instance
$logger = new Logger();
?>
```

### 2. 📈 Simple Analytics

```javascript
// utils/analytics.js
class SimpleAnalytics {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  track(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.events.push(event);
    
    // Send to server (batch every 10 events or 30 seconds)
    if (this.events.length >= 10) {
      this.sendBatch();
    } else {
      this.scheduleBatch();
    }
  }

  async sendBatch() {
    if (this.events.length === 0) return;

    try {
      await fetch('/api/analytics/track.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: this.events }),
      });
      
      this.events = [];
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  scheduleBatch() {
    if (this.batchTimeout) return;
    
    this.batchTimeout = setTimeout(() => {
      this.sendBatch();
      this.batchTimeout = null;
    }, 30000);
  }
}

export const analytics = new SimpleAnalytics();
```

### 3. 🔄 Health Check

```php
<?php
// api/health/check.php
header('Content-Type: application/json');

$health = [
    'status' => 'ok',
    'timestamp' => date('c'),
    'checks' => []
];

// Database check
try {
    require_once '../config/database.php';
    $stmt = $pdo->query('SELECT 1');
    $health['checks']['database'] = 'ok';
} catch (Exception $e) {
    $health['checks']['database'] = 'error';
    $health['status'] = 'error';
}

// Disk space check
$freeBytes = disk_free_space('.');
$totalBytes = disk_total_space('.');
$usedPercent = (($totalBytes - $freeBytes) / $totalBytes) * 100;

$health['checks']['disk_space'] = [
    'status' => $usedPercent > 90 ? 'warning' : 'ok',
    'used_percent' => round($usedPercent, 2)
];

// Memory check
$memoryUsage = memory_get_usage(true);
$memoryLimit = ini_get('memory_limit');
$health['checks']['memory'] = [
    'status' => 'ok',
    'usage_mb' => round($memoryUsage / 1024 / 1024, 2)
];

http_response_code($health['status'] === 'ok' ? 200 : 503);
echo json_encode($health, JSON_PRETTY_PRINT);
?>
```

---

## 🚨 Troubleshooting

### 1. 🐛 Common Issues

#### **Issue: "Internal Server Error"**
```bash
Solusi:
1. Check .htaccess syntax
2. Verify file permissions (755 untuk folder, 644 untuk file)
3. Check PHP error logs di cPanel
4. Pastikan semua required extensions aktif
```

#### **Issue: Database Connection Failed**
```bash
Solusi:
1. Verify database credentials di .env
2. Check database user privileges
3. Ensure database server is running
4. Test connection dengan phpMyAdmin
```

#### **Issue: File Upload Not Working**
```bash
Solusi:
1. Check upload directory permissions
2. Verify file size limits (hosting + PHP)
3. Check allowed file types
4. Ensure temp directory is writable
```

### 2. 🔧 Performance Issues

#### **Slow Page Loading**
```bash
Optimizations:
1. Enable Gzip compression di .htaccess
2. Optimize images (compress, WebP format)
3. Minify CSS/JS files
4. Use browser caching headers
5. Optimize database queries
```

#### **Memory Limit Exceeded**
```bash
Solusi:
1. Request memory limit increase dari hosting
2. Optimize PHP code untuk memory usage
3. Use pagination untuk large datasets
4. Implement proper error handling
```

### 3. 📱 Browser Compatibility

```javascript
// utils/compatibility.js
export function checkBrowserSupport() {
  const support = {
    localStorage: typeof Storage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    webSocket: typeof WebSocket !== 'undefined',
    notification: 'Notification' in window,
    fileReader: typeof FileReader !== 'undefined',
  };

  // Polyfills for older browsers
  if (!support.fetch) {
    // Load fetch polyfill
    loadScript('https://polyfill.io/v3/polyfill.min.js?features=fetch');
  }

  return support;
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

---

## 📋 Post-Deployment Checklist

### ✅ Functionality Checklist
- [ ] Website accessible via domain
- [ ] SSL certificate active
- [ ] User registration working
- [ ] Login/logout working
- [ ] Database operations working
- [ ] Payment gateway working (test mode)
- [ ] File upload working
- [ ] Email notifications working
- [ ] Admin panel accessible
- [ ] Basic analytics tracking

### ✅ Performance Checklist
- [ ] Page load time < 3 seconds
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] Database queries optimized
- [ ] Error handling implemented

### ✅ Security Checklist
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] Sensitive files protected
- [ ] Strong passwords enforced
- [ ] Rate limiting configured

---

## 🔮 Upgrade Path

### 🚀 From Shared Hosting to VPS

Ketika traffic meningkat, consider upgrade ke VPS:

```bash
# Migration steps:
1. Setup VPS environment
2. Export database dari shared hosting
3. Import ke VPS PostgreSQL
4. Update DNS records
5. Test functionality
6. Switch domain to VPS
```

### 📈 Performance Monitoring

```javascript
// Track when upgrade is needed
const performanceMetrics = {
  pageLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
  dbQueryTime: /* track via API timing */,
  errorRate: /* track via error logging */,
  concurrent_users: /* track via analytics */
};

// Alert when metrics exceed thresholds
if (performanceMetrics.pageLoadTime > 5000) {
  console.warn('Consider VPS upgrade - slow page loads');
}
```

---

## 📚 Additional Resources

### 🔗 Domainesia Documentation
- [Node.js Setup Guide](https://www.domainesia.com/panduan-nodejs/)
- [MySQL Database Management](https://www.domainesia.com/panduan-mysql/)
- [SSL Certificate Setup](https://www.domainesia.com/panduan-ssl/)

### 🛠️ Useful Tools
- **phpMyAdmin**: Database management
- **File Manager**: File operations
- **Error Logs**: Debugging issues
- **Cloudflare**: CDN dan security (free tier)

---

⚠️ **Disclaimer**: Shared hosting memiliki keterbatasan yang signifikan. Untuk fitur lengkap SocialBuzz, strongly recommended menggunakan VPS atau cloud hosting.