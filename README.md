# Biodaat - Wedding Biodata Generator

A production-ready SEO-friendly wedding biodata generator platform built with:
- **Frontend**: Static Next.js (exported HTML)
- **Backend**: Pure PHP REST API
- **Database**: MySQL
- **Payments**: Razorpay

## 🚀 Quick Start (Production Deployment)

### Prerequisites
- CyberPanel shared hosting with PHP 8.0+
- MySQL database
- Git installed on server

### Step 1: Clone Repository on Server

SSH into your server and navigate to your domain's public_html:

```bash
cd /home/yourdomain/public_html

# Clone the repository
git clone https://github.com/yourusername/biodaat.git .

# Or if you want it in a subdirectory:
git clone https://github.com/yourusername/biodaat.git biodaat
```

### Step 2: Create Database

1. Log into CyberPanel
2. Navigate to **Databases** → **Create Database**
3. Create a new database (e.g., `biodaat_db`)
4. Note down the database name, username, and password

### Step 3: Import Schema

```bash
# Using command line
mysql -u your_db_user -p your_db_name < sql/schema.sql

# Or use phpMyAdmin to import sql/schema.sql
```

### Step 4: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

Update these values in `.env`:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password

JWT_SECRET=generate-a-strong-random-string-here

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Step 5: Set Permissions

```bash
# Make storage directories writable
chmod -R 755 storage/
chmod -R 777 storage/logs/
chmod -R 777 storage/pdfs/
chmod -R 777 storage/uploads/
```

### Step 6: Configure Apache (if needed)

If `.htaccess` isn't working, ensure Apache's `mod_rewrite` is enabled:

```apache
# In your VirtualHost or .htaccess
<Directory /home/yourdomain/public_html/biodaat>
    AllowOverride All
</Directory>
```

### Step 7: Test the API

```bash
# Test health endpoint
curl https://yourdomain.com/biodaat/api/health

# Test database connection
curl https://yourdomain.com/biodaat/api/health/db
```

Expected response:
```json
{
    "success": true,
    "message": "API is running",
    "data": {
        "status": "ok",
        "service": "Biodaat API",
        "version": "1.0.0"
    }
}
```

---

## 📁 Project Structure

```
biodaat/
├── api/                    # PHP Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── helpers/           # Utility classes
│   ├── middleware/        # Request middleware
│   ├── bootstrap.php      # App initialization
│   └── index.php          # Entry point router
├── app/                   # Static Next.js export
├── storage/               # File storage
│   ├── pdfs/             # Generated PDFs
│   ├── uploads/          # Template uploads
│   └── logs/             # Error logs
├── sql/                   # Database schema
├── .env.example          # Environment template
└── README.md             # This file
```

---

## 🔌 API Endpoints

### Level 1 (Current)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Basic API health check |
| GET | `/api/health/db` | Database connectivity check |

### Upcoming Levels

- **Level 2**: Authentication (login, logout, JWT)
- **Level 3**: Templates (CRUD, gallery)
- **Level 4**: Preview integration
- **Level 5**: PDF generation
- **Level 6**: Secure downloads
- **Level 7**: Razorpay payments
- **Level 8**: Admin dashboard

---

## 🔒 Security Features

- SQL injection prevention (PDO prepared statements)
- XSS protection (output encoding)
- CORS validation
- Security headers (.htaccess)
- Error logging (no exposure to clients)
- JWT authentication (Level 2)

---

## 🛠️ Development Workflow

### Updating Production

```bash
# SSH into server
cd /home/yourdomain/public_html/biodaat

# Pull latest changes
git pull origin main

# If database changes
mysql -u user -p database < sql/schema.sql
```

### Adding New Endpoints

1. Create controller in `api/controllers/`
2. Add route in `api/index.php` `$routes` array
3. Test locally or directly on production

---

## 📋 Troubleshooting

### 500 Internal Server Error
- Check `storage/logs/php-errors.log`
- Verify `.env` file exists and is configured
- Check file permissions

### 404 Not Found
- Verify `mod_rewrite` is enabled
- Check `.htaccess` is being processed
- Verify `AllowOverride All` in Apache config

### Database Connection Failed
- Verify database credentials in `.env`
- Check database user has proper permissions
- Ensure MySQL is running

---

## 📄 License

MIT License - See LICENSE file for details.
