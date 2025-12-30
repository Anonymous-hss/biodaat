-- ============================================
-- CMS Content Management Tables
-- ============================================

-- Site Settings (meta tags, site name, etc.)
CREATE TABLE IF NOT EXISTS cms_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'textarea', 'json', 'boolean') DEFAULT 'text',
    setting_group VARCHAR(50) DEFAULT 'general',
    label VARCHAR(200),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hero Section Content
INSERT INTO cms_settings (setting_key, setting_value, setting_type, setting_group, label) VALUES
('site_name', 'Biodaat', 'text', 'general', 'Site Name'),
('site_tagline', 'Create Your Marriage Biodata in Minutes', 'text', 'general', 'Site Tagline'),
('meta_title', 'Biodaat - Free Marriage Biodata Maker | Create Beautiful PDF Biodata', 'text', 'seo', 'Meta Title'),
('meta_description', 'Create stunning marriage biodata in minutes. Choose from 6+ beautiful templates, fill your details, and download a professional PDF biodata instantly. 100% Free!', 'textarea', 'seo', 'Meta Description'),
('meta_keywords', 'marriage biodata, biodata maker, wedding biodata, biodata template, free biodata', 'textarea', 'seo', 'Meta Keywords'),
('hero_badge', '✨ 100% Free • No Sign-up Required', 'text', 'hero', 'Hero Badge Text'),
('hero_title_line1', 'Create Your Marriage', 'text', 'hero', 'Hero Title Line 1'),
('hero_title_line2', 'Biodata in Minutes', 'text', 'hero', 'Hero Title Line 2'),
('hero_subtitle', 'Choose from beautiful templates, fill your details, and download a stunning PDF biodata instantly.', 'textarea', 'hero', 'Hero Subtitle'),
('hero_cta_text', 'Create My Biodata →', 'text', 'hero', 'Hero CTA Button Text');

-- USP Section
CREATE TABLE IF NOT EXISTS cms_usps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(50),
    title VARCHAR(100),
    description VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO cms_usps (icon, title, description, sort_order) VALUES
('🎨', '6+ Templates', 'Traditional to modern designs', 1),
('⚡', 'Instant PDF', 'Download in seconds', 2),
('🔒', '100% Private', 'Your data stays safe', 3),
('📱', 'Easy Sharing', 'WhatsApp, email, QR code', 4);

-- Template Section
CREATE TABLE IF NOT EXISTS cms_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    description VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO cms_templates (name, icon, color, description, sort_order) VALUES
('Traditional', '🕉️', '#D4AF37', 'Classic with religious motifs', 1),
('Modern Minimal', '✨', '#0D5C63', 'Clean and elegant', 2),
('Professional', '💼', '#2C3E50', 'Career-focused layout', 3),
('Elegant Floral', '🌸', '#E91E63', 'Soft floral borders', 4),
('Royal Gold', '👑', '#B8860B', 'Premium golden accents', 5),
('Simple Classic', '📄', '#6B7280', 'No-frills format', 6);

-- FAQ Section
CREATE TABLE IF NOT EXISTS cms_faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO cms_faqs (question, answer, sort_order) VALUES
('Is this really free?', 'Yes! Creating and downloading biodata is 100% free. No hidden charges.', 1),
('Do I need to create an account?', 'No sign-up required. Just fill your details and download instantly.', 2),
('Is my data safe?', 'Your data is processed securely and is not stored permanently on our servers.', 3),
('Can I edit after downloading?', 'Yes! Come back anytime and create a new biodata with updated information.', 4);

-- Footer Settings
INSERT INTO cms_settings (setting_key, setting_value, setting_type, setting_group, label) VALUES
('footer_copyright', '© 2024 Biodaat. Made with ❤️ in India', 'text', 'footer', 'Footer Copyright'),
('footer_tagline', '✦ Biodaat', 'text', 'footer', 'Footer Tagline');

-- Admin Users (for CMS login)
CREATE TABLE IF NOT EXISTS cms_admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO cms_admins (username, password, name, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@biodaat.com');
