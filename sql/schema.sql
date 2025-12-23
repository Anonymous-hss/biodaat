-- ============================================
-- BIODAAT - Wedding Biodata Generator
-- Database Schema - Level 1
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Users Table
-- Phone-based authentication
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(15) NOT NULL,
    `name` VARCHAR(100) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_login_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_phone` (`phone`),
    KEY `idx_users_email` (`email`),
    KEY `idx_users_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Admin Users Table
-- Separate table for admin authentication
-- ============================================
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'admin',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_login_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_admin_username` (`username`),
    UNIQUE KEY `uk_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Templates Table
-- Biodata template metadata and configuration
-- ============================================
CREATE TABLE IF NOT EXISTS `templates` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `preview_image` VARCHAR(255) DEFAULT NULL,
    `template_file` VARCHAR(255) NOT NULL COMMENT 'HTML template filename',
    `field_schema` JSON NOT NULL COMMENT 'JSON schema defining form fields',
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `is_premium` TINYINT(1) NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    `download_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_templates_slug` (`slug`),
    KEY `idx_templates_active` (`is_active`),
    KEY `idx_templates_premium` (`is_premium`),
    KEY `idx_templates_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Template Fields Table
-- Detailed field definitions for each template
-- ============================================
CREATE TABLE IF NOT EXISTS `template_fields` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `template_id` INT UNSIGNED NOT NULL,
    `field_key` VARCHAR(50) NOT NULL,
    `field_label` VARCHAR(100) NOT NULL,
    `field_type` ENUM('text', 'textarea', 'date', 'select', 'radio', 'checkbox', 'email', 'phone', 'image') NOT NULL DEFAULT 'text',
    `placeholder` VARCHAR(255) DEFAULT NULL,
    `default_value` VARCHAR(255) DEFAULT NULL,
    `options` JSON DEFAULT NULL COMMENT 'Options for select/radio fields',
    `validation_rules` JSON DEFAULT NULL COMMENT 'Validation rules',
    `is_required` TINYINT(1) NOT NULL DEFAULT 0,
    `sort_order` INT NOT NULL DEFAULT 0,
    `field_group` VARCHAR(50) DEFAULT 'general' COMMENT 'Group fields for sections',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_tf_template` (`template_id`),
    KEY `idx_tf_sort` (`sort_order`),
    CONSTRAINT `fk_tf_template` FOREIGN KEY (`template_id`) 
        REFERENCES `templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Orders Table
-- Payment and order tracking
-- ============================================
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `template_id` INT UNSIGNED NOT NULL,
    `order_number` VARCHAR(20) NOT NULL,
    `razorpay_order_id` VARCHAR(50) DEFAULT NULL,
    `razorpay_payment_id` VARCHAR(50) DEFAULT NULL,
    `razorpay_signature` VARCHAR(255) DEFAULT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'INR',
    `status` ENUM('pending', 'paid', 'failed', 'refunded', 'free') NOT NULL DEFAULT 'pending',
    `payment_method` VARCHAR(50) DEFAULT NULL,
    `paid_at` DATETIME DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_orders_number` (`order_number`),
    UNIQUE KEY `uk_orders_razorpay` (`razorpay_order_id`),
    KEY `idx_orders_user` (`user_id`),
    KEY `idx_orders_template` (`template_id`),
    KEY `idx_orders_status` (`status`),
    KEY `idx_orders_created` (`created_at`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_orders_template` FOREIGN KEY (`template_id`) 
        REFERENCES `templates` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Generated Biodatas Table
-- Stores user-generated biodatas with form data
-- ============================================
CREATE TABLE IF NOT EXISTS `generated_biodatas` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `order_id` INT UNSIGNED DEFAULT NULL,
    `template_id` INT UNSIGNED NOT NULL,
    `form_data` JSON NOT NULL COMMENT 'User-submitted form data',
    `pdf_filename` VARCHAR(255) DEFAULT NULL,
    `pdf_size` INT UNSIGNED DEFAULT NULL COMMENT 'File size in bytes',
    `generated_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_gb_user` (`user_id`),
    KEY `idx_gb_order` (`order_id`),
    KEY `idx_gb_template` (`template_id`),
    KEY `idx_gb_created` (`created_at`),
    CONSTRAINT `fk_gb_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_gb_order` FOREIGN KEY (`order_id`) 
        REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_gb_template` FOREIGN KEY (`template_id`) 
        REFERENCES `templates` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Download Tokens Table
-- Secure, expiring download tokens
-- ============================================
CREATE TABLE IF NOT EXISTS `download_tokens` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `biodata_id` INT UNSIGNED NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `max_downloads` INT UNSIGNED NOT NULL DEFAULT 5,
    `download_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `last_download_at` DATETIME DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dt_token` (`token`),
    KEY `idx_dt_biodata` (`biodata_id`),
    KEY `idx_dt_expires` (`expires_at`),
    CONSTRAINT `fk_dt_biodata` FOREIGN KEY (`biodata_id`) 
        REFERENCES `generated_biodatas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- OTP Tokens Table
-- For phone-based authentication
-- ============================================
CREATE TABLE IF NOT EXISTS `otp_tokens` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(15) NOT NULL,
    `otp` VARCHAR(6) NOT NULL,
    `purpose` ENUM('login', 'verify') NOT NULL DEFAULT 'login',
    `attempts` INT UNSIGNED NOT NULL DEFAULT 0,
    `is_used` TINYINT(1) NOT NULL DEFAULT 0,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_otp_phone` (`phone`),
    KEY `idx_otp_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Refresh Tokens Table
-- For JWT refresh token management
-- ============================================
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `token_hash` VARCHAR(64) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_rt_hash` (`token_hash`),
    KEY `idx_rt_user` (`user_id`),
    KEY `idx_rt_expires` (`expires_at`),
    CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- App Settings Table
-- Key-value store for app configuration
-- ============================================
CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `value` TEXT DEFAULT NULL,
    `type` ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `description` VARCHAR(255) DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_settings_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA
-- ============================================

-- Default Admin User (password: Admin@123)
INSERT INTO `admin_users` (`username`, `password_hash`, `name`, `email`, `role`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', 'admin@biodaat.com', 'super_admin');

-- Default Settings
INSERT INTO `settings` (`key`, `value`, `type`, `description`) VALUES
('site_name', 'Biodaat', 'string', 'Website name'),
('site_tagline', 'Beautiful Wedding Biodatas', 'string', 'Website tagline'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('free_downloads_limit', '1', 'number', 'Free downloads per user'),
('razorpay_enabled', 'false', 'boolean', 'Enable Razorpay payments');

-- Sample Free Template
INSERT INTO `templates` (`name`, `slug`, `description`, `template_file`, `field_schema`, `price`, `is_premium`, `is_active`, `sort_order`) VALUES
('Classic Elegance', 'classic-elegance', 'A timeless, elegant biodata template with traditional design elements.', 'classic-elegance.html', '{
    "sections": [
        {
            "id": "personal",
            "title": "Personal Details",
            "fields": [
                {"key": "full_name", "label": "Full Name", "type": "text", "required": true},
                {"key": "date_of_birth", "label": "Date of Birth", "type": "date", "required": true},
                {"key": "birth_time", "label": "Birth Time", "type": "text", "required": false},
                {"key": "birth_place", "label": "Birth Place", "type": "text", "required": true},
                {"key": "height", "label": "Height", "type": "text", "required": true},
                {"key": "complexion", "label": "Complexion", "type": "select", "options": ["Fair", "Wheatish", "Medium", "Dark"], "required": false},
                {"key": "blood_group", "label": "Blood Group", "type": "select", "options": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], "required": false}
            ]
        },
        {
            "id": "religious",
            "title": "Religious Background",
            "fields": [
                {"key": "religion", "label": "Religion", "type": "text", "required": true},
                {"key": "caste", "label": "Caste", "type": "text", "required": false},
                {"key": "sub_caste", "label": "Sub-caste", "type": "text", "required": false},
                {"key": "gotra", "label": "Gotra", "type": "text", "required": false},
                {"key": "rashi", "label": "Rashi", "type": "text", "required": false},
                {"key": "nakshatra", "label": "Nakshatra", "type": "text", "required": false}
            ]
        },
        {
            "id": "education",
            "title": "Education & Career",
            "fields": [
                {"key": "education", "label": "Education", "type": "text", "required": true},
                {"key": "occupation", "label": "Occupation", "type": "text", "required": true},
                {"key": "company", "label": "Company/Organization", "type": "text", "required": false},
                {"key": "income", "label": "Annual Income", "type": "text", "required": false}
            ]
        },
        {
            "id": "family",
            "title": "Family Details",
            "fields": [
                {"key": "father_name", "label": "Father''s Name", "type": "text", "required": true},
                {"key": "father_occupation", "label": "Father''s Occupation", "type": "text", "required": false},
                {"key": "mother_name", "label": "Mother''s Name", "type": "text", "required": true},
                {"key": "mother_occupation", "label": "Mother''s Occupation", "type": "text", "required": false},
                {"key": "siblings", "label": "Siblings", "type": "textarea", "required": false},
                {"key": "family_type", "label": "Family Type", "type": "select", "options": ["Joint", "Nuclear"], "required": false}
            ]
        },
        {
            "id": "contact",
            "title": "Contact Information",
            "fields": [
                {"key": "address", "label": "Address", "type": "textarea", "required": true},
                {"key": "city", "label": "City", "type": "text", "required": true},
                {"key": "state", "label": "State", "type": "text", "required": true},
                {"key": "phone", "label": "Contact Number", "type": "phone", "required": true},
                {"key": "email", "label": "Email", "type": "email", "required": false}
            ]
        }
    ]
}', 0.00, 0, 1, 1);

SET FOREIGN_KEY_CHECKS = 1;
