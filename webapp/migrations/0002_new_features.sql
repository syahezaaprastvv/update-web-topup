-- ============================================
-- MIGRATION 0002: New Features
-- transactions, reviews, live_orders config
-- ============================================

-- Transaction status table (admin manages, customer can check)
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  game_name TEXT NOT NULL,
  game_id TEXT NOT NULL,
  nickname TEXT,
  product_name TEXT,
  amount INTEGER DEFAULT 0,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT (datetime('now', '+3 days'))
);

-- Reviews / testimonials
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reviewer_name TEXT NOT NULL,
  avatar_letter TEXT,
  game_name TEXT,
  rating INTEGER DEFAULT 5,
  review_text TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Live order notifications config
CREATE TABLE IF NOT EXISTS live_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT NOT NULL,
  game_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- Settings for new features
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('live_order_enabled', '1'),
  ('live_order_interval', '6000'),
  ('review_section_enabled', '1'),
  ('review_section_title', 'Apa Kata Mereka?'),
  ('transaction_retention_days', '3');

-- Default reviews
INSERT OR IGNORE INTO reviews (reviewer_name, avatar_letter, game_name, rating, review_text, is_active, sort_order) VALUES
  ('Fadli R.', 'F', 'Mobile Legends', 5, 'Top up cepet banget, 5 menit langsung masuk! Harga juga lebih murah dibanding tempat lain. Recommended banget!', 1, 1),
  ('Ayu S.', 'A', 'Free Fire', 5, 'Udah langganan di sini dari lama, admin ramah dan responsif. Proses cepat, gak pernah kecewa!', 1, 2),
  ('Rizky P.', 'R', 'Genshin Impact', 5, 'Pertama kali order ragu-ragu, ternyata proses cepat dan aman. Diamond langsung masuk ke akun. 5 bintang!', 1, 3),
  ('Dinda M.', 'D', 'PUBG Mobile', 5, 'Harga murah, proses kilat, admin fast respon. Sudah 10x order di sini dan gak pernah ada masalah!', 1, 4),
  ('Budi H.', 'B', 'Honkai Star Rail', 4, 'Pelayanan memuaskan, harga kompetitif. Sempat ada pertanyaan, admin langsung jawab. Puas!', 1, 5),
  ('Siti N.', 'S', 'Valorant', 5, 'Terpercaya, sudah sering top up di sini. Prosesnya gampang, tinggal chat WA admin langsung beres!', 1, 6);

-- Default live orders
INSERT OR IGNORE INTO live_orders (display_name, game_name, product_name, is_active, sort_order) VALUES
  ('Fadli****', 'Mobile Legends', '86 Diamonds', 1, 1),
  ('Reza****', 'Free Fire', '140 Diamonds', 1, 2),
  ('Ayu****', 'Genshin Impact', 'Welkin Moon', 1, 3),
  ('Dimas****', 'PUBG Mobile', '660 UC', 1, 4),
  ('Rina****', 'Honkai Star Rail', 'Oneiric Shard x60', 1, 5),
  ('Bagas****', 'Valorant', 'VP 420', 1, 6),
  ('Siti****', 'Mobile Legends', '257 Diamonds', 1, 7),
  ('Andre****', 'Zenless Zone Zero', 'InterKnot Member', 1, 8),
  ('Nita****', 'Free Fire', '355 Diamonds', 1, 9),
  ('Hendra****', 'PUBG Mobile', '325 UC', 1, 10);
