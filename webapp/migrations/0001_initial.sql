-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'topup-game',
  image_url TEXT NOT NULL,
  banner_url TEXT,
  description TEXT,
  wa_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  badge TEXT DEFAULT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  is_flash_sale INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- Flash sale products
CREATE TABLE IF NOT EXISTS flash_sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  game_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Marketplace accounts (NEW)
CREATE TABLE IF NOT EXISTS marketplace_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  badge TEXT DEFAULT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Popup settings (NEW)
CREATE TABLE IF NOT EXISTS popup_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT OR IGNORE INTO admin_users (username, password) VALUES ('syahreza', 'reza12345');

-- Default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('site_title', 'EVOGAME'),
  ('site_subtitle', 'Top Up Game Murah & Terpercaya'),
  ('site_description', 'Platform top up game yang aman, cepat, harga bersahabat, dengan banyak metode pembayaran. Solusi praktis para gamer!'),
  ('wa_number', '6285138987769'),
  ('wa_link', 'https://wa.me/6285138987769'),
  ('instagram_link', 'https://instagram.com/evogamestore'),
  ('facebook_link', 'https://facebook.com/evogamestore'),
  ('email', 'admin@evogamestore.my.id'),
  ('logo_url', ''),
  ('favicon_url', ''),
  ('theme', 'dark'),
  ('hero_title', 'Top Up Game Murah & Terpercaya'),
  ('hero_subtitle', 'Platform top up game yang aman, cepat, harga bersahabat'),
  ('hero_cta_text', 'Lihat Semua Game'),
  ('hero_badge_text', '🎮 EvoGame Store');

-- Default popup
INSERT OR IGNORE INTO popup_settings (title, content, is_active) VALUES
  ('Selamat Datang di EVOGAME! 🎮', 'Top up game murah, cepat & terpercaya! Proses 1-15 menit setelah bukti transfer. Hubungi admin WA untuk bantuan.', 1);

-- Default payment methods
INSERT OR IGNORE INTO payment_methods (name, image_url, is_active, sort_order) VALUES
  ('QRIS Digital', 'https://cdn1.codashop.com/S/content/common/images/mno/QRIS_ID_CHNL_LOGO.webp', 1, 1),
  ('Dana Wallet', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHgrTiev9gXHREs3K-PP31f0hBDrkuOQg8dkpLQVGAGWcE7cL8pTnvL8tHJtkgfrM5ADtopcH3b3_mLrXCil_RbCIw4JWijA1yuhxHCN7PsiQ3pjbta7cBWu7edVFeZT-myZf73ma6z3k/h40/dana.png', 1, 2),
  ('Gopay Wallet', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcPlT5EBK0N3Z5E8dEnnQPvVqDGwT9htJId9vs-_uMqAGS0ey1w8tGA4ek1bs4syJLkfrfWJAIg-8dWDjROTBUptZGzcy0XToim4WOFrLsDOftK8VHo_hFGdj3uTz4495RuZDqdLMZbGk/h40/gopay.png', 1, 3),
  ('OVO Wallet', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUELw6xKSR2xf2rrpJ4e5ZawFYTXi1j2SXJzqMNEpa6ziYZi-Zp04Kxu9yd3EPtkdIJmQ3FEP6i3CQIfEhw6aTi3u_7mX8wyKJECyVZj7lXEC8Aqc4ixWWdEGsixDFiliK7YhGy_MABpY/h40/ovo.png', 1, 4),
  ('ShopeePay Wallet', 'https://i.ibb.co/bPSpf1G/Shopee-Pay.png', 1, 5),
  ('Bank Transfer', 'https://cdn1.codashop.com/S/content/common/images/mno/DOKU_ATM_ID_CHNL_LOGO.webp', 1, 6),
  ('Indomaret', 'https://cdn1.codashop.com/S/content/common/images/mno/Indomaret_ID_CHNL_LOGO.webp', 1, 7),
  ('Alfamart', 'https://cdn1.codashop.com/S/content/common/images/mno/DOKU_OTC_ID_CHNL_LOGO.webp', 1, 8),
  ('Pulsa Telkomsel', 'https://cdn1.codashop.com/S/content/common/images/mno/TELKOMSEL_ID_CHNL_LOGO.webp', 1, 9),
  ('Pulsa Indosat', 'https://cdn1.codashop.com/S/content/common/images/mno/INDOSAT_ID_CHNL_LOGO.webp', 1, 10),
  ('Pulsa Tri', 'https://cdn1.codashop.com/S/content/common/images/mno/HUTCH_THREE_ID_CHNL_LOGO.webp', 1, 11),
  ('Pulsa XL', 'https://cdn1.codashop.com/S/content/common/images/mno/XL_ID_CHNL_LOGO.webp', 1, 12),
  ('Kartu Kredit', 'https://cdn1.codashop.com/S/content/common/images/mno/CARD_PAYMENT_ID_CHNL_LOGO.webp', 1, 13);
