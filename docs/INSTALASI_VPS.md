# 🚀 Panduan Instalasi SocialBuzz di VPS

## 📋 Daftar Isi

- [Persyaratan Server](#persyaratan-server)
- [Persiapan Server](#persiapan-server)
- [Instalasi Dependencies](#instalasi-dependencies)
- [Setup Database](#setup-database)
- [Konfigurasi Aplikasi](#konfigurasi-aplikasi)
- [Deployment & SSL](#deployment--ssl)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## 💻 Persyaratan Server

### 🔧 Spesifikasi Minimum
```
CPU: 2 vCPU
RAM: 4 GB
Storage: 50 GB SSD
Bandwidth: 100 Mbps
OS: Ubuntu 20.04 LTS / Ubuntu 22.04 LTS
```

### 🚀 Spesifikasi Direkomendasikan
```
CPU: 4 vCPU
RAM: 8 GB
Storage: 100 GB SSD
Bandwidth: 1 Gbps
OS: Ubuntu 22.04 LTS
```

### 🌍 Provider VPS Terpercaya
- **DigitalOcean**: $20-40/bulan
- **AWS EC2**: $25-50/bulan
- **Google Cloud**: $20-45/bulan
- **Vultr**: $15-35/bulan
- **Linode**: $20-40/bulan
- **Contabo**: $10-25/bulan (Budget option)

---

## 🛠️ Persiapan Server

### 1. 🔐 Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Create non-root user
sudo adduser socialbuzz
sudo usermod -aG sudo socialbuzz

# Setup SSH key authentication (optional but recommended)
ssh-copy-id socialbuzz@your-server-ip

# Disable root login dan password authentication
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 2. 🔥 Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Next.js development (temporary)

# Check status
sudo ufw status
```

### 3. 🕒 Setup Timezone

```bash
# Set timezone to Indonesia
sudo timedatectl set-timezone Asia/Jakarta

# Verify
timedatectl status
```

---

## 📦 Instalasi Dependencies

### 1. 🟢 Install Node.js 18+

```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. 🐘 Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start dan enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database dan user
sudo -u postgres psql

-- In PostgreSQL prompt:
CREATE DATABASE socialbuzz;
CREATE USER socialbuzz_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE socialbuzz TO socialbuzz_user;
\q
```

### 3. 🔴 Install Redis (Optional - untuk caching)

```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf
# Uncomment: requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

### 4. 🌐 Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start dan enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Test Nginx
curl http://your-server-ip
```

---

## 🗄️ Setup Database

### 1. 📥 Import Database Schema

```bash
# Upload schema file to server
scp database/complete_socialbuzz_enhanced_schema.sql socialbuzz@your-server-ip:~/

# Connect to server dan import
ssh socialbuzz@your-server-ip

# Import schema
psql -h localhost -U socialbuzz_user -d socialbuzz -f complete_socialbuzz_enhanced_schema.sql
```

### 2. 🔧 Configure Database Connection

```bash
# Test database connection
psql -h localhost -U socialbuzz_user -d socialbuzz -c "SELECT version();"
```

### 3. 🛡️ Database Security

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: listen_addresses = 'localhost'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ensure local connections use md5 authentication

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## ⚙️ Konfigurasi Aplikasi

### 1. 📂 Clone Repository

```bash
# Clone repository
git clone https://github.com/your-username/socialbuzz-clone.git
cd socialbuzz-clone

# Install dependencies
npm install
```

### 2. 🔐 Environment Configuration

```bash
# Create production environment file
cp .env.example .env.production

# Edit environment variables
nano .env.production
```

```env
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database Configuration
DATABASE_URL=postgresql://socialbuzz_user:your_strong_password@localhost:5432/socialbuzz

# JWT Secret (generate strong 32+ character secret)
JWT_SECRET=your_very_long_and_secure_jwt_secret_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment Gateway - Duitku
DUITKU_MERCHANT_CODE=your-merchant-code
DUITKU_API_KEY=your-api-key
DUITKU_SANDBOX_MODE=false

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis Configuration (if using)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# File Upload Configuration
MAX_UPLOAD_SIZE=104857600  # 100MB
UPLOAD_PATH=/var/www/uploads

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes
```

### 3. 🏗️ Build Application

```bash
# Build production application
npm run build

# Test the build
npm run start
```

### 4. 📁 File Upload Directory

```bash
# Create upload directory
sudo mkdir -p /var/www/uploads
sudo chown -R socialbuzz:socialbuzz /var/www/uploads
sudo chmod 755 /var/www/uploads
```

---

## 🚀 Deployment & SSL

### 1. 🔄 PM2 Process Management

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'socialbuzz',
      script: 'npm',
      args: 'start',
      cwd: '/home/socialbuzz/socialbuzz-clone',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '60s'
    }
  ]
};
```

```bash
# Create logs directory
mkdir logs

# Start application dengan PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
# Follow the instructions provided by the command

# Check application status
pm2 status
pm2 logs socialbuzz
```

### 2. 🌐 Nginx Configuration

```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/socialbuzz
```

```nginx
# /etc/nginx/sites-available/socialbuzz
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files
    location /_next/static {
        alias /home/socialbuzz/socialbuzz-clone/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads {
        alias /var/www/uploads;
        expires 1M;
        add_header Cache-Control "public";
    }

    # API rate limiting
    location /api/v1/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Client max body size for file uploads
        client_max_body_size 100M;
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/socialbuzz /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3. 🔒 SSL Certificate dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Setup automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring & Maintenance

### 1. 📈 Setup Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Setup log rotation
sudo nano /etc/logrotate.d/socialbuzz
```

```
/home/socialbuzz/socialbuzz-clone/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 socialbuzz socialbuzz
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. 🔄 Backup Strategy

```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
# SocialBuzz Backup Script

BACKUP_DIR="/home/socialbuzz/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="socialbuzz"
DB_USER="socialbuzz_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application backup (excluding node_modules)
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='logs' \
    /home/socialbuzz/socialbuzz-clone

# Upload files backup
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/uploads

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make script executable
chmod +x ~/backup.sh

# Setup daily backup cron
crontab -e
# Add: 0 2 * * * /home/socialbuzz/backup.sh >> /home/socialbuzz/backup.log 2>&1
```

### 3. 🔍 Health Monitoring

```bash
# Create health check script
nano ~/health-check.sh
```

```bash
#!/bin/bash
# Health check script

# Check if application is running
if ! pm2 describe socialbuzz > /dev/null 2>&1; then
    echo "$(date): SocialBuzz app is down, restarting..." >> ~/health.log
    pm2 restart socialbuzz
fi

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    echo "$(date): PostgreSQL is down, restarting..." >> ~/health.log
    sudo systemctl restart postgresql
fi

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "$(date): Nginx is down, restarting..." >> ~/health.log
    sudo systemctl restart nginx
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "$(date): Disk usage is $DISK_USAGE%, cleanup needed" >> ~/health.log
fi
```

```bash
# Make executable dan setup cron
chmod +x ~/health-check.sh
crontab -e
# Add: */5 * * * * /home/socialbuzz/health-check.sh
```

### 4. 📊 Performance Monitoring

```bash
# Install system monitoring
sudo apt install netdata -y

# Start Netdata
sudo systemctl start netdata
sudo systemctl enable netdata

# Access monitoring dashboard at: http://your-server-ip:19999
```

---

## 🔄 Update & Maintenance

### 1. 📥 Application Updates

```bash
# Create update script
nano ~/update.sh
```

```bash
#!/bin/bash
# SocialBuzz Update Script

APP_DIR="/home/socialbuzz/socialbuzz-clone"
BACKUP_DIR="/home/socialbuzz/backups"
DATE=$(date +%Y%m%d_%H%M%S)

cd $APP_DIR

# Create backup before update
echo "Creating backup..."
cp -r $APP_DIR $BACKUP_DIR/app_backup_before_update_$DATE

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Restart application
echo "Restarting application..."
pm2 restart socialbuzz

echo "Update completed successfully!"
```

### 2. 🔒 Security Updates

```bash
# Regular security updates
sudo apt update && sudo apt upgrade -y

# Update Node.js (when needed)
# Check current version: node --version
# Update using NodeSource repository

# Update npm packages
npm audit
npm audit fix
```

---

## 🚨 Troubleshooting

### 1. 🔍 Common Issues

#### Application Won't Start
```bash
# Check PM2 logs
pm2 logs socialbuzz

# Check if port is available
sudo netstat -tlnp | grep :3000

# Check environment variables
pm2 env 0
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U socialbuzz_user -d socialbuzz -c "SELECT 1;"

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

### 2. 🔧 Performance Issues

#### High Memory Usage
```bash
# Check memory usage
free -h
htop

# Restart PM2 cluster
pm2 restart socialbuzz

# Optimize PM2 configuration
# Reduce instances or set max_memory_restart
```

#### Slow Database Queries
```bash
# Enable slow query logging in PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: log_min_duration_statement = 1000  # Log queries > 1 second

# Analyze slow queries
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 3. 📞 Emergency Procedures

#### Complete System Recovery
```bash
# 1. Stop all services
pm2 stop all
sudo systemctl stop nginx
sudo systemctl stop postgresql

# 2. Restore from backup
cd /home/socialbuzz/backups
# Find latest backup
ls -la | grep backup

# 3. Restore database
gunzip db_backup_YYYYMMDD_HHMMSS.sql.gz
psql -h localhost -U socialbuzz_user -d socialbuzz < db_backup_YYYYMMDD_HHMMSS.sql

# 4. Restore application
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz -C /

# 5. Start services
sudo systemctl start postgresql
sudo systemctl start nginx
pm2 start ecosystem.config.js
```

---

## 📋 Post-Installation Checklist

### ✅ Security Checklist
- [ ] Non-root user created
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Strong passwords used
- [ ] Database secured
- [ ] Regular backups configured

### ✅ Performance Checklist
- [ ] Nginx gzip compression enabled
- [ ] Static file caching configured
- [ ] Database optimized
- [ ] PM2 cluster mode enabled
- [ ] Monitoring tools installed
- [ ] Log rotation configured
- [ ] Health checks setup
- [ ] Performance monitoring active

### ✅ Functionality Checklist
- [ ] Application accessible via HTTPS
- [ ] User registration working
- [ ] Login/logout working
- [ ] File upload working
- [ ] Payment gateway working
- [ ] Email notifications working
- [ ] Real-time features working
- [ ] Database operations working
- [ ] All API endpoints responding

---

## 📚 Additional Resources

### 📖 Documentation Links
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

### 🛠️ Useful Commands
```bash
# System monitoring
htop                    # Process monitor
iotop                   # I/O monitor
df -h                   # Disk usage
free -h                 # Memory usage
netstat -tlnp          # Network ports

# PM2 commands
pm2 status             # Check app status
pm2 restart all        # Restart all apps
pm2 logs               # View logs
pm2 monit              # Real-time monitoring

# Nginx commands
sudo nginx -t          # Test configuration
sudo nginx -s reload   # Reload configuration
sudo systemctl status nginx  # Check status

# PostgreSQL commands
sudo -u postgres psql  # Connect as postgres user
\l                     # List databases
\dt                    # List tables
\q                     # Quit
```

---

*Panduan ini mengasumsikan penggunaan Ubuntu 22.04 LTS. Untuk distribusi Linux lain, sesuaikan perintah package manager dan path konfigurasi.*