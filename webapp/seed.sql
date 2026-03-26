-- Seed game data from existing website

-- Top Up Games
INSERT OR IGNORE INTO games (name, slug, category, image_url, status, badge, sort_order) VALUES
('Mobile Legends', 'mobile-legends', 'topup-game', 'https://play-lh.googleusercontent.com/wRXSrwwbzBBlTpowK6onSs3rfBV-4nqVvLJJ7yAZa7jzdGNHpHH2hDhKCyKWj_3nqw', 'active', 'Flash', 1),
('Free Fire', 'free-fire', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/free-fire.webp', 'active', 'Hot', 2),
('Magic Chess: Go Go', 'magic-chess-go-go', 'topup-game', 'https://www.hipopotamya.com/img/products/magic-chess-go-go-250-tl-google-play-68c416c9c3bec.jpg', 'active', 'Hot', 3),
('Honor Of Kings', 'honor-of-kings', 'topup-game', 'https://play-lh.googleusercontent.com/73i1fY0ewi9PojudqwPzmGKxmhJ-MWaQR3UZvJxttIoVV4OwyK_wg-EG2q-c_JHZ50s', 'active', null, 4),
('Blood Strike', 'blood-strike', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/blood_strike_tile.png', 'active', 'Flash', 5),
('Genshin Impact', 'genshin-impact', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/genshinimpact_tile.jpg', 'active', 'Flash', 6),
('Honkai Star Rail', 'honkai-star-rail', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/hsr_tile.jpg', 'active', null, 7),
('PUBG Mobile', 'pubg-mobile', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/pubgm_tile_aug2024.jpg', 'active', 'Flash', 8),
('Zenless Zone Zero', 'zenless-zone-zero', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/ZZZ_Zenless-Zone-Zero-Tile.png', 'active', 'Flash', 9),
('Undawn', 'undawn', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/garena-undawn.jpg', 'active', null, 10),
('ZEPETO', 'zepeto', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/zepeto_tile.png', 'active', 'Flash', 11),
('VALORANT', 'valorant', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/valorant_tile.jpg', 'active', null, 12),
('Call Of Duty', 'call-of-duty', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/codmobile_tile.jpg', 'active', null, 13),
('Arena Breakout', 'arena-breakout', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/arena-breakout.webp', 'active', null, 14),
('Tom and Jerry: Chase', 'tom-and-jerry-chase', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/tjc_tile.jpg', 'active', null, 15),
('Goddes of Victory: Nikke', 'goddes-of-victory-nikke', 'topup-game', 'https://tse1.mm.bing.net/th/id/OIP.eg3S-s_0M2YTHpJgaMr_jQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'active', null, 16),
('Black Clover', 'black-clover', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/black-clover-m.webp', 'active', null, 17),
('Tower Of Fantasy', 'tower-of-fantasy', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/game/tower-of-fantasy-icon.webp', 'active', null, 18),
('Ace Racer', 'ace-racer', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/ace-racer.webp', 'active', null, 19),
('Clash Of Clans', 'clash-of-clans', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/clash-of-clans.jpg', 'active', null, 20),
('The Legend Of Neverland', 'the-legend-of-neverland', 'topup-game', 'https://play-lh.googleusercontent.com/3CCt9VumeDjMTQ556AtFumhEiMDlXOsQoFB7DPQThDAhWrv2Xlhi736hgyYzJwsK2Q', 'active', null, 21),
('Dragon Raja', 'dragon-raja', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/game/dragon-raja.jpg', 'active', 'Flash', 22),
('Delta Force', 'delta-force', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/delta-force.png', 'active', null, 23),
('FC Mobile', 'fc-mobile', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/fc-mobile.jpg', 'inactive', null, 24),
('Eggy Party', 'eggy-party', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/eggy-party.webp', 'active', null, 25),
('Farlight 84', 'farlight-84', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/farlight-84.webp', 'active', null, 26),
('Growtopia', 'growtopia', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/Growtopia.webp', 'inactive', null, 27),
('Hay Day', 'hay-day', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/hayday.jpg', 'inactive', null, 28),
('Honkai Impact 3', 'honkai-impact-3', 'topup-game', 'https://play-lh.googleusercontent.com/4gFYKGVd_fNFVoaJxCjfj3fzrAL9HCk-cPJ7_VlJqfGHpEtqwSekABuYy', 'active', null, 29),
('Identity V', 'identity-v', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/identityv_tile.jpg', 'active', null, 30),
('League Of Legends', 'league-of-legends', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/game/league-of-legends.webp', 'inactive', null, 31),
('Love and Deepspace', 'love-and-deepspace', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/lads_tile.jpg', 'active', null, 32),
('Sausage Man', 'sausage-man', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/sausage-man.webp', 'active', null, 33),
('Super Sus', 'super-sus', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/super-sus.webp', 'active', null, 34),
('One Punch Man', 'one-punch-man', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/one-punch-man.jpg', 'active', null, 35),
('Life After', 'life-after', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/life-after.webp', 'active', null, 36),
('Stumble Guys', 'stumble-guys', 'topup-game', 'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/stumbleguys_tile_1.jpg', 'gangguan', null, 37),
('Naruto Slugfest X', 'naruto-slugfest-x', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/naruto-slugfest-x.webp', 'active', null, 38),
('Whiteout Survival Frost Star', 'whiteout-survival-frost-star', 'topup-game', 'https://vip-reseller.co.id/library/assets/images/product/whiteout-survival.webp', 'active', null, 39),

-- Pulsa & Data
('INDOSAT', 'indosat', 'pulsa-data', 'https://vip-reseller.co.id/library/assets/images/product/indosat.jpg', 'gangguan', null, 40),
('AXIS', 'axis', 'pulsa-data', 'https://vip-reseller.co.id/library/assets/images/product/axis.jpg', 'gangguan', null, 41),
('TELKOMSEL', 'telkomsel', 'pulsa-data', 'https://vip-reseller.co.id/library/assets/images/product/telkomsel.jpg', 'gangguan', null, 42),
('THREE', 'three', 'pulsa-data', 'https://vip-reseller.co.id/library/assets/images/product/three.jpg', 'gangguan', null, 43),
('BY U', 'by-u', 'pulsa-data', 'https://vip-reseller.co.id/library/assets/images/product/by-u.jpg', 'gangguan', null, 44),
('LISTRIK PLN', 'listrik-pln', 'pulsa-data', 'https://vip-reseller.co.id/library/assets/images/product/pln.jpg', 'active', null, 45),

-- Voucher & Aplikasi
('Google Play', 'google-play', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/google-play.jpg', 'gangguan', null, 50),
('Garena Shell', 'garena-shell', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/garena-shell.jpg', 'gangguan', null, 51),
('UniPin Voucher', 'unipin-voucher', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/unipin.jpg', 'gangguan', null, 52),
('Razer Gold', 'razer-gold', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/razer-gold.jpg', 'gangguan', null, 53),
('Steam Wallet', 'steam-wallet', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/steam.jpg', 'gangguan', null, 54),
('Spotify Premium', 'spotify-premium', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/spotify.jpg', 'gangguan', null, 55),
('Netflix', 'netflix', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/netflix.jpg', 'gangguan', null, 56),
('Roblox Gift Card', 'roblox-gift-card', 'voucher-aplikasi', 'https://vip-reseller.co.id/library/assets/images/product/roblox.jpg', 'gangguan', null, 57);

-- Mobile Legends Products
INSERT OR IGNORE INTO products (game_id, name, price, original_price, is_flash_sale, status, sort_order) VALUES
(1, '1x Weekly Diamond Pass', 28654, 31920, 0, 'active', 1),
(1, '2x Weekly Diamond Pass', 56365, 62420, 0, 'active', 2),
(1, '3x Weekly Diamond Pass', 83969, 85950, 1, 'active', 3),
(1, '19 Diamonds', 5905, 6720, 0, 'active', 4),
(1, '36 Diamonds', 10735, 11860, 0, 'active', 5),
(1, '77 Diamonds', 19845, 22340, 0, 'active', 6),
(1, '154 Diamonds', 38215, 43180, 0, 'active', 7),
(1, '240 Diamonds', 61525, 62250, 0, 'active', 8),
(1, '330 Diamonds', 83969, 85000, 0, 'active', 9),
(1, '500 Diamonds', 122999, 130000, 0, 'active', 10),
(1, '1000 Diamonds', 243000, 260000, 0, 'active', 11);

-- Genshin Impact Products
INSERT OR IGNORE INTO products (game_id, name, price, original_price, is_flash_sale, status, sort_order) VALUES
(6, '60 Primogems', 18000, 20000, 0, 'active', 1),
(6, '300 Primogems', 88000, 95000, 0, 'active', 2),
(6, 'Blessing of the Welkin Moon', 63127, 72873, 1, 'active', 3),
(6, 'Gnostic Hymn', 195000, 210000, 0, 'active', 4);

-- PUBG Mobile Products  
INSERT OR IGNORE INTO products (game_id, name, price, original_price, is_flash_sale, status, sort_order) VALUES
(8, '60 UC', 16000, 18000, 0, 'active', 1),
(8, '300 UC', 75000, 82000, 0, 'active', 2),
(8, '600 UC', 145000, 155000, 0, 'active', 3),
(8, '660 UC PUBG', 165735, 175665, 1, 'active', 4),
(8, '1800 UC', 425000, 450000, 0, 'active', 5);

-- Free Fire Products
INSERT OR IGNORE INTO products (game_id, name, price, original_price, is_flash_sale, status, sort_order) VALUES
(2, '100 Diamonds', 22000, 25000, 0, 'active', 1),
(2, '310 Diamonds', 65000, 72000, 0, 'active', 2),
(2, '520 Diamonds', 105000, 115000, 0, 'active', 3),
(2, '1060 Diamonds', 209000, 230000, 0, 'active', 4);

-- Flash sales
INSERT OR IGNORE INTO flash_sales (product_id, game_id) VALUES
(3, 1),   -- ML 3x Weekly Diamond Pass
(7, 6),   -- Genshin Welkin Moon
(12, 8);  -- PUBG 660 UC
