import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// ============================
// HELPER FUNCTIONS
// ============================

function getLayout(content: string, title: string, settings: any, extraHead = '') {
  const siteName = settings?.site_title || 'EVOGAME'
  const logoUrl = settings?.logo_url || ''
  const faviconUrl = settings?.favicon_url || ''
  const waLink = settings?.wa_link || 'https://wa.me/6285138987769'
  const igLink = settings?.instagram_link || '#'
  const fbLink = settings?.facebook_link || '#'
  const email = settings?.email || '#'
  const desc = settings?.site_description || ''
  const theme = settings?.theme || 'dark'

  let faviconTag = `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">`
  if (faviconUrl) {
    faviconTag = `<link rel="icon" href="${faviconUrl}" type="image/x-icon">`
  }

  let logoHtml = `<i class="fas fa-gamepad"></i><span>${siteName}</span>`
  if (logoUrl) {
    logoHtml = `<img src="${logoUrl}" alt="${siteName}" style="height:36px;object-fit:contain">`
  }

  return `<!DOCTYPE html>
<html lang="id" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title === 'Beranda' ? siteName : title + ' - ' + siteName}</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="topup ff, topup ml, topup game, voucher, pulsa, paket data, ${siteName.toLowerCase()}">
  <meta name="author" content="${siteName} Store">
  <meta property="og:title" content="${title} - ${siteName}">
  <meta property="og:description" content="${desc}">
  ${faviconTag}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/static/styles.css">
  ${extraHead}
</head>
<body class="${theme}-theme">
  <!-- Theme Toggle -->
  <button class="theme-toggle" id="themeToggle" title="Toggle Theme">
    <i class="fas fa-sun"></i>
  </button>

  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <div class="container">
      <a href="/" class="navbar-brand">
        ${logoHtml}
      </a>
      <div class="navbar-menu" id="navbarMenu">
        <a href="/" class="nav-link">Beranda</a>
        <a href="/marketplace" class="nav-link">Marketplace</a>
        <a href="/bantuan" class="nav-link">Bantuan</a>
        <a href="/syarat-ketentuan" class="nav-link">S&K</a>
        <a href="/cek-transaksi" class="nav-link">Cek Transaksi</a>
      </div>
      <div class="navbar-actions">
        <a href="/bantuan" class="btn-help"><i class="fas fa-headset"></i></a>
        <button class="hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
      <span class="mobile-menu-title">Menu</span>
      <button class="mobile-menu-close" id="mobileMenuClose"><i class="fas fa-times"></i></button>
    </div>
    <nav class="mobile-nav">
      <a href="/" class="mobile-nav-link"><i class="fas fa-home"></i> Beranda</a>
      <a href="/marketplace" class="mobile-nav-link"><i class="fas fa-store"></i> Marketplace</a>
      <a href="/bantuan" class="mobile-nav-link"><i class="fas fa-headset"></i> Bantuan</a>
      <a href="/syarat-ketentuan" class="mobile-nav-link"><i class="fas fa-file-contract"></i> Syarat & Ketentuan</a>
      <a href="/cek-transaksi" class="mobile-nav-link"><i class="fas fa-search"></i> Cek Transaksi</a>
    </nav>
  </div>
  <div class="overlay" id="overlay"></div>

  <!-- Main Content -->
  <main>
    ${content}
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            ${logoHtml}
          </div>
          <p>${desc}</p>
          <div class="footer-social">
            <a href="${waLink}" target="_blank" class="social-btn"><i class="fab fa-whatsapp"></i></a>
            <a href="${igLink}" target="_blank" class="social-btn"><i class="fab fa-instagram"></i></a>
            <a href="${fbLink}" target="_blank" class="social-btn"><i class="fab fa-facebook"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <h4>Navigasi</h4>
          <ul>
            <li><a href="/">Beranda</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
            <li><a href="/bantuan">Bantuan</a></li>
            <li><a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a></li>
            <li><a href="/cek-transaksi">Cek Transaksi</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Kategori</h4>
          <ul>
            <li><a href="/?category=topup-game">Top Up Game</a></li>
            <li><a href="/?category=voucher-aplikasi">Voucher &amp; Aplikasi</a></li>
            <li><a href="/?category=pulsa-data">Pulsa &amp; Paket Data</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Hubungi Kami</h4>
          <div class="contact-list">
            <a href="${waLink}" target="_blank" class="contact-item" style="text-decoration:none;color:inherit">
              <i class="fab fa-whatsapp" style="color:#25d366"></i>
              <span>WhatsApp Admin</span>
            </a>
            <a href="${igLink}" target="_blank" class="contact-item" style="text-decoration:none;color:inherit">
              <i class="fab fa-instagram" style="color:#e1306c"></i>
              <span>Instagram</span>
            </a>
            <a href="mailto:${email}" class="contact-item" style="text-decoration:none;color:inherit">
              <i class="fas fa-envelope" style="color:var(--primary)"></i>
              <span>${email !== '#' ? email : 'Email'}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ${siteName}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <!-- WA Float -->
  <a href="${waLink}" target="_blank" class="wa-float">
    <i class="fab fa-whatsapp"></i>
  </a>

  <script src="/static/app.js"></script>
</body>
</html>`
}

async function getSettings(db: D1Database): Promise<Record<string, string>> {
  try {
    const rows = await db.prepare('SELECT key, value FROM settings').all()
    const settings: Record<string, string> = {}
    for (const row of rows.results as any[]) {
      settings[row.key] = row.value
    }
    return settings
  } catch {
    return {}
  }
}

function isAdmin(c: any): boolean {
  const session = getCookie(c, 'admin_session')
  return session === 'authenticated'
}

// ============================
// THEME API
// ============================
app.post('/api/theme', async (c) => {
  const { theme } = await c.req.json()
  if (theme === 'dark' || theme === 'light') {
    await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind('theme', theme).run()
  }
  return c.json({ success: true })
})

// ============================
// HOME PAGE
// ============================
app.get('/', async (c) => {
  const settings = await getSettings(c.env.DB)
  const category = c.req.query('category') || 'all'

  // Get games
  const gamesRes = await c.env.DB.prepare('SELECT * FROM games ORDER BY sort_order ASC, id ASC').all()
  const games = gamesRes.results as any[]

  // Get flash sale products
  const flashRes = await c.env.DB.prepare(`
    SELECT p.*, g.name as game_name, g.slug as game_slug, g.image_url as game_image
    FROM flash_sales fs
    JOIN products p ON fs.product_id = p.id
    JOIN games g ON fs.game_id = g.id
    WHERE p.status = 'active'
    ORDER BY fs.id ASC
    LIMIT 8
  `).all()
  const flashSales = flashRes.results as any[]

  // Popup
  const popupRes = await c.env.DB.prepare("SELECT * FROM popup_settings WHERE is_active = 1 LIMIT 1").first() as any

  // Reviews
  const reviewsEnabled = settings.review_section_enabled !== '0'
  const reviewsRes = await c.env.DB.prepare("SELECT * FROM reviews WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 6").all().catch(() => ({ results: [] }))
  const reviews = (reviewsRes.results || []) as any[]
  const reviewTitle = settings.review_section_title || 'Apa Kata Mereka?'

  // Live orders
  const liveOrderEnabled = settings.live_order_enabled !== '0'
  const liveOrderInterval = parseInt(settings.live_order_interval || '6000')
  const liveOrdersRes = await c.env.DB.prepare("SELECT * FROM live_orders WHERE is_active = 1 ORDER BY sort_order ASC").all().catch(() => ({ results: [] }))
  const liveOrders = (liveOrdersRes.results || []) as any[]

  const heroTitle = settings.hero_title || 'Top Up Game Murah & Terpercaya'
  const heroSubtitle = settings.hero_subtitle || 'Platform top up game yang aman, cepat, harga bersahabat'
  const heroCtaText = settings.hero_cta_text || 'Lihat Semua Game'
  const heroBadge = settings.hero_badge_text || '🎮 EvoGame Store'

  // Flash sale HTML
  let flashHTML = ''
  if (flashSales.length > 0) {
    const flashItems = flashSales.map(p => `
      <a href="/game/${p.game_slug}" class="flash-product-card">
        <img src="${p.game_image}" alt="${p.game_name}" class="flash-product-img">
        <div class="flash-product-name">${p.game_name} - ${p.name}</div>
        <div class="flash-original-price">${formatRupiah(p.original_price)}</div>
        <div class="flash-product-price">${formatRupiah(p.price)}</div>
      </a>
    `).join('')

    flashHTML = `
    <section class="flash-sale-section">
      <div class="flash-header">
        <div class="flash-title"><i class="fas fa-bolt"></i> FLASH SALE</div>
        <div class="flash-timer" id="flashTimer">
          Berakhir dalam: 
          <div class="timer-block" id="timer-h">00</div>
          <span class="timer-sep">:</span>
          <div class="timer-block" id="timer-m">00</div>
          <span class="timer-sep">:</span>
          <div class="timer-block" id="timer-s">00</div>
        </div>
      </div>
      <div class="flash-products">${flashItems}</div>
    </section>`
  }

  // Games grid HTML
  const categories = [
    { id: 'topup-game', icon: '🎮', label: 'Top Up Game' },
    { id: 'voucher-aplikasi', icon: '🎁', label: 'Voucher & Aplikasi' },
    { id: 'pulsa-data', icon: '📱', label: 'Pulsa & Paket Data' },
  ]

  const tabsHTML = categories.map(cat => `
    <button class="tab-btn ${category === cat.id ? 'active' : ''}" data-category="${cat.id}">
      <span class="tab-icon">${cat.icon}</span> ${cat.label}
    </button>
  `).join('')

  const gamesHTML = games.map(g => {
    const isActive = g.status === 'active'
    const statusClass = isActive ? 'active' : 'inactive'
    const statusText = isActive ? 'Online' : 'Offline'
    
    if (g.status === 'gangguan') {
      return `
      <div class="game-card disabled-card" data-category="${g.category}" style="opacity:0.6;cursor:not-allowed;pointer-events:none">
        ${g.badge ? `<span class="game-badge badge-${g.badge.toLowerCase()}">${g.badge}</span>` : ''}
        <div style="position:relative">
          <img src="${g.image_url}" alt="${g.name}" class="game-card-img" loading="lazy">
          <div class="gangguan-overlay">
            <span class="badge-gangguan">⚠ Gangguan</span>
          </div>
        </div>
        <div class="game-card-body">
          <div class="game-card-name">${g.name}</div>
          <div class="game-card-status">
            <span class="status-dot inactive"></span>
            <span class="status-text inactive">Gangguan</span>
          </div>
        </div>
      </div>`
    }

    return `
    <a href="/game/${g.slug}" class="game-card" data-category="${g.category}">
      ${g.badge ? `<span class="game-badge badge-${g.badge.toLowerCase()}">${g.badge}</span>` : ''}
      <img src="${g.image_url}" alt="${g.name}" class="game-card-img" loading="lazy">
      <div class="game-card-body">
        <div class="game-card-name">${g.name}</div>
        <div class="game-card-status">
          <span class="status-dot ${statusClass}"></span>
          <span class="status-text ${statusClass}">${statusText}</span>
        </div>
      </div>
    </a>`
  }).join('')

  // Reviews HTML
  const reviewsHTML = reviewsEnabled && reviews.length > 0 ? `
  <section class="reviews-section">
    <div class="container">
      <div class="section-header" style="margin-bottom:28px">
        <h2 class="section-title"><i class="fas fa-star" style="color:#f59e0b"></i> ${reviewTitle}</h2>
      </div>
      <div class="reviews-grid">
        ${reviews.map(r => `
        <div class="review-card">
          <div class="review-header">
            <div class="review-avatar">${r.avatar_letter || r.reviewer_name.charAt(0).toUpperCase()}</div>
            <div class="review-meta">
              <div class="review-name">${r.reviewer_name}</div>
              <div class="review-game">${r.game_name || 'Game Top Up'}</div>
            </div>
          </div>
          <div class="review-stars">
            ${'<i class="fas fa-star"></i>'.repeat(Math.min(5, r.rating || 5))}${r.rating < 5 ? '<i class="far fa-star"></i>'.repeat(5 - r.rating) : ''}
          </div>
          <p class="review-text">"${r.review_text}"</p>
        </div>`).join('')}
      </div>
    </div>
  </section>` : ''

  // Popup HTML
  const popupHTML = popupRes ? `
  <div class="popup-overlay" id="sitePopup">
    <div class="popup-box">
      <button class="popup-close" onclick="closePopup()"><i class="fas fa-times"></i></button>
      <h3 class="popup-title">${popupRes.title}</h3>
      <p class="popup-content">${popupRes.content}</p>
      <button class="popup-btn" onclick="closePopup()">Mulai Belanja!</button>
    </div>
  </div>` : ''

  // Live order toast data
  const liveOrderScript = liveOrderEnabled && liveOrders.length > 0 ? `
  <script>
  var _liveOrders = ${JSON.stringify(liveOrders.map(o => ({
    name: o.display_name,
    game: o.game_name,
    product: o.product_name
  })))};
  var _loIdx = 0;
  function showLiveOrder() {
    if (!_liveOrders.length) return;
    var o = _liveOrders[_loIdx % _liveOrders.length];
    _loIdx++;
    var el = document.createElement('div');
    el.className = 'live-order-toast';
    el.innerHTML = '<div class="lo-icon"><i class="fas fa-shopping-cart"></i></div><div class="lo-body"><span class="lo-name">' + o.name + '</span> baru saja order<br><span class="lo-detail">' + o.game + ' · ' + o.product + '</span></div>';
    document.body.appendChild(el);
    setTimeout(function(){ el.classList.add('show'); }, 100);
    setTimeout(function(){
      el.classList.remove('show');
      setTimeout(function(){ el.remove(); }, 500);
    }, 4000);
  }
  // Start after 3s, then repeat
  setTimeout(function() {
    showLiveOrder();
    setInterval(showLiveOrder, ${liveOrderInterval});
  }, 3000);
  </script>` : ''

  const content = `
  ${popupHTML}

  <!-- Hero Section -->
  <section class="hero-branding-section">
    <div class="container">
      <div class="hero-branding-inner">
        <span class="hero-badge-pill">${heroBadge}</span>
        <h1 class="hero-branding-title">${heroTitle}</h1>
        <p class="hero-branding-sub">${heroSubtitle}</p>
        <a href="#games-section" class="hero-branding-cta">
          <i class="fas fa-gamepad"></i> ${heroCtaText}
        </a>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <div class="main-section" id="games-section">
    <div class="container">
      <!-- Search -->
      <div class="search-section">
        <div class="search-box">
          <input type="text" id="gameSearch" placeholder="Cari game, voucher, pulsa...">
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <div class="tabs-container">
          <button class="tab-btn ${category === 'all' ? 'active' : ''}" data-category="all">
            <span class="tab-icon">🌟</span> Semua
          </button>
          ${tabsHTML}
        </div>
      </div>

      ${flashHTML}

      <!-- Games Grid -->
      <div class="section-header">
        <h2 class="section-title">Semua Produk</h2>
        <span class="text-muted" style="font-size:13px">${games.length} produk tersedia</span>
      </div>
      <div class="games-grid" id="gamesGrid">
        ${gamesHTML}
      </div>
    </div>
  </div>

  ${reviewsHTML}

  ${liveOrderScript}`

  return c.html(getLayout(content, 'Beranda', settings))
})

// ============================
// GAME DETAIL PAGE
// ============================
app.get('/game/:slug', async (c) => {
  const slug = c.req.param('slug')
  const settings = await getSettings(c.env.DB)

  const game = await c.env.DB.prepare('SELECT * FROM games WHERE slug = ?').bind(slug).first() as any
  if (!game) return c.html('<h1>Game tidak ditemukan</h1>', 404)

  // Get products
  const productsRes = await c.env.DB.prepare('SELECT * FROM products WHERE game_id = ? ORDER BY sort_order ASC, price ASC').bind(game.id).all()
  const products = productsRes.results as any[]

  // Get payment methods
  const pmRes = await c.env.DB.prepare('SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY sort_order ASC').all()
  const paymentMethods = pmRes.results as any[]

  const catLabel = game.category === 'topup-game' ? 'Top Up Game' : game.category === 'voucher-aplikasi' ? 'Voucher & Aplikasi' : 'Pulsa & Paket Data'
  const waNum = game.wa_number || settings.wa_number || '6285138987769'

  const isActive = game.status === 'active'
  const statusClass = isActive ? 'active' : (game.status === 'gangguan' ? 'inactive' : 'inactive')
  const statusText = isActive ? 'Online' : (game.status === 'gangguan' ? 'Gangguan' : 'Offline')

  const productsHTML = products.map(p => {
    const isDisabled = p.status !== 'active'
    const disabledAttr = isDisabled ? 'style="opacity:0.5;pointer-events:none;cursor:not-allowed;position:relative"' : ''
    const badgeHTML = p.is_flash_sale ? '<div class="product-flash-badge">FLASH SALE</div>' : ''
    const gangguanBadge = isDisabled ? '<span style="position:absolute;top:6px;right:6px;background:#ef4444;color:white;font-size:10px;padding:2px 6px;border-radius:9999px;font-weight:700">⚠ Gangguan</span>' : ''
    return `
    <div class="product-card" data-product-id="${p.id}" ${isDisabled ? disabledAttr : `onclick="selectProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, ${p.original_price || p.price})"`}>
      ${gangguanBadge}
      ${badgeHTML}
      <div class="product-name" ${p.is_flash_sale ? 'style="margin-top:14px"' : ''}>${p.name}</div>
      ${p.original_price ? `<div class="product-original-price">${formatRupiah(p.original_price)}</div>` : ''}
      <div class="product-price">${formatRupiah(p.price)}</div>
    </div>`
  }).join('')

  const pmHTML = paymentMethods.map((pm, i) => `
    <div class="payment-method-item">
      <input type="radio" name="payment_method" id="pm_${pm.id}" value="${pm.name}" ${i === 0 ? 'checked' : ''}>
      <label for="pm_${pm.id}" class="payment-method-label">
        <img src="${pm.image_url}" alt="${pm.name}" class="payment-method-img">
        <span class="payment-method-name">${pm.name}</span>
      </label>
    </div>
  `).join('')

  const content = `
  <div class="detail-page">
    <div class="container">
      <div class="breadcrumb">
        <a href="/">Beranda</a>
        <i class="fas fa-chevron-right"></i>
        <a href="/?category=${game.category}">${catLabel}</a>
        <i class="fas fa-chevron-right"></i>
        <span>${game.name}</span>
      </div>

      <div class="detail-layout">
        <div>
          <div class="game-info-card">
            ${game.banner_url ? `<img src="${game.banner_url}" alt="${game.name}" class="game-banner-img">` : ''}
            <div class="game-info-body">
              <div class="game-info-header">
                <img src="${game.image_url}" alt="${game.name}" class="game-detail-img">
                <div>
                  <div class="game-detail-name">${game.name}</div>
                  <div class="game-detail-status">
                    <span class="status-badge ${statusClass}">
                      <i class="fas fa-circle" style="font-size:8px"></i>
                      ${statusText}
                    </span>
                  </div>
                </div>
              </div>
              <p class="game-detail-desc">${game.description || 'Silakan masukkan ID dan Nickname game Anda untuk melanjutkan pembelian.'}</p>
            </div>
          </div>

          <div class="products-section">
            <div class="section-header" style="margin-top:24px">
              <h3 class="section-title">Pilih Nominal</h3>
            </div>
            <div class="products-grid">
              ${products.length > 0 ? productsHTML : `
              <div style="text-align:center;padding:56px 24px;width:100%;grid-column:1/-1">
                <div style="font-size:64px;margin-bottom:16px;opacity:0.35">📦</div>
                <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px">Produk Tidak Tersedia</h3>
                <p style="font-size:14px;color:var(--text-muted);max-width:280px;margin:0 auto">Produk belum ditambahkan. Silakan hubungi admin untuk informasi lebih lanjut.</p>
              </div>`}
            </div>
          </div>
        </div>

        <div>
          <div class="purchase-form-card">
            <div class="form-title"><i class="fas fa-shopping-cart"></i> Form Pembelian</div>
            <input type="hidden" id="gameName" value="${game.name}">
            <input type="hidden" id="waNumber" value="${waNum}">

            <div class="form-group">
              <label class="form-label">Nickname <span class="required">*</span></label>
              <input type="text" id="inputNickname" class="form-control" placeholder="Masukkan nickname Anda">
            </div>

            <div class="form-group">
              <label class="form-label">ID Game <span class="required">*</span></label>
              <input type="text" id="inputGameId" class="form-control" placeholder="Masukkan ID Game Anda">
            </div>

            <div class="form-group">
              <label class="form-label">Server <span class="optional">(Opsional)</span></label>
              <input type="text" id="inputServer" class="form-control" placeholder="Contoh: ID, SEA, NA...">
            </div>

            <div class="form-group">
              <label class="form-label">Kode Voucher <span class="optional">(Opsional)</span></label>
              <input type="text" id="inputVoucher" class="form-control" placeholder="Masukkan kode voucher jika ada">
            </div>

            <div class="form-group">
              <label class="form-label">Metode Pembayaran <span class="required">*</span></label>
              <div class="payment-methods-grid">
                ${pmHTML}
              </div>
            </div>

            <div class="order-summary" id="orderSummary" style="display:none">
              <div class="order-summary-title">Ringkasan Pesanan</div>
              <div class="order-row">
                <span class="text-muted">Produk</span>
                <span id="summaryProduct" class="fw-semibold">-</span>
              </div>
              <div class="order-row">
                <span class="text-muted">Harga</span>
                <span id="summaryPrice" class="price-tag">-</span>
              </div>
              <div class="order-row total">
                <span>Total</span>
                <span id="summaryTotal" class="order-total-price">-</span>
              </div>
            </div>

            <button class="btn-buy" onclick="buyNow()">
              <i class="fab fa-whatsapp"></i>
              Beli Sekarang via WhatsApp
            </button>

            <p style="font-size:12px;color:var(--text-faint);text-align:center;margin-top:12px">
              <i class="fas fa-shield-alt" style="color:var(--success)"></i>
              Transaksi aman &amp; terpercaya
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`

  return c.html(getLayout(content, `Top Up ${game.name}`, settings))
})

// ============================
// MARKETPLACE PAGE
// ============================
app.get('/marketplace', async (c) => {
  const settings = await getSettings(c.env.DB)
  const waLink = settings.wa_link || 'https://wa.me/6285138987769'
  const waNum = settings.wa_number || '6285138987769'

  const accountsRes = await c.env.DB.prepare("SELECT * FROM marketplace_accounts WHERE status = 'active' ORDER BY sort_order ASC, id DESC").all()
  const accounts = accountsRes.results as any[]

  const accountsHTML = accounts.length > 0 ? accounts.map(acc => {
    const waMsg = encodeURIComponent(`Halo admin, saya tertarik dengan akun game berikut:\n\nGame: ${acc.game_name}\nJudul: ${acc.title}\nHarga: ${formatRupiah(acc.price)}\n\nTolong info lebih lanjut ya!`)
    return `
    <div class="market-card">
      ${acc.badge ? `<span class="market-badge badge-${acc.badge.toLowerCase()}">${acc.badge}</span>` : ''}
      ${acc.image_url ? `<img src="${acc.image_url}" alt="${acc.title}" class="market-card-img">` : `<div class="market-card-img-placeholder"><i class="fas fa-gamepad"></i></div>`}
      <div class="market-card-body">
        <div class="market-game-label">${acc.game_name}</div>
        <div class="market-card-title">${acc.title}</div>
        ${acc.description ? `<div class="market-card-desc">${acc.description}</div>` : ''}
        <div class="market-card-price">${formatRupiah(acc.price)}</div>
        <a href="https://wa.me/${waNum}?text=${waMsg}" target="_blank" class="market-buy-btn">
          <i class="fab fa-whatsapp"></i> Tanya Admin
        </a>
      </div>
    </div>`
  }).join('') : `
  <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
    <i class="fas fa-store" style="font-size:48px;margin-bottom:16px;opacity:0.3"></i>
    <p>Belum ada akun game yang tersedia saat ini.</p>
    <p style="font-size:13px">Hubungi admin untuk informasi terbaru.</p>
    <a href="${waLink}" target="_blank" style="display:inline-block;margin-top:16px;padding:10px 24px;background:var(--primary);color:white;border-radius:8px;text-decoration:none">
      <i class="fab fa-whatsapp"></i> Hubungi Admin
    </a>
  </div>`

  const content = `
  <div class="marketplace-page">
    <div class="container">
      <!-- Hero -->
      <div class="marketplace-hero">
        <div class="marketplace-hero-inner">
          <span class="hero-badge-pill">🛒 Marketplace Akun Game</span>
          <h1>Jual Beli Akun Game</h1>
          <p>Temukan akun game impianmu dengan harga terbaik. Order langsung via WhatsApp admin!</p>
        </div>
      </div>

      <!-- Search -->
      <div class="search-section" style="margin-bottom:24px">
        <div class="search-box">
          <input type="text" id="marketSearch" placeholder="Cari akun game...">
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Accounts Grid -->
      <div class="section-header">
        <h2 class="section-title">Akun Game Tersedia</h2>
        <span class="text-muted" style="font-size:13px">${accounts.length} akun tersedia</span>
      </div>
      <div class="market-grid" id="marketGrid">
        ${accountsHTML}
      </div>
    </div>
  </div>

  <script>
    const marketSearch = document.getElementById('marketSearch');
    if (marketSearch) {
      marketSearch.addEventListener('input', function() {
        const q = this.value.toLowerCase();
        document.querySelectorAll('.market-card').forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
      });
    }
  </script>`

  return c.html(getLayout(content, 'Marketplace Akun Game', settings))
})

// ============================
// BANTUAN PAGE
// ============================
app.get('/bantuan', async (c) => {
  const settings = await getSettings(c.env.DB)
  const waLink = settings.wa_link || 'https://wa.me/6285138987769'
  const igLink = settings.instagram_link || '#'
  const fbLink = settings.facebook_link || '#'

  const content = `
  <div class="help-page">
    <div class="container">
      <div class="help-hero">
        <h1><i class="fas fa-headset" style="color:var(--primary)"></i> Pusat Bantuan</h1>
        <p>Ada pertanyaan? Kami siap membantu Anda!</p>
      </div>

      <div class="admin-card" style="margin-bottom:32px">
        <div class="admin-card-header">
          <div class="admin-card-title"><i class="fas fa-list-ol" style="color:var(--primary)"></i> Cara Pemesanan</div>
        </div>
        <div style="padding:24px">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px">
            <div style="text-align:center;padding:20px">
              <div style="width:56px;height:56px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;margin:0 auto 12px">1</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Pilih Game</h4>
              <p style="font-size:13px;color:var(--text-muted)">Pilih game yang ingin di-top up dari halaman utama</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:56px;height:56px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;margin:0 auto 12px">2</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Pilih Nominal</h4>
              <p style="font-size:13px;color:var(--text-muted)">Pilih nominal top up sesuai kebutuhan</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:56px;height:56px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;margin:0 auto 12px">3</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Isi Form</h4>
              <p style="font-size:13px;color:var(--text-muted)">Isi ID Game, Nickname, dan metode pembayaran</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:56px;height:56px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;margin:0 auto 12px">4</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Kirim WA</h4>
              <p style="font-size:13px;color:var(--text-muted)">Klik Beli Sekarang, otomatis terhubung ke admin WhatsApp</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:56px;height:56px;background:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;margin:0 auto 12px">5</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Bayar &amp; Selesai</h4>
              <p style="font-size:13px;color:var(--text-muted)">Lakukan pembayaran &amp; kirim bukti transfer ke admin</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section-header" style="margin-bottom:20px">
        <h2 class="section-title">Pertanyaan Umum (FAQ)</h2>
      </div>
      <div class="faq-grid">
        <div class="faq-item">
          <button class="faq-question">Berapa lama proses top up setelah pembayaran?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Proses top up dilakukan secara manual oleh admin. Biasanya selesai dalam 1-15 menit setelah bukti pembayaran diterima.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Apakah transaksi aman di sini?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Ya, semua transaksi ditangani langsung oleh admin kami. Kami sudah melayani ribuan pelanggan dan terpercaya.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Bagaimana cara melakukan top up?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Pilih game, pilih nominal, isi form dengan ID Game dan Nickname, pilih metode pembayaran, lalu klik Beli Sekarang.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Metode pembayaran apa yang tersedia?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Kami menerima transfer bank (BCA, BRI, Mandiri), dompet digital (Dana, OVO, GoPay), dan Alfamart/Indomaret.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Apakah ada biaya tambahan?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Tidak ada biaya tambahan. Harga yang tertera sudah final.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Bagaimana jika top up tidak masuk?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Jika dalam 30 menit top up belum masuk, segera hubungi admin WhatsApp kami dengan bukti pembayaran.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Apakah bisa refund jika ID salah input?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Kami tidak bisa melakukan refund jika kesalahan karena kesalahan input data oleh pembeli.</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Kapan admin aktif melayani?<i class="fas fa-plus"></i></button>
          <div class="faq-answer"><p>Admin aktif dari jam 08:00 - 22:00 WIB setiap hari.</p></div>
        </div>
      </div>

      <div class="section-header" style="margin-bottom:20px;margin-top:40px">
        <h2 class="section-title">Hubungi Kami</h2>
      </div>
      <div class="contact-cards">
        <a href="${waLink}" target="_blank" class="contact-card">
          <div class="contact-card-icon wa"><i class="fab fa-whatsapp"></i></div>
          <h4>WhatsApp</h4>
          <p>Chat langsung dengan admin</p>
        </a>
        <a href="${igLink}" target="_blank" class="contact-card">
          <div class="contact-card-icon ig"><i class="fab fa-instagram"></i></div>
          <h4>Instagram</h4>
          <p>Follow akun Instagram kami</p>
        </a>
        <a href="${fbLink}" target="_blank" class="contact-card">
          <div class="contact-card-icon fb"><i class="fab fa-facebook"></i></div>
          <h4>Facebook</h4>
          <p>Like halaman Facebook kami</p>
        </a>
      </div>
    </div>
  </div>`

  return c.html(getLayout(content, 'Bantuan', settings))
})

// ============================
// SYARAT & KETENTUAN
// ============================
app.get('/syarat-ketentuan', async (c) => {
  const settings = await getSettings(c.env.DB)
  const siteName = settings.site_title || 'EVOGAME'

  // Baca konten S&K dari DB (bisa diedit admin)
  const skContent = settings.sk_content || `
    <h3 style="color:var(--text-primary);margin-bottom:12px">1. Ketentuan Umum</h3>
    <p>Dengan menggunakan layanan <strong>${siteName}</strong>, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
  `

  const content = `
  <div class="help-page">
    <div class="container">
      <div class="help-hero">
        <h1><i class="fas fa-file-contract" style="color:var(--primary)"></i> Syarat &amp; Ketentuan</h1>
        <p>Harap baca syarat &amp; ketentuan berikut sebelum menggunakan layanan kami.</p>
      </div>
      <div class="admin-card">
        <div style="padding:32px;line-height:1.8;color:var(--text-secondary)">
          ${skContent}
          <div style="margin-top:28px;padding:16px;background:var(--bg-hover);border-radius:8px;font-size:13px;color:var(--text-muted)">
            <i class="fas fa-info-circle" style="color:var(--primary)"></i>
            Dengan melanjutkan penggunaan layanan ${siteName}, Anda dianggap telah menyetujui seluruh syarat dan ketentuan di atas.
          </div>
        </div>
      </div>
    </div>
  </div>`
  return c.html(getLayout(content, 'Syarat & Ketentuan', settings))
})

// ============================
// CEK TRANSAKSI
// ============================
app.get('/cek-transaksi', async (c) => {
  const settings = await getSettings(c.env.DB)
  const waNum = settings.wa_number || '6285138987769'

  // Get active transactions (last N days based on config), censored
  const retentionDays = parseInt(settings.transaction_retention_days || '3')
  const txRes = await c.env.DB.prepare(`
    SELECT * FROM transactions 
    WHERE created_at >= datetime('now', '-${retentionDays} days')
    ORDER BY created_at DESC
    LIMIT 30
  `).all().catch(() => ({ results: [] }))
  const transactions = (txRes.results || []) as any[]

  function censorText(text: string): string {
    if (!text) return '-'
    if (text.length <= 4) return text.substring(0,2) + '***'
    return text.substring(0, Math.min(5, text.length - 4)) + '*'.repeat(Math.max(4, text.length - 5))
  }

  function statusBadge(status: string): string {
    const map: Record<string,string> = {
      'success': '<span style="background:#22c55e;color:white;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">✓ Berhasil</span>',
      'pending': '<span style="background:#f59e0b;color:white;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">⏳ Diproses</span>',
      'processing': '<span style="background:#6366f1;color:white;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">🔄 Processing</span>',
      'failed': '<span style="background:#ef4444;color:white;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">✗ Gagal</span>',
    }
    return map[status] || map['pending']
  }

  const txRows = transactions.length > 0 ? transactions.map(tx => `
    <tr style="border-bottom:1px solid var(--border)">
      <td style="padding:14px 20px;font-family:monospace;font-size:12px;color:var(--primary)">#${censorText(tx.order_id)}</td>
      <td style="padding:14px 20px;font-weight:500">${tx.game_name}</td>
      <td style="padding:14px 20px;font-family:monospace;color:var(--text-muted)">${censorText(tx.game_id)}</td>
      <td style="padding:14px 20px">${tx.product_name || '-'}</td>
      <td style="padding:14px 20px;font-size:12px;color:var(--text-muted)">${tx.payment_method || '-'}</td>
      <td style="padding:14px 20px">${statusBadge(tx.status)}</td>
      <td style="padding:14px 20px;font-size:12px;color:var(--text-muted);white-space:nowrap">${tx.created_at ? tx.created_at.substring(0,16).replace('T',' ') : '-'}</td>
    </tr>`).join('') : `<tr><td colspan="7" style="text-align:center;padding:40px 20px;color:var(--text-muted)"><div style="font-size:36px;margin-bottom:12px;opacity:0.4">📭</div><div>Belum ada data transaksi dalam ${retentionDays} hari terakhir.</div></td></tr>`

  const content = `
  <div class="help-page">
    <div class="container">
      <div class="help-hero">
        <h1><i class="fas fa-search" style="color:var(--primary)"></i> Cek Transaksi</h1>
        <p>Masukkan data order Anda untuk mengecek status pesanan.</p>
      </div>

      <!-- Section 1: Cek Status Transaksi -->
      <div class="admin-card" style="margin-bottom:32px">
        <div class="admin-card-header">
          <div class="admin-card-title"><i class="fas fa-search" style="color:var(--primary)"></i> Cek Status Transaksi</div>
        </div>
        <div style="padding:28px">
          <p style="color:var(--text-muted);margin-bottom:20px;font-size:14px">Isi data order Anda di bawah, lalu klik tombol untuk melihat status transaksi di tabel.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Nama Game <span style="color:var(--danger)">*</span></label>
              <input type="text" id="cekGameName" class="form-control" placeholder="Contoh: Mobile Legends">
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">ID Game / Nomor Order <span style="color:var(--danger)">*</span></label>
              <input type="text" id="cekGameId" class="form-control" placeholder="Masukkan ID Game Anda">
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Nickname (Opsional)</label>
              <input type="text" id="cekNickname" class="form-control" placeholder="Nickname game Anda">
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Nominal / Produk (Opsional)</label>
              <input type="text" id="cekProduct" class="form-control" placeholder="Contoh: 86 Diamonds">
            </div>
          </div>
          <div style="margin-top:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
            <button onclick="scrollKeTable()" style="padding:13px 28px;background:var(--primary);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:15px;display:flex;align-items:center;gap:8px">
              <i class="fas fa-search"></i> Cek Transaksi
            </button>
            <span style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
              <i class="fas fa-info-circle" style="color:#f59e0b"></i>
              Harap <strong style="color:var(--text);margin:0 3px">refresh web</strong> untuk melihat Status Transaksi Anda yang terbaru.
            </span>
          </div>
        </div>
      </div>

      <!-- Section 2: Cara Cek Transaksi -->
      <div class="admin-card" style="margin-bottom:32px">
        <div class="admin-card-header">
          <div class="admin-card-title"><i class="fas fa-list-ol" style="color:var(--primary)"></i> Cara Cek Transaksi</div>
        </div>
        <div style="padding:24px">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px">
            <div style="text-align:center;padding:20px">
              <div style="width:52px;height:52px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;margin:0 auto 12px">1</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Order ke Admin</h4>
              <p style="font-size:13px;color:var(--text-muted)">Lakukan pembelian dan sertakan ID Game yang benar</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:52px;height:52px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;margin:0 auto 12px">2</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Tunggu Sebentar</h4>
              <p style="font-size:13px;color:var(--text-muted)">Admin memproses dan memasukkan data transaksi ke sistem</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:52px;height:52px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;margin:0 auto 12px">3</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Refresh Halaman</h4>
              <p style="font-size:13px;color:var(--text-muted)">Refresh halaman ini, lalu klik tombol Cek Transaksi</p>
            </div>
            <div style="text-align:center;padding:20px">
              <div style="width:52px;height:52px;background:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;margin:0 auto 12px">4</div>
              <h4 style="font-size:14px;font-weight:700;margin-bottom:6px">Lihat Status</h4>
              <p style="font-size:13px;color:var(--text-muted)">Status transaksi Anda tampil di tabel dengan data tersensor</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Tabel Status Transaksi -->
      <!-- Placeholder: muncul kalau belum isi ID Game -->
      <div id="tabelPlaceholder" class="admin-card" style="text-align:center;padding:48px 24px;">
        <div style="font-size:52px;margin-bottom:16px;opacity:0.35">🔍</div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--text)">Isi ID Game Terlebih Dahulu</h3>
        <p style="font-size:13px;color:var(--text-muted);max-width:340px;margin:0 auto">
          Masukkan <strong>Nama Game</strong> dan <strong>ID Game</strong> di form di atas, lalu klik tombol <strong>"Cek Transaksi"</strong> untuk melihat status pesanan Anda.
        </p>
      </div>

      <!-- Tabel: hanya muncul setelah klik Cek Transaksi -->
      <div class="admin-card" id="tabelTransaksi" style="display:none">
        <div class="admin-card-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div class="admin-card-title"><i class="fas fa-table" style="color:var(--primary)"></i> Status Transaksi Terbaru</div>
          <span style="font-size:12px;color:var(--text-muted)">Data ${retentionDays} hari terakhir · Tersensor</span>
        </div>
        <div style="padding:14px 20px;background:rgba(245,158,11,0.08);border-bottom:1px solid rgba(245,158,11,0.2);display:flex;align-items:center;gap:10px;font-size:13px">
          <i class="fas fa-sync-alt" style="color:#f59e0b;flex-shrink:0"></i>
          <span style="color:var(--text-muted)"><strong style="color:var(--text)">Harap refresh halaman</strong> lalu klik Cek Transaksi lagi untuk melihat status terbaru.</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:var(--bg-hover)">
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">ID Order</th>
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">Nama Game</th>
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">ID Game</th>
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">Produk</th>
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">Pembayaran</th>
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">Status</th>
                <th style="padding:14px 20px;text-align:left;color:var(--text-muted);font-weight:600;white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border)">Waktu</th>
              </tr>
            </thead>
            <tbody id="txTableBody">
              ${txRows}
            </tbody>
          </table>
        </div>
        <div style="padding:14px 20px;font-size:12px;color:var(--text-faint);border-top:1px solid var(--border);display:flex;align-items:center;gap:8px">
          <i class="fas fa-shield-alt" style="color:var(--primary);flex-shrink:0"></i>
          <span>Data ditampilkan tersensor untuk keamanan. Hubungi admin via WhatsApp untuk informasi lengkap.</span>
        </div>
      </div>

    </div>
  </div>
  <script>
  function scrollKeTable() {
    var gameName = (document.getElementById('cekGameName').value || '').trim();
    var gameId   = (document.getElementById('cekGameId').value   || '').trim();
    var placeholder = document.getElementById('tabelPlaceholder');
    var tableSection = document.getElementById('tabelTransaksi');
    
    // Wajib isi Nama Game dan ID Game
    if (!gameName || !gameId) {
      // Tampilkan peringatan pada input yang kosong
      var nameInput = document.getElementById('cekGameName');
      var idInput   = document.getElementById('cekGameId');
      if (!gameName) { nameInput.style.borderColor='var(--danger)'; nameInput.focus(); }
      if (!gameId)   { idInput.style.borderColor='var(--danger)'; if(gameName) idInput.focus(); }
      // Reset border setelah 2 detik
      setTimeout(function(){
        nameInput.style.borderColor='';
        idInput.style.borderColor='';
      }, 2000);
      // Tampilkan placeholder peringatan
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.innerHTML = '<div style="font-size:48px;margin-bottom:16px;opacity:0.5">⚠️</div><h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--danger)">Isi Data Terlebih Dahulu!</h3><p style="font-size:13px;color:var(--text-muted);max-width:360px;margin:0 auto">Harap isi <strong>Nama Game</strong> dan <strong>ID Game</strong> di form di atas sebelum mengecek status transaksi.</p>';
        placeholder.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (tableSection) tableSection.style.display = 'none';
      return;
    }
    
    // Data sudah diisi → tampilkan tabel
    if (placeholder) placeholder.style.display = 'none';
    if (tableSection) {
      tableSection.style.display = 'block';
      tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      tableSection.style.transition = 'box-shadow 0.3s';
      tableSection.style.boxShadow = '0 0 0 3px var(--primary)';
      setTimeout(function(){ tableSection.style.boxShadow = ''; }, 1800);
    }
  }
  </script>`
  return c.html(getLayout(content, 'Cek Transaksi', settings))
})

// ============================
// ADMIN LOGIN PAGE
// ============================
app.get('/admin', async (c) => {
  if (isAdmin(c)) return c.redirect('/admin/dashboard')
  const settings = await getSettings(c.env.DB)
  const siteName = settings.site_title || 'EVOGAME'
  const faviconUrl = settings.favicon_url || ''
  let faviconTag = `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">`
  if (faviconUrl) faviconTag = `<link rel="icon" href="${faviconUrl}">`

  return c.html(`<!DOCTYPE html>
<html lang="id" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login - ${siteName}</title>
  ${faviconTag}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body class="dark-theme" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-primary)">
  <div style="width:100%;max-width:400px;padding:24px">
    <div class="admin-card">
      <div style="padding:32px;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">🎮</div>
        <h2 style="font-size:24px;font-weight:700;margin-bottom:4px">${siteName}</h2>
        <p style="color:var(--text-muted);margin-bottom:32px">Dashboard Admin</p>
        
        <form method="POST" action="/admin/login">
          <div class="form-group" style="text-align:left">
            <label class="form-label">Username</label>
            <input type="text" name="username" class="form-control" placeholder="Masukkan username" required>
          </div>
          <div class="form-group" style="text-align:left">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" placeholder="Masukkan password" required>
          </div>
          <button type="submit" class="btn-buy" style="width:100%;margin-top:8px">
            <i class="fas fa-sign-in-alt"></i> Masuk
          </button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>`)
})

app.post('/admin/login', async (c) => {
  const body = await c.req.parseBody()
  const username = body.username as string
  const password = body.password as string

  const user = await c.env.DB.prepare('SELECT * FROM admin_users WHERE username = ? AND password = ?').bind(username, password).first()
  if (user) {
    setCookie(c, 'admin_session', 'authenticated', { path: '/', maxAge: 86400 * 7, httpOnly: true })
    return c.redirect('/admin/dashboard')
  }
  return c.redirect('/admin?error=1')
})

app.get('/admin/logout', (c) => {
  deleteCookie(c, 'admin_session')
  return c.redirect('/admin')
})

// ============================
// ADMIN DASHBOARD
// ============================
app.get('/admin/dashboard', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)

  const gamesCount = (await c.env.DB.prepare('SELECT COUNT(*) as n FROM games').first() as any)?.n || 0
  const productsCount = (await c.env.DB.prepare('SELECT COUNT(*) as n FROM products').first() as any)?.n || 0
  const accountsCount = (await c.env.DB.prepare('SELECT COUNT(*) as n FROM marketplace_accounts').first() as any)?.n || 0
  const txCount = (await c.env.DB.prepare("SELECT COUNT(*) as n FROM transactions WHERE created_at >= datetime('now', '-3 days')").first() as any)?.n || 0

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Dashboard</h1>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;margin-bottom:32px">
      <div class="admin-card" style="padding:24px;text-align:center">
        <div style="font-size:32px;margin-bottom:8px">🎮</div>
        <div style="font-size:28px;font-weight:700;color:var(--primary)">${gamesCount}</div>
        <div style="color:var(--text-muted)">Total Game</div>
      </div>
      <div class="admin-card" style="padding:24px;text-align:center">
        <div style="font-size:32px;margin-bottom:8px">📦</div>
        <div style="font-size:28px;font-weight:700;color:var(--success)">${productsCount}</div>
        <div style="color:var(--text-muted)">Total Produk</div>
      </div>
      <div class="admin-card" style="padding:24px;text-align:center">
        <div style="font-size:32px;margin-bottom:8px">🛒</div>
        <div style="font-size:28px;font-weight:700;color:#f59e0b">${accountsCount}</div>
        <div style="color:var(--text-muted)">Akun Marketplace</div>
      </div>
      <div class="admin-card" style="padding:24px;text-align:center">
        <div style="font-size:32px;margin-bottom:8px">📋</div>
        <div style="font-size:28px;font-weight:700;color:#06b6d4">${txCount}</div>
        <div style="color:var(--text-muted)">Transaksi (3hr)</div>
      </div>
    </div>
    <div class="admin-card" style="padding:24px">
      <h3 style="margin-bottom:16px">Menu Cepat</h3>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <a href="/admin/games" class="btn-buy" style="text-decoration:none;padding:10px 20px"><i class="fas fa-gamepad"></i> Kelola Game</a>
        <a href="/admin/transactions" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:#06b6d4"><i class="fas fa-receipt"></i> Kelola Transaksi</a>
        <a href="/admin/marketplace" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:var(--success)"><i class="fas fa-store"></i> Marketplace</a>
        <a href="/admin/reviews" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:#f59e0b"><i class="fas fa-star"></i> Ulasan</a>
        <a href="/admin/liveorders" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:#8b5cf6"><i class="fas fa-bolt"></i> Live Order</a>
        <a href="/admin/sk" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:#0891b2"><i class="fas fa-file-contract"></i> S&amp;K</a>
        <a href="/admin/settings" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:#6366f1"><i class="fas fa-cog"></i> Pengaturan</a>
        <a href="/admin/popup" class="btn-buy" style="text-decoration:none;padding:10px 20px;background:#ec4899"><i class="fas fa-bell"></i> Popup</a>
      </div>
    </div>
  `, 'Dashboard', settings))
})

// ============================
// ADMIN GAMES LIST
// ============================
app.get('/admin/games', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const gamesRes = await c.env.DB.prepare('SELECT * FROM games ORDER BY sort_order ASC, id ASC').all()
  const games = gamesRes.results as any[]

  const rows = games.map(g => {
    const statusBadge = g.status === 'active'
      ? '<span style="color:#22c55e;font-weight:600">● Aktif</span>'
      : g.status === 'gangguan'
        ? '<span style="color:#ef4444;font-weight:600">⚠ Gangguan</span>'
        : '<span style="color:#f59e0b;font-weight:600">○ Offline</span>'
    return `
    <tr>
      <td><img src="${g.image_url}" style="width:40px;height:40px;object-fit:cover;border-radius:8px"></td>
      <td><strong>${g.name}</strong><br><span style="font-size:12px;color:var(--text-muted)">${g.slug}</span></td>
      <td>${g.category}</td>
      <td>${statusBadge}</td>
      <td>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a href="/admin/games/${g.id}/products" style="padding:6px 12px;background:var(--primary);color:white;border-radius:6px;text-decoration:none;font-size:13px"><i class="fas fa-box"></i> Produk</a>
          <a href="/admin/games/${g.id}/edit" style="padding:6px 12px;background:#6366f1;color:white;border-radius:6px;text-decoration:none;font-size:13px"><i class="fas fa-edit"></i> Edit</a>
          <button onclick="toggleGameStatus(${g.id}, '${g.status}')" style="padding:6px 12px;background:${g.status === 'active' ? '#ef4444' : '#22c55e'};color:white;border-radius:6px;border:none;cursor:pointer;font-size:13px">
            ${g.status === 'active' ? '<i class="fas fa-pause"></i> Nonaktif' : '<i class="fas fa-play"></i> Aktifkan'}
          </button>
          <button onclick="setGangguan(${g.id}, '${g.status}')" style="padding:6px 12px;background:${g.status === 'gangguan' ? '#6b7280' : '#f59e0b'};color:white;border-radius:6px;border:none;cursor:pointer;font-size:13px">
            ${g.status === 'gangguan' ? '<i class="fas fa-check"></i> Normal' : '<i class="fas fa-exclamation-triangle"></i> Gangguan'}
          </button>
        </div>
      </td>
    </tr>`
  }).join('')

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Kelola Game</h1>
      <a href="/admin/games/add" class="btn-buy" style="text-decoration:none;padding:10px 20px"><i class="fas fa-plus"></i> Tambah Game</a>
    </div>
    <div class="admin-card">
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Gambar</th><th>Nama</th><th>Kategori</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
    <script>
    async function toggleGameStatus(id, current) {
      const newStatus = current === 'active' ? 'inactive' : 'active';
      const r = await fetch('/api/admin/games/' + id + '/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: newStatus })
      });
      const d = await r.json();
      if (d.success) { showToast('Status berhasil diubah!', 'success'); setTimeout(() => location.reload(), 800); }
      else showToast('Gagal mengubah status!', 'error');
    }
    async function setGangguan(id, current) {
      const newStatus = current === 'gangguan' ? 'active' : 'gangguan';
      const r = await fetch('/api/admin/games/' + id + '/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: newStatus })
      });
      const d = await r.json();
      if (d.success) { showToast('Status berhasil diubah!', 'success'); setTimeout(() => location.reload(), 800); }
      else showToast('Gagal mengubah status!', 'error');
    }
    </script>
  `, 'Kelola Game', settings))
})

// ADMIN GAME ADD FORM
app.get('/admin/games/add', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Tambah Game</h1>
      <a href="/admin/games" style="padding:10px 20px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);border-radius:8px;text-decoration:none">← Kembali</a>
    </div>
    <div class="admin-card" style="padding:32px">
      <form method="POST" action="/admin/games/add">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="form-group">
            <label class="form-label">Nama Game *</label>
            <input type="text" name="name" class="form-control" required placeholder="Mobile Legends">
          </div>
          <div class="form-group">
            <label class="form-label">Slug (URL) *</label>
            <input type="text" name="slug" class="form-control" required placeholder="mobile-legends">
          </div>
          <div class="form-group">
            <label class="form-label">Kategori *</label>
            <select name="category" class="form-control">
              <option value="topup-game">Top Up Game</option>
              <option value="voucher-aplikasi">Voucher & Aplikasi</option>
              <option value="pulsa-data">Pulsa & Paket Data</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
              <option value="active">Aktif</option>
              <option value="inactive">Offline</option>
              <option value="gangguan">Gangguan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Badge</label>
            <input type="text" name="badge" class="form-control" placeholder="Flash / Hot (kosongkan jika tidak ada)">
          </div>
          <div class="form-group">
            <label class="form-label">No WA Admin (opsional)</label>
            <input type="text" name="wa_number" class="form-control" placeholder="628xxx (default pakai setting global)">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Upload Logo/Gambar Game *</label>
          <input type="file" name="image_file" class="form-control" accept="image/*" id="imageFile" onchange="previewImg(this,'imgPreview')">
          <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">Atau masukkan URL gambar:</div>
          <input type="text" name="image_url" class="form-control" placeholder="https://..." style="margin-top:6px" id="imageUrl">
          <img id="imgPreview" src="" style="display:none;margin-top:10px;max-width:120px;border-radius:8px">
        </div>
        <div class="form-group">
          <label class="form-label">Upload Banner Game (Opsional)</label>
          <input type="file" name="banner_file" class="form-control" accept="image/*" id="bannerFile" onchange="previewImg(this,'bannerPreview')">
          <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">Atau masukkan URL banner:</div>
          <input type="text" name="banner_url" class="form-control" placeholder="https://..." style="margin-top:6px">
          <img id="bannerPreview" src="" style="display:none;margin-top:10px;max-width:100%;border-radius:8px">
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi</label>
          <textarea name="description" class="form-control" rows="3" placeholder="Deskripsi cara menemukan ID game..."></textarea>
        </div>
        <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan Game</button>
      </form>
    </div>
    ${uploadPreviewScript()}
  `, 'Tambah Game', settings))
})

app.post('/admin/games/add', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  
  let imageUrl = body.image_url as string || ''
  let bannerUrl = body.banner_url as string || ''
  
  // Handle file upload via base64 if file provided
  const imageFile = body.image_file as File
  const bannerFile = body.banner_file as File
  
  if (imageFile && imageFile.size > 0) {
    const base64 = await fileToBase64(imageFile)
    imageUrl = `data:${imageFile.type};base64,${base64}`
  }
  if (bannerFile && bannerFile.size > 0) {
    const base64 = await fileToBase64(bannerFile)
    bannerUrl = `data:${bannerFile.type};base64,${base64}`
  }

  await c.env.DB.prepare(`
    INSERT INTO games (name, slug, category, image_url, banner_url, description, wa_number, status, badge, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).bind(
    body.name, body.slug, body.category, imageUrl, bannerUrl,
    body.description || '', body.wa_number || '', body.status || 'active',
    body.badge || null
  ).run()

  return c.redirect('/admin/games')
})

// ADMIN GAME EDIT
app.get('/admin/games/:id/edit', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const game = await c.env.DB.prepare('SELECT * FROM games WHERE id = ?').bind(c.req.param('id')).first() as any
  if (!game) return c.redirect('/admin/games')

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Edit Game: ${game.name}</h1>
      <a href="/admin/games" style="padding:10px 20px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);border-radius:8px;text-decoration:none">← Kembali</a>
    </div>
    <div class="admin-card" style="padding:32px">
      <form method="POST" action="/admin/games/${game.id}/edit">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="form-group">
            <label class="form-label">Nama Game *</label>
            <input type="text" name="name" class="form-control" value="${game.name}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Slug (URL) *</label>
            <input type="text" name="slug" class="form-control" value="${game.slug}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select name="category" class="form-control">
              <option value="topup-game" ${game.category === 'topup-game' ? 'selected' : ''}>Top Up Game</option>
              <option value="voucher-aplikasi" ${game.category === 'voucher-aplikasi' ? 'selected' : ''}>Voucher & Aplikasi</option>
              <option value="pulsa-data" ${game.category === 'pulsa-data' ? 'selected' : ''}>Pulsa & Paket Data</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
              <option value="active" ${game.status === 'active' ? 'selected' : ''}>Aktif</option>
              <option value="inactive" ${game.status === 'inactive' ? 'selected' : ''}>Offline</option>
              <option value="gangguan" ${game.status === 'gangguan' ? 'selected' : ''}>Gangguan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Badge</label>
            <input type="text" name="badge" class="form-control" value="${game.badge || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">No WA Admin</label>
            <input type="text" name="wa_number" class="form-control" value="${game.wa_number || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Upload Logo/Gambar Baru</label>
          <input type="file" name="image_file" class="form-control" accept="image/*" onchange="previewImg(this,'imgPreview')">
          ${game.image_url ? `<img id="imgPreview" src="${game.image_url.startsWith('data:') ? game.image_url : game.image_url}" style="margin-top:10px;max-width:120px;border-radius:8px">` : '<img id="imgPreview" src="" style="display:none;max-width:120px;border-radius:8px">'}
          <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">Atau ganti URL:</div>
          <input type="text" name="image_url" class="form-control" value="${game.image_url?.startsWith('data:') ? '' : game.image_url || ''}" style="margin-top:6px">
        </div>
        <div class="form-group">
          <label class="form-label">Upload Banner Baru (Opsional)</label>
          <input type="file" name="banner_file" class="form-control" accept="image/*" onchange="previewImg(this,'bannerPreview')">
          ${game.banner_url ? `<img id="bannerPreview" src="${game.banner_url.startsWith('data:') ? game.banner_url : game.banner_url}" style="margin-top:10px;max-width:100%;max-height:150px;object-fit:cover;border-radius:8px">` : '<img id="bannerPreview" src="" style="display:none;max-width:100%;border-radius:8px">'}
          <input type="text" name="banner_url" class="form-control" value="${game.banner_url?.startsWith('data:') ? '' : game.banner_url || ''}" style="margin-top:6px" placeholder="URL banner">
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi</label>
          <textarea name="description" class="form-control" rows="3">${game.description || ''}</textarea>
        </div>
        <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan Perubahan</button>
      </form>
    </div>
    ${uploadPreviewScript()}
  `, `Edit ${game.name}`, settings))
})

app.post('/admin/games/:id/edit', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const id = c.req.param('id')
  const body = await c.req.parseBody()
  const game = await c.env.DB.prepare('SELECT * FROM games WHERE id = ?').bind(id).first() as any

  let imageUrl = body.image_url as string || game.image_url
  let bannerUrl = body.banner_url as string || game.banner_url

  const imageFile = body.image_file as File
  const bannerFile = body.banner_file as File

  if (imageFile && imageFile.size > 0) {
    imageUrl = `data:${imageFile.type};base64,${await fileToBase64(imageFile)}`
  }
  if (bannerFile && bannerFile.size > 0) {
    bannerUrl = `data:${bannerFile.type};base64,${await fileToBase64(bannerFile)}`
  }

  await c.env.DB.prepare(`
    UPDATE games SET name=?, slug=?, category=?, image_url=?, banner_url=?, description=?, wa_number=?, status=?, badge=?
    WHERE id=?
  `).bind(body.name, body.slug, body.category, imageUrl, bannerUrl, body.description || '', body.wa_number || '', body.status || 'active', body.badge || null, id).run()

  return c.redirect('/admin/games')
})

// ============================
// ADMIN PRODUCTS
// ============================
app.get('/admin/games/:id/products', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const gameId = c.req.param('id')
  const game = await c.env.DB.prepare('SELECT * FROM games WHERE id = ?').bind(gameId).first() as any
  if (!game) return c.redirect('/admin/games')

  const productsRes = await c.env.DB.prepare('SELECT * FROM products WHERE game_id = ? ORDER BY sort_order ASC, price ASC').bind(gameId).all()
  const products = productsRes.results as any[]

  const rows = products.map(p => {
    const statusBadge = p.status === 'active'
      ? '<span style="color:#22c55e">● Aktif</span>'
      : '<span style="color:#ef4444">⚠ Gangguan</span>'
    return `
    <tr>
      <td>${p.name}</td>
      <td>${formatRupiah(p.price)}</td>
      <td>${p.original_price ? formatRupiah(p.original_price) : '-'}</td>
      <td>${p.is_flash_sale ? '⚡ Ya' : '-'}</td>
      <td>${statusBadge}</td>
      <td>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button onclick="editProduct(${p.id},'${p.name.replace(/'/g,"\\'")}',${p.price},${p.original_price||0},${p.is_flash_sale})" style="padding:6px 10px;background:#6366f1;color:white;border-radius:6px;border:none;cursor:pointer;font-size:12px"><i class="fas fa-edit"></i> Edit</button>
          <button onclick="toggleProductStatus(${p.id},'${p.status}')" style="padding:6px 10px;background:${p.status === 'active' ? '#ef4444' : '#22c55e'};color:white;border-radius:6px;border:none;cursor:pointer;font-size:12px">
            ${p.status === 'active' ? '⚠ Gangguan' : '✓ Aktifkan'}
          </button>
          <button onclick="confirmDelete('/api/admin/products/${p.id}','${p.name.replace(/'/g,"\\'")}','product')" style="padding:6px 10px;background:#dc2626;color:white;border-radius:6px;border:none;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`
  }).join('')

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Produk: ${game.name}</h1>
      <div style="display:flex;gap:8px">
        <a href="/admin/games" style="padding:10px 20px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);border-radius:8px;text-decoration:none">← Kembali</a>
        <button onclick="openModal('addProductModal')" class="btn-buy" style="padding:10px 20px"><i class="fas fa-plus"></i> Tambah Produk</button>
      </div>
    </div>
    <div class="admin-card">
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Nama Produk</th><th>Harga</th><th>Harga Asli</th><th>Flash Sale</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div class="modal-overlay" id="addProductModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Tambah Produk</h3>
          <button onclick="closeModal('addProductModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button>
        </div>
        <form method="POST" action="/admin/games/${gameId}/products/add">
          <div class="form-group">
            <label class="form-label">Nama Produk *</label>
            <input type="text" name="name" class="form-control" required placeholder="100 Diamonds">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label class="form-label">Harga (IDR) *</label>
              <input type="number" name="price" class="form-control" required placeholder="50000">
            </div>
            <div class="form-group">
              <label class="form-label">Harga Asli (IDR)</label>
              <input type="number" name="original_price" class="form-control" placeholder="55000">
            </div>
          </div>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" name="is_flash_sale" value="1" style="width:16px;height:16px">
              <span class="form-label" style="margin:0">Flash Sale</span>
            </label>
          </div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div class="modal-overlay" id="editProductModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Edit Produk</h3>
          <button onclick="closeModal('editProductModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button>
        </div>
        <form id="editProductForm" method="POST">
          <input type="hidden" name="_method" value="PUT">
          <div class="form-group">
            <label class="form-label">Nama Produk *</label>
            <input type="text" name="name" id="editProductName" class="form-control" required>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label class="form-label">Harga (IDR) *</label>
              <input type="number" name="price" id="editProductPrice" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label">Harga Asli</label>
              <input type="number" name="original_price" id="editProductOrigPrice" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" name="is_flash_sale" id="editFlashSale" value="1" style="width:16px;height:16px">
              <span class="form-label" style="margin:0">Flash Sale</span>
            </label>
          </div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <script>
    function editProduct(id, name, price, origPrice, isFlash) {
      document.getElementById('editProductName').value = name;
      document.getElementById('editProductPrice').value = price;
      document.getElementById('editProductOrigPrice').value = origPrice;
      document.getElementById('editFlashSale').checked = isFlash == 1;
      document.getElementById('editProductForm').action = '/admin/products/' + id + '/edit';
      openModal('editProductModal');
    }
    async function toggleProductStatus(id, current) {
      const newStatus = current === 'active' ? 'gangguan' : 'active';
      const r = await fetch('/api/admin/products/' + id + '/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: newStatus })
      });
      const d = await r.json();
      if (d.success) { showToast('Status produk diubah!', 'success'); setTimeout(() => location.reload(), 800); }
      else showToast('Gagal!', 'error');
    }
    function confirmDelete(url, name, type) {
      if (confirm('Yakin ingin menghapus "' + name + '"?')) {
        fetch(url, { method: 'DELETE' })
          .then(r => r.json())
          .then(d => {
            if (d.success) { showToast('Berhasil dihapus!', 'success'); setTimeout(() => location.reload(), 800); }
            else showToast('Gagal menghapus!', 'error');
          });
      }
    }
    </script>
  `, `Produk ${game.name}`, settings))
})

app.post('/admin/games/:id/products/add', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const gameId = c.req.param('id')
  const body = await c.req.parseBody()
  const isFlash = body.is_flash_sale ? 1 : 0

  const result = await c.env.DB.prepare(`
    INSERT INTO products (game_id, name, price, original_price, is_flash_sale, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `).bind(gameId, body.name, body.price, body.original_price || null, isFlash).run()

  // If flash sale, add to flash_sales table
  if (isFlash && result.meta?.last_row_id) {
    await c.env.DB.prepare('INSERT INTO flash_sales (product_id, game_id) VALUES (?, ?)').bind(result.meta.last_row_id, gameId).run()
  }

  return c.redirect(`/admin/games/${gameId}/products`)
})

app.post('/admin/products/:id/edit', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const id = c.req.param('id')
  const body = await c.req.parseBody()
  const isFlash = body.is_flash_sale ? 1 : 0
  const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first() as any

  await c.env.DB.prepare(`
    UPDATE products SET name=?, price=?, original_price=?, is_flash_sale=? WHERE id=?
  `).bind(body.name, body.price, body.original_price || null, isFlash, id).run()

  // Handle flash sale
  await c.env.DB.prepare('DELETE FROM flash_sales WHERE product_id = ?').bind(id).run()
  if (isFlash && product) {
    await c.env.DB.prepare('INSERT INTO flash_sales (product_id, game_id) VALUES (?, ?)').bind(id, product.game_id).run()
  }

  return c.redirect(`/admin/games/${product?.game_id}/products`)
})

// ============================
// ADMIN MARKETPLACE
// ============================
app.get('/admin/marketplace', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const accountsRes = await c.env.DB.prepare('SELECT * FROM marketplace_accounts ORDER BY sort_order ASC, id DESC').all()
  const accounts = accountsRes.results as any[]

  const rows = accounts.map(acc => `
    <tr>
      <td>${acc.image_url ? `<img src="${acc.image_url.startsWith('data:') ? acc.image_url : acc.image_url}" style="width:50px;height:50px;object-fit:cover;border-radius:8px">` : '-'}</td>
      <td><strong>${acc.game_name}</strong></td>
      <td>${acc.title}</td>
      <td>${formatRupiah(acc.price)}</td>
      <td>${acc.status === 'active' ? '<span style="color:#22c55e">● Aktif</span>' : '<span style="color:#ef4444">○ Nonaktif</span>'}</td>
      <td>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button onclick="editAccount(${acc.id})" style="padding:6px 10px;background:#6366f1;color:white;border-radius:6px;border:none;cursor:pointer;font-size:12px"><i class="fas fa-edit"></i> Edit</button>
          <button onclick="toggleAccountStatus(${acc.id},'${acc.status}')" style="padding:6px 10px;background:${acc.status === 'active' ? '#ef4444' : '#22c55e'};color:white;border-radius:6px;border:none;cursor:pointer;font-size:12px">
            ${acc.status === 'active' ? 'Nonaktif' : 'Aktifkan'}
          </button>
          <button onclick="deleteAccount(${acc.id})" style="padding:6px 10px;background:#dc2626;color:white;border-radius:6px;border:none;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('')

  const accountsJson = JSON.stringify(accounts)

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Kelola Marketplace</h1>
      <button onclick="openModal('addAccountModal')" class="btn-buy" style="padding:10px 20px"><i class="fas fa-plus"></i> Tambah Akun</button>
    </div>
    <div class="admin-card">
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Gambar</th><th>Game</th><th>Judul</th><th>Harga</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <!-- Add Account Modal -->
    <div class="modal-overlay" id="addAccountModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Tambah Akun Game</h3>
          <button onclick="closeModal('addAccountModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button>
        </div>
        <form method="POST" action="/admin/marketplace/add">
          <div class="form-group">
            <label class="form-label">Nama Game *</label>
            <input type="text" name="game_name" class="form-control" required placeholder="Mobile Legends">
          </div>
          <div class="form-group">
            <label class="form-label">Judul Akun *</label>
            <input type="text" name="title" class="form-control" required placeholder="Akun ML Legend III + 5000 Diamonds">
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi</label>
            <textarea name="description" class="form-control" rows="3" placeholder="Detail akun, rank, hero, dll..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Harga (IDR) *</label>
            <input type="number" name="price" class="form-control" required placeholder="500000">
          </div>
          <div class="form-group">
            <label class="form-label">Upload Gambar Akun</label>
            <input type="file" name="image_file" class="form-control" accept="image/*" onchange="previewImg(this,'addAccImgPreview')">
            <img id="addAccImgPreview" src="" style="display:none;margin-top:10px;max-width:200px;border-radius:8px">
            <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">Atau URL gambar:</div>
            <input type="text" name="image_url" class="form-control" placeholder="https://..." style="margin-top:6px">
          </div>
          <div class="form-group">
            <label class="form-label">Badge (opsional)</label>
            <input type="text" name="badge" class="form-control" placeholder="New / Hot / Sale">
          </div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <!-- Edit Account Modal -->
    <div class="modal-overlay" id="editAccountModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Edit Akun Game</h3>
          <button onclick="closeModal('editAccountModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button>
        </div>
        <form id="editAccountForm" method="POST">
          <div class="form-group">
            <label class="form-label">Nama Game *</label>
            <input type="text" name="game_name" id="editAccGame" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Judul Akun *</label>
            <input type="text" name="title" id="editAccTitle" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi</label>
            <textarea name="description" id="editAccDesc" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Harga (IDR) *</label>
            <input type="number" name="price" id="editAccPrice" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Upload Gambar Baru</label>
            <input type="file" name="image_file" class="form-control" accept="image/*" onchange="previewImg(this,'editAccImgPreview')">
            <img id="editAccImgPreview" src="" style="display:none;margin-top:10px;max-width:200px;border-radius:8px">
            <input type="text" name="image_url" id="editAccImgUrl" class="form-control" style="margin-top:6px" placeholder="URL gambar">
          </div>
          <div class="form-group">
            <label class="form-label">Badge</label>
            <input type="text" name="badge" id="editAccBadge" class="form-control">
          </div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <script>
    const _accounts = ${accountsJson};
    function editAccount(id) {
      const acc = _accounts.find(a => a.id === id);
      if (!acc) return;
      document.getElementById('editAccGame').value = acc.game_name;
      document.getElementById('editAccTitle').value = acc.title;
      document.getElementById('editAccDesc').value = acc.description || '';
      document.getElementById('editAccPrice').value = acc.price;
      document.getElementById('editAccImgUrl').value = !acc.image_url?.startsWith('data:') ? (acc.image_url || '') : '';
      const preview = document.getElementById('editAccImgPreview');
      if (acc.image_url) { preview.src = acc.image_url; preview.style.display = 'block'; }
      document.getElementById('editAccBadge').value = acc.badge || '';
      document.getElementById('editAccountForm').action = '/admin/marketplace/' + id + '/edit';
      openModal('editAccountModal');
    }
    async function toggleAccountStatus(id, current) {
      const newStatus = current === 'active' ? 'inactive' : 'active';
      const r = await fetch('/api/admin/marketplace/' + id + '/status', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ status: newStatus })
      });
      const d = await r.json();
      if (d.success) { showToast('Status diubah!', 'success'); setTimeout(() => location.reload(), 800); }
    }
    async function deleteAccount(id) {
      if (!confirm('Hapus akun ini?')) return;
      const r = await fetch('/api/admin/marketplace/' + id, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { showToast('Berhasil dihapus!', 'success'); setTimeout(() => location.reload(), 800); }
    }
    </script>
    ${uploadPreviewScript()}
  `, 'Kelola Marketplace', settings))
})

app.post('/admin/marketplace/add', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  let imageUrl = body.image_url as string || ''
  const imageFile = body.image_file as File
  if (imageFile && imageFile.size > 0) {
    imageUrl = `data:${imageFile.type};base64,${await fileToBase64(imageFile)}`
  }
  await c.env.DB.prepare(`
    INSERT INTO marketplace_accounts (game_name, title, description, price, image_url, badge, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `).bind(body.game_name, body.title, body.description || '', body.price, imageUrl, body.badge || null).run()
  return c.redirect('/admin/marketplace')
})

app.post('/admin/marketplace/:id/edit', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const id = c.req.param('id')
  const body = await c.req.parseBody()
  const acc = await c.env.DB.prepare('SELECT * FROM marketplace_accounts WHERE id = ?').bind(id).first() as any
  let imageUrl = body.image_url as string || acc?.image_url || ''
  const imageFile = body.image_file as File
  if (imageFile && imageFile.size > 0) {
    imageUrl = `data:${imageFile.type};base64,${await fileToBase64(imageFile)}`
  }
  await c.env.DB.prepare(`
    UPDATE marketplace_accounts SET game_name=?, title=?, description=?, price=?, image_url=?, badge=? WHERE id=?
  `).bind(body.game_name, body.title, body.description || '', body.price, imageUrl, body.badge || null, id).run()
  return c.redirect('/admin/marketplace')
})

// ============================
// ADMIN SETTINGS
// ============================
app.get('/admin/settings', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Pengaturan Website</h1>
    </div>
    <div class="admin-card" style="padding:32px">
      <form method="POST" action="/admin/settings" enctype="multipart/form-data">
        <h3 style="margin-bottom:20px;color:var(--primary)">🎨 Branding & Hero Section</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="form-group">
            <label class="form-label">Nama Website / Brand</label>
            <input type="text" name="site_title" class="form-control" value="${settings.site_title || 'EVOGAME'}">
          </div>
          <div class="form-group">
            <label class="form-label">Judul Hero (di atas produk)</label>
            <input type="text" name="hero_title" class="form-control" value="${settings.hero_title || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Sub-judul Hero</label>
            <input type="text" name="hero_subtitle" class="form-control" value="${settings.hero_subtitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Badge Pill Hero (misal: 🎮 EvoGame Store)</label>
            <input type="text" name="hero_badge_text" class="form-control" value="${settings.hero_badge_text || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Teks Tombol CTA</label>
            <input type="text" name="hero_cta_text" class="form-control" value="${settings.hero_cta_text || ''}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Deskripsi Website</label>
          <textarea name="site_description" class="form-control" rows="2">${settings.site_description || ''}</textarea>
        </div>

        <h3 style="margin:24px 0 20px;color:var(--primary)">🖼️ Logo & Favicon</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="form-group">
            <label class="form-label">Upload Logo</label>
            <input type="file" name="logo_file" class="form-control" accept="image/*" onchange="previewImg(this,'logoPreview')">
            ${settings.logo_url ? `<img id="logoPreview" src="${settings.logo_url}" style="margin-top:10px;max-height:60px;border-radius:8px">` : '<img id="logoPreview" src="" style="display:none;max-height:60px;border-radius:8px">'}
            <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">Atau URL logo:</div>
            <input type="text" name="logo_url" class="form-control" value="${settings.logo_url?.startsWith('data:') ? '' : settings.logo_url || ''}" style="margin-top:6px" placeholder="https://...">
            <div style="font-size:11px;color:var(--text-faint);margin-top:4px">Kosongkan untuk menggunakan ikon bawaan</div>
          </div>
          <div class="form-group">
            <label class="form-label">Upload Favicon (.ico / .png)</label>
            <input type="file" name="favicon_file" class="form-control" accept="image/*,.ico" onchange="previewImg(this,'faviconPreview')">
            ${settings.favicon_url ? `<img id="faviconPreview" src="${settings.favicon_url}" style="margin-top:10px;max-height:32px;border-radius:4px">` : '<img id="faviconPreview" src="" style="display:none;max-height:32px;border-radius:4px">'}
            <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">Atau URL favicon:</div>
            <input type="text" name="favicon_url" class="form-control" value="${settings.favicon_url?.startsWith('data:') ? '' : settings.favicon_url || ''}" style="margin-top:6px" placeholder="https://...">
          </div>
        </div>

        <h3 style="margin:24px 0 20px;color:var(--primary)">📱 Kontak & Media Sosial</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="form-group">
            <label class="form-label">No WhatsApp Admin</label>
            <input type="text" name="wa_number" class="form-control" value="${settings.wa_number || ''}" placeholder="6285138987769">
          </div>
          <div class="form-group">
            <label class="form-label">Link WhatsApp</label>
            <input type="text" name="wa_link" class="form-control" value="${settings.wa_link || ''}" placeholder="https://wa.me/6285138987769">
          </div>
          <div class="form-group">
            <label class="form-label">Link Instagram</label>
            <input type="text" name="instagram_link" class="form-control" value="${settings.instagram_link || ''}" placeholder="https://instagram.com/...">
          </div>
          <div class="form-group">
            <label class="form-label">Link Facebook</label>
            <input type="text" name="facebook_link" class="form-control" value="${settings.facebook_link || ''}" placeholder="https://facebook.com/...">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="text" name="email" class="form-control" value="${settings.email || ''}" placeholder="admin@evogame.id">
          </div>
          <div class="form-group">
            <label class="form-label">Retensi Data Transaksi (hari)</label>
            <input type="number" name="transaction_retention_days" class="form-control" value="${settings.transaction_retention_days || '3'}" min="1" max="30" placeholder="3">
            <div style="font-size:11px;color:var(--text-faint);margin-top:4px">Data transaksi di halaman Cek Transaksi publik akan ditampilkan selama N hari ini</div>
          </div>
        </div>

        <h3 style="margin:24px 0 20px;color:var(--primary)">🔐 Keamanan Admin</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="form-group">
            <label class="form-label">Username Admin Baru</label>
            <input type="text" name="admin_username" class="form-control" placeholder="Kosongkan jika tidak ingin ubah">
          </div>
          <div class="form-group">
            <label class="form-label">Password Admin Baru</label>
            <input type="password" name="admin_password" class="form-control" placeholder="Kosongkan jika tidak ingin ubah">
          </div>
        </div>

        <button type="submit" class="btn-buy" style="width:100%;margin-top:16px"><i class="fas fa-save"></i> Simpan Semua Pengaturan</button>
      </form>
    </div>
    ${uploadPreviewScript()}
  `, 'Pengaturan', settings))
})

app.post('/admin/settings', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()

  const fields = ['site_title','hero_title','hero_subtitle','hero_badge_text','hero_cta_text','site_description',
    'wa_number','wa_link','instagram_link','facebook_link','email','transaction_retention_days']

  // Handle logo upload
  let logoUrl = body.logo_url as string || ''
  const logoFile = body.logo_file as File
  if (logoFile && logoFile.size > 0) {
    logoUrl = `data:${logoFile.type};base64,${await fileToBase64(logoFile)}`
  }

  let faviconUrl = body.favicon_url as string || ''
  const faviconFile = body.favicon_file as File
  if (faviconFile && faviconFile.size > 0) {
    faviconUrl = `data:${faviconFile.type};base64,${await fileToBase64(faviconFile)}`
  }

  for (const field of fields) {
    const val = body[field] as string || ''
    await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(field, val).run()
  }

  if (logoUrl) await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind('logo_url', logoUrl).run()
  if (faviconUrl) await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind('favicon_url', faviconUrl).run()

  // Update admin credentials
  const newUser = body.admin_username as string
  const newPass = body.admin_password as string
  if (newUser && newPass) {
    await c.env.DB.prepare('UPDATE admin_users SET username=?, password=? WHERE id=1').bind(newUser, newPass).run()
  }

  return c.redirect('/admin/settings?saved=1')
})

// ============================
// ADMIN POPUP SETTINGS
// ============================
app.get('/admin/popup', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const popup = await c.env.DB.prepare('SELECT * FROM popup_settings LIMIT 1').first() as any

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1>Pengaturan Pop-up</h1>
    </div>
    <div class="admin-card" style="padding:32px">
      <form method="POST" action="/admin/popup">
        <div class="form-group">
          <label class="form-label">Judul Pop-up</label>
          <input type="text" name="title" class="form-control" value="${popup?.title || ''}" placeholder="Selamat Datang! 🎮">
        </div>
        <div class="form-group">
          <label class="form-label">Isi Pesan Pop-up</label>
          <textarea name="content" class="form-control" rows="4" placeholder="Tulis pesan promosi atau pengumuman...">${popup?.content || ''}</textarea>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
            <input type="checkbox" name="is_active" value="1" ${popup?.is_active ? 'checked' : ''} style="width:18px;height:18px">
            <span class="form-label" style="margin:0">Aktifkan Pop-up (tampil untuk pengunjung baru)</span>
          </label>
        </div>
        <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan Pop-up</button>
      </form>
    </div>
    <div class="admin-card" style="padding:24px;margin-top:20px">
      <h3 style="margin-bottom:12px">Preview Pop-up</h3>
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:24px;max-width:400px;text-align:center">
        <div style="font-size:40px;margin-bottom:12px">🎮</div>
        <h3 id="popupTitlePreview" style="margin-bottom:8px">${popup?.title || 'Judul Pop-up'}</h3>
        <p id="popupContentPreview" style="color:var(--text-muted);font-size:14px">${popup?.content || 'Isi pesan pop-up'}</p>
        <button style="margin-top:16px;padding:10px 24px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer">Mulai Belanja!</button>
      </div>
    </div>
    <script>
    document.querySelector('[name="title"]').addEventListener('input', function() {
      document.getElementById('popupTitlePreview').textContent = this.value || 'Judul Pop-up';
    });
    document.querySelector('[name="content"]').addEventListener('input', function() {
      document.getElementById('popupContentPreview').textContent = this.value || 'Isi pesan pop-up';
    });
    </script>
  `, 'Pengaturan Pop-up', settings))
})

app.post('/admin/popup', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  const isActive = body.is_active ? 1 : 0

  const existing = await c.env.DB.prepare('SELECT id FROM popup_settings LIMIT 1').first() as any
  if (existing) {
    await c.env.DB.prepare('UPDATE popup_settings SET title=?, content=?, is_active=? WHERE id=?')
      .bind(body.title, body.content, isActive, existing.id).run()
  } else {
    await c.env.DB.prepare('INSERT INTO popup_settings (title, content, is_active) VALUES (?, ?, ?)')
      .bind(body.title, body.content, isActive).run()
  }
  return c.redirect('/admin/popup?saved=1')
})

// ============================
// ADMIN SYARAT & KETENTUAN
// ============================
app.get('/admin/sk', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const saved = c.req.query('saved')

  // Escape untuk aman di dalam value textarea HTML
  const skRaw = settings.sk_content || ''

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1><i class="fas fa-file-contract"></i> Syarat &amp; Ketentuan</h1>
      <a href="/syarat-ketentuan" target="_blank" style="padding:10px 20px;background:var(--bg-hover);color:var(--text);border:1px solid var(--border);border-radius:8px;text-decoration:none;font-size:14px;display:flex;align-items:center;gap:8px"><i class="fas fa-eye"></i> Lihat Publik</a>
    </div>

    ${saved ? `<div style="padding:12px 16px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;margin-bottom:16px;color:#22c55e;font-size:14px"><i class="fas fa-check-circle"></i> Konten berhasil disimpan!</div>` : ''}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

      <!-- Form Edit -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title"><i class="fas fa-edit" style="color:var(--primary)"></i> Edit Konten S&amp;K</div>
        </div>
        <div style="padding:20px">
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
            Tulis konten menggunakan HTML. Gunakan tag <code style="background:var(--bg-hover);padding:2px 6px;border-radius:4px">&lt;h3&gt;</code>, <code style="background:var(--bg-hover);padding:2px 6px;border-radius:4px">&lt;p&gt;</code>, <code style="background:var(--bg-hover);padding:2px 6px;border-radius:4px">&lt;ul&gt;</code>, <code style="background:var(--bg-hover);padding:2px 6px;border-radius:4px">&lt;li&gt;</code>, <code style="background:var(--bg-hover);padding:2px 6px;border-radius:4px">&lt;strong&gt;</code> dll.
          </p>
          <form method="POST" action="/admin/sk">
            <div class="form-group">
              <label class="form-label">Konten HTML Syarat &amp; Ketentuan</label>
              <textarea name="sk_content" id="skEditor" class="form-control" rows="28" style="font-family:monospace;font-size:12px;resize:vertical" placeholder="Tulis konten S&K dalam format HTML...">${skRaw.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <button type="submit" class="btn-buy" style="padding:10px 24px"><i class="fas fa-save"></i> Simpan Perubahan</button>
              <button type="button" onclick="previewSK()" style="padding:10px 24px;background:var(--bg-hover);color:var(--text);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:600"><i class="fas fa-eye"></i> Preview</button>
              <button type="button" onclick="insertTemplate()" style="padding:10px 24px;background:rgba(99,102,241,0.1);color:var(--primary);border:1px solid rgba(99,102,241,0.3);border-radius:8px;cursor:pointer;font-weight:600"><i class="fas fa-magic"></i> Sisipkan Template Pasal</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="admin-card">
        <div class="admin-card-header">
          <div class="admin-card-title"><i class="fas fa-eye" style="color:var(--primary)"></i> Preview Tampilan</div>
        </div>
        <div id="skPreviewBox" style="padding:24px;line-height:1.8;color:var(--text-secondary);min-height:200px;font-size:14px">
          ${skRaw}
        </div>
      </div>

    </div>

    <!-- Panduan Tag HTML -->
    <div class="admin-card" style="margin-top:4px">
      <div class="admin-card-header">
        <div class="admin-card-title"><i class="fas fa-code" style="color:#f59e0b"></i> Panduan Penulisan HTML</div>
      </div>
      <div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;font-size:13px">
        <div style="background:var(--bg-hover);padding:12px;border-radius:8px">
          <code style="color:var(--primary)">&lt;h3&gt;Judul Pasal&lt;/h3&gt;</code>
          <p style="margin-top:6px;color:var(--text-muted)">Untuk judul setiap pasal</p>
        </div>
        <div style="background:var(--bg-hover);padding:12px;border-radius:8px">
          <code style="color:var(--primary)">&lt;p&gt;Teks isi pasal&lt;/p&gt;</code>
          <p style="margin-top:6px;color:var(--text-muted)">Untuk paragraf biasa</p>
        </div>
        <div style="background:var(--bg-hover);padding:12px;border-radius:8px">
          <code style="color:var(--primary)">&lt;ul&gt;&lt;li&gt;poin&lt;/li&gt;&lt;/ul&gt;</code>
          <p style="margin-top:6px;color:var(--text-muted)">Untuk daftar poin-poin</p>
        </div>
        <div style="background:var(--bg-hover);padding:12px;border-radius:8px">
          <code style="color:var(--primary)">&lt;strong&gt;teks tebal&lt;/strong&gt;</code>
          <p style="margin-top:6px;color:var(--text-muted)">Untuk teks tebal/penting</p>
        </div>
        <div style="background:var(--bg-hover);padding:12px;border-radius:8px">
          <code style="color:var(--primary)">&lt;br&gt;</code>
          <p style="margin-top:6px;color:var(--text-muted)">Untuk ganti baris</p>
        </div>
        <div style="background:var(--bg-hover);padding:12px;border-radius:8px">
          <code style="color:var(--primary)">&amp;amp; → &amp;</code>
          <p style="margin-top:6px;color:var(--text-muted)">Karakter &amp; di HTML</p>
        </div>
      </div>
    </div>

    <script>
    function previewSK() {
      var raw = document.getElementById('skEditor').value;
      document.getElementById('skPreviewBox').innerHTML = raw;
    }
    // Auto-preview saat mengetik (debounce)
    var _skTimer;
    document.getElementById('skEditor').addEventListener('input', function() {
      clearTimeout(_skTimer);
      _skTimer = setTimeout(previewSK, 600);
    });
    function insertTemplate() {
      var t = document.getElementById('skEditor');
      var num = (t.value.match(/<h3/g) || []).length + 1;
      var tpl = '\\n<h3 style="color:var(--text-primary);margin-top:28px;margin-bottom:12px">' + num + '. Judul Pasal</h3>\\n<p>Isi pasal di sini...</p>\\n';
      t.value += tpl;
      previewSK();
      t.scrollTop = t.scrollHeight;
    }
    </script>
  `, 'Syarat & Ketentuan', settings))
})

app.post('/admin/sk', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  const skContent = body.sk_content as string || ''

  // Simpan ke settings table
  const existing = await c.env.DB.prepare("SELECT id FROM settings WHERE key='sk_content'").first() as any
  if (existing) {
    await c.env.DB.prepare("UPDATE settings SET value=? WHERE key='sk_content'").bind(skContent).run()
  } else {
    await c.env.DB.prepare("INSERT INTO settings (key, value) VALUES ('sk_content', ?)").bind(skContent).run()
  }
  return c.redirect('/admin/sk?saved=1')
})

// ============================
// ADMIN TRANSACTIONS
// ============================
app.get('/admin/transactions', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const retentionDays = parseInt(settings.transaction_retention_days || '3')
  const txRes = await c.env.DB.prepare(`
    SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100
  `).all()
  const transactions = txRes.results as any[]

  function censorText(text: string, show = 5): string {
    if (!text) return '-'
    if (text.length <= show) return text
    return text.substring(0, show) + '*'.repeat(Math.min(5, text.length - show))
  }

  const statusOptions = ['pending','processing','success','failed']
  const rows = transactions.map(tx => {
    const statusColors: Record<string,string> = { success:'#22c55e', pending:'#f59e0b', processing:'#6366f1', failed:'#ef4444' }
    const col = statusColors[tx.status] || '#6b7280'
    return `<tr>
      <td style="font-family:monospace;font-size:12px">#${tx.order_id}</td>
      <td>${tx.game_name}</td>
      <td style="font-family:monospace">${censorText(tx.game_id)}</td>
      <td>${censorText(tx.nickname || '-')}</td>
      <td>${tx.product_name || '-'}</td>
      <td>
        <select onchange="updateTxStatus(${tx.id}, this.value)" style="background:${col}22;color:${col};border:1px solid ${col};border-radius:6px;padding:4px 8px;font-size:12px;font-weight:600;cursor:pointer">
          ${statusOptions.map(s => `<option value="${s}" ${tx.status===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
        </select>
      </td>
      <td style="font-size:11px;color:var(--text-muted)">${tx.created_at ? tx.created_at.substring(0,16) : '-'}</td>
      <td><button onclick="deleteTx(${tx.id})" style="padding:4px 10px;background:#dc2626;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button></td>
    </tr>`
  }).join('')

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1><i class="fas fa-receipt"></i> Kelola Transaksi</h1>
      <button onclick="openModal('addTxModal')" class="btn-buy" style="padding:10px 20px"><i class="fas fa-plus"></i> Tambah Transaksi</button>
    </div>
    <div class="admin-card" style="padding:16px 20px;margin-bottom:16px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2)">
      <p style="font-size:13px;color:var(--text-muted);margin:0"><i class="fas fa-info-circle" style="color:var(--primary)"></i> Data ditampilkan tersensor di halaman publik. Retensi data: <strong>${retentionDays} hari</strong>. Atur di <a href="/admin/settings" style="color:var(--primary)">Pengaturan</a>.</p>
    </div>
    <div class="admin-card">
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Order ID</th><th>Game</th><th>ID Game</th><th>Nickname</th><th>Produk</th><th>Status</th><th>Waktu</th><th>Hapus</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted)">Belum ada transaksi</td></tr>'}</tbody>
        </table>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <div class="modal-overlay" id="addTxModal">
      <div class="modal-box" style="max-width:520px">
        <div class="modal-header">
          <h3>Tambah Transaksi</h3>
          <button onclick="closeModal('addTxModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">ID Order (kosong = auto)</label>
            <input type="text" id="txOrderId" class="form-control" placeholder="ORD12345">
          </div>
          <div class="form-group">
            <label class="form-label">Nama Game *</label>
            <input type="text" id="txGame" class="form-control" placeholder="Mobile Legends" required>
          </div>
          <div class="form-group">
            <label class="form-label">ID Game *</label>
            <input type="text" id="txGameId" class="form-control" placeholder="123456789" required>
          </div>
          <div class="form-group">
            <label class="form-label">Nickname</label>
            <input type="text" id="txNickname" class="form-control" placeholder="Nama karakter">
          </div>
          <div class="form-group">
            <label class="form-label">Produk / Nominal</label>
            <input type="text" id="txProduct" class="form-control" placeholder="86 Diamonds">
          </div>
          <div class="form-group">
            <label class="form-label">Metode Bayar</label>
            <input type="text" id="txPayment" class="form-control" placeholder="Dana / GoPay">
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="txStatus" class="form-control">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan</label>
            <input type="text" id="txNotes" class="form-control" placeholder="Opsional">
          </div>
        </div>
        <button onclick="saveTx()" class="btn-buy" style="width:100%;margin-top:8px"><i class="fas fa-save"></i> Simpan</button>
      </div>
    </div>

    <script>
    async function updateTxStatus(id, status) {
      const r = await fetch('/api/admin/transactions/' + id + '/status', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ status })
      });
      const d = await r.json();
      if (d.success) showToast('Status diperbarui!', 'success');
      else showToast('Gagal!', 'error');
    }
    async function deleteTx(id) {
      if (!confirm('Hapus transaksi ini?')) return;
      const r = await fetch('/api/admin/transactions/' + id, { method:'DELETE' });
      const d = await r.json();
      if (d.success) { showToast('Dihapus!', 'success'); setTimeout(()=>location.reload(),800); }
    }
    async function saveTx() {
      const data = {
        order_id: document.getElementById('txOrderId').value,
        game_name: document.getElementById('txGame').value,
        game_id: document.getElementById('txGameId').value,
        nickname: document.getElementById('txNickname').value,
        product_name: document.getElementById('txProduct').value,
        payment_method: document.getElementById('txPayment').value,
        status: document.getElementById('txStatus').value,
        notes: document.getElementById('txNotes').value
      };
      if (!data.game_name || !data.game_id) { showToast('Nama Game & ID Game wajib diisi!','error'); return; }
      const r = await fetch('/api/admin/transactions/add', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const d = await r.json();
      if (d.success) { showToast('Transaksi ditambahkan!','success'); setTimeout(()=>location.reload(),800); }
      else showToast('Gagal!','error');
    }
    </script>
  `, 'Kelola Transaksi', settings))
})

// ============================
// ADMIN REVIEWS
// ============================
app.get('/admin/reviews', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const reviewsRes = await c.env.DB.prepare('SELECT * FROM reviews ORDER BY sort_order ASC, id ASC').all().catch(() => ({ results: [] }))
  const reviews = (reviewsRes.results || []) as any[]
  const reviewsJson = JSON.stringify(reviews)

  const rows = reviews.map(r => `
    <tr>
      <td><div style="width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">${r.avatar_letter || r.reviewer_name.charAt(0)}</div></td>
      <td><strong>${r.reviewer_name}</strong></td>
      <td>${r.game_name || '-'}</td>
      <td>${'⭐'.repeat(r.rating || 5)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted);font-size:13px">${r.review_text}</td>
      <td>${r.is_active ? '<span style="color:#22c55e">● Aktif</span>' : '<span style="color:#ef4444">○ Nonaktif</span>'}</td>
      <td>
        <div style="display:flex;gap:8px">
          <button onclick="editReview(${r.id})" style="padding:5px 10px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px"><i class="fas fa-edit"></i></button>
          <button onclick="toggleReview(${r.id},${r.is_active})" style="padding:5px 10px;background:${r.is_active?'#ef4444':'#22c55e'};color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px">${r.is_active?'Nonaktif':'Aktifkan'}</button>
          <button onclick="deleteReview(${r.id})" style="padding:5px 10px;background:#dc2626;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('')

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1><i class="fas fa-star"></i> Kelola Ulasan</h1>
      <button onclick="openModal('addReviewModal')" class="btn-buy" style="padding:10px 20px"><i class="fas fa-plus"></i> Tambah Ulasan</button>
    </div>
    <div class="admin-card" style="padding:16px 20px;margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <span style="font-size:13px;color:var(--text-muted)">Judul Section:</span>
        <input type="text" id="reviewSectionTitle" class="form-control" value="${settings.review_section_title || 'Apa Kata Mereka?'}" style="flex:1;min-width:200px;max-width:300px">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
          <input type="checkbox" id="reviewEnabled" ${settings.review_section_enabled !== '0' ? 'checked' : ''} style="width:16px;height:16px">
          Tampilkan di Homepage
        </label>
        <button onclick="saveReviewSettings()" style="padding:8px 16px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600"><i class="fas fa-save"></i> Simpan</button>
      </div>
    </div>
    <div class="admin-card">
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th></th><th>Nama</th><th>Game</th><th>Rating</th><th>Ulasan</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted)">Belum ada ulasan</td></tr>'}</tbody>
        </table>
      </div>
    </div>

    <!-- Add Review Modal -->
    <div class="modal-overlay" id="addReviewModal">
      <div class="modal-box">
        <div class="modal-header"><h3>Tambah Ulasan</h3><button onclick="closeModal('addReviewModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button></div>
        <form method="POST" action="/admin/reviews/add">
          <div class="form-group"><label class="form-label">Nama Reviewer *</label><input type="text" name="reviewer_name" class="form-control" required placeholder="Fadli R."></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group"><label class="form-label">Huruf Avatar</label><input type="text" name="avatar_letter" class="form-control" maxlength="2" placeholder="F"></div>
            <div class="form-group"><label class="form-label">Nama Game</label><input type="text" name="game_name" class="form-control" placeholder="Mobile Legends"></div>
            <div class="form-group"><label class="form-label">Rating (1-5)</label><input type="number" name="rating" class="form-control" min="1" max="5" value="5"></div>
            <div class="form-group"><label class="form-label">Sort Order</label><input type="number" name="sort_order" class="form-control" value="0"></div>
          </div>
          <div class="form-group"><label class="form-label">Teks Ulasan *</label><textarea name="review_text" class="form-control" rows="3" required placeholder="Tulis ulasan..."></textarea></div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <!-- Edit Review Modal -->
    <div class="modal-overlay" id="editReviewModal">
      <div class="modal-box">
        <div class="modal-header"><h3>Edit Ulasan</h3><button onclick="closeModal('editReviewModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button></div>
        <form id="editReviewForm" method="POST">
          <div class="form-group"><label class="form-label">Nama Reviewer *</label><input type="text" name="reviewer_name" id="erName" class="form-control" required></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group"><label class="form-label">Huruf Avatar</label><input type="text" name="avatar_letter" id="erAvatar" class="form-control" maxlength="2"></div>
            <div class="form-group"><label class="form-label">Nama Game</label><input type="text" name="game_name" id="erGame" class="form-control"></div>
            <div class="form-group"><label class="form-label">Rating</label><input type="number" name="rating" id="erRating" class="form-control" min="1" max="5"></div>
            <div class="form-group"><label class="form-label">Sort Order</label><input type="number" name="sort_order" id="erSort" class="form-control"></div>
          </div>
          <div class="form-group"><label class="form-label">Teks Ulasan *</label><textarea name="review_text" id="erText" class="form-control" rows="3"></textarea></div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <script>
    var _reviews = ${reviewsJson};
    function editReview(id) {
      var r = _reviews.find(x => x.id === id);
      if (!r) return;
      document.getElementById('erName').value = r.reviewer_name;
      document.getElementById('erAvatar').value = r.avatar_letter || '';
      document.getElementById('erGame').value = r.game_name || '';
      document.getElementById('erRating').value = r.rating || 5;
      document.getElementById('erSort').value = r.sort_order || 0;
      document.getElementById('erText').value = r.review_text;
      document.getElementById('editReviewForm').action = '/admin/reviews/' + id + '/edit';
      openModal('editReviewModal');
    }
    async function toggleReview(id, current) {
      const r = await fetch('/api/admin/reviews/' + id + '/status', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ is_active: current ? 0 : 1 })
      });
      const d = await r.json();
      if (d.success) { showToast('Status diubah!','success'); setTimeout(()=>location.reload(),800); }
    }
    async function deleteReview(id) {
      if (!confirm('Hapus ulasan ini?')) return;
      const r = await fetch('/api/admin/reviews/' + id, { method:'DELETE' });
      const d = await r.json();
      if (d.success) { showToast('Dihapus!','success'); setTimeout(()=>location.reload(),800); }
    }
    async function saveReviewSettings() {
      const title = document.getElementById('reviewSectionTitle').value;
      const enabled = document.getElementById('reviewEnabled').checked ? '1' : '0';
      const r = await fetch('/api/admin/settings/review', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ review_section_title: title, review_section_enabled: enabled })
      });
      const d = await r.json();
      if (d.success) showToast('Pengaturan disimpan!','success');
    }
    </script>
  `, 'Kelola Ulasan', settings))
})

app.post('/admin/reviews/add', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  await c.env.DB.prepare(`INSERT INTO reviews (reviewer_name, avatar_letter, game_name, rating, review_text, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`)
    .bind(body.reviewer_name, body.avatar_letter || body.reviewer_name?.charAt(0) || 'A', body.game_name || '', body.rating || 5, body.review_text, body.sort_order || 0).run()
  return c.redirect('/admin/reviews')
})

app.post('/admin/reviews/:id/edit', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  await c.env.DB.prepare(`UPDATE reviews SET reviewer_name=?, avatar_letter=?, game_name=?, rating=?, review_text=?, sort_order=? WHERE id=?`)
    .bind(body.reviewer_name, body.avatar_letter || '', body.game_name || '', body.rating || 5, body.review_text, body.sort_order || 0, c.req.param('id')).run()
  return c.redirect('/admin/reviews')
})

// ============================
// ADMIN LIVE ORDERS
// ============================
app.get('/admin/liveorders', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const settings = await getSettings(c.env.DB)
  const loRes = await c.env.DB.prepare('SELECT * FROM live_orders ORDER BY sort_order ASC').all().catch(() => ({ results: [] }))
  const orders = (loRes.results || []) as any[]
  const loJson = JSON.stringify(orders)

  const rows = orders.map(o => `
    <tr>
      <td><strong>${o.display_name}</strong></td>
      <td>${o.game_name}</td>
      <td>${o.product_name}</td>
      <td>${o.is_active ? '<span style="color:#22c55e">● Aktif</span>' : '<span style="color:#ef4444">○ Nonaktif</span>'}</td>
      <td>
        <div style="display:flex;gap:8px">
          <button onclick="editLO(${o.id})" style="padding:5px 10px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px"><i class="fas fa-edit"></i></button>
          <button onclick="deleteLO(${o.id})" style="padding:5px 10px;background:#dc2626;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('')

  return c.html(getAdminLayout(`
    <div class="admin-page-header">
      <h1><i class="fas fa-bolt"></i> Live Order Notifikasi</h1>
      <button onclick="openModal('addLOModal')" class="btn-buy" style="padding:10px 20px"><i class="fas fa-plus"></i> Tambah</button>
    </div>
    <div class="admin-card" style="padding:16px 20px;margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <span style="font-size:13px;color:var(--text-muted)">Interval (ms):</span>
        <input type="number" id="loInterval" class="form-control" value="${settings.live_order_interval || '6000'}" style="width:120px">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
          <input type="checkbox" id="loEnabled" ${settings.live_order_enabled !== '0' ? 'checked' : ''} style="width:16px;height:16px">
          Aktifkan Live Order
        </label>
        <button onclick="saveLOSettings()" style="padding:8px 16px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600"><i class="fas fa-save"></i> Simpan</button>
      </div>
    </div>
    <div class="admin-card">
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Nama (Tersensor)</th><th>Game</th><th>Produk</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted)">Belum ada data</td></tr>'}</tbody>
        </table>
      </div>
    </div>

    <!-- Add LO Modal -->
    <div class="modal-overlay" id="addLOModal">
      <div class="modal-box">
        <div class="modal-header"><h3>Tambah Live Order</h3><button onclick="closeModal('addLOModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button></div>
        <form method="POST" action="/admin/liveorders/add">
          <div class="form-group"><label class="form-label">Nama Tampil (tersensor) *</label><input type="text" name="display_name" class="form-control" required placeholder="Fadli****"></div>
          <div class="form-group"><label class="form-label">Nama Game *</label><input type="text" name="game_name" class="form-control" required placeholder="Mobile Legends"></div>
          <div class="form-group"><label class="form-label">Produk *</label><input type="text" name="product_name" class="form-control" required placeholder="86 Diamonds"></div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <!-- Edit LO Modal -->
    <div class="modal-overlay" id="editLOModal">
      <div class="modal-box">
        <div class="modal-header"><h3>Edit Live Order</h3><button onclick="closeModal('editLOModal')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">×</button></div>
        <form id="editLOForm" method="POST">
          <div class="form-group"><label class="form-label">Nama Tampil *</label><input type="text" name="display_name" id="elName" class="form-control" required></div>
          <div class="form-group"><label class="form-label">Nama Game *</label><input type="text" name="game_name" id="elGame" class="form-control" required></div>
          <div class="form-group"><label class="form-label">Produk *</label><input type="text" name="product_name" id="elProduct" class="form-control" required></div>
          <button type="submit" class="btn-buy" style="width:100%"><i class="fas fa-save"></i> Simpan</button>
        </form>
      </div>
    </div>

    <script>
    var _loData = ${loJson};
    function editLO(id) {
      var o = _loData.find(x => x.id === id);
      if (!o) return;
      document.getElementById('elName').value = o.display_name;
      document.getElementById('elGame').value = o.game_name;
      document.getElementById('elProduct').value = o.product_name;
      document.getElementById('editLOForm').action = '/admin/liveorders/' + id + '/edit';
      openModal('editLOModal');
    }
    async function deleteLO(id) {
      if (!confirm('Hapus item ini?')) return;
      const r = await fetch('/api/admin/liveorders/' + id, { method:'DELETE' });
      const d = await r.json();
      if (d.success) { showToast('Dihapus!','success'); setTimeout(()=>location.reload(),800); }
    }
    async function saveLOSettings() {
      const interval = document.getElementById('loInterval').value;
      const enabled = document.getElementById('loEnabled').checked ? '1' : '0';
      const r = await fetch('/api/admin/settings/liveorder', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ live_order_interval: interval, live_order_enabled: enabled })
      });
      const d = await r.json();
      if (d.success) showToast('Pengaturan disimpan!','success');
    }
    </script>
  `, 'Live Order', settings))
})

app.post('/admin/liveorders/add', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  await c.env.DB.prepare(`INSERT INTO live_orders (display_name, game_name, product_name, is_active) VALUES (?, ?, ?, 1)`)
    .bind(body.display_name, body.game_name, body.product_name).run()
  return c.redirect('/admin/liveorders')
})

app.post('/admin/liveorders/:id/edit', async (c) => {
  if (!isAdmin(c)) return c.redirect('/admin')
  const body = await c.req.parseBody()
  await c.env.DB.prepare(`UPDATE live_orders SET display_name=?, game_name=?, product_name=? WHERE id=?`)
    .bind(body.display_name, body.game_name, body.product_name, c.req.param('id')).run()
  return c.redirect('/admin/liveorders')
})

// ============================
// API ENDPOINTS
// ============================

// ---- Transaction status API ----
app.post('/api/admin/transactions/add', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const body = await c.req.json()
  const orderId = body.order_id || ('ORD' + Date.now().toString().slice(-8))
  await c.env.DB.prepare(`
    INSERT INTO transactions (order_id, game_name, game_id, nickname, product_name, amount, payment_method, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(orderId, body.game_name||'', body.game_id||'', body.nickname||'', body.product_name||'', body.amount||0, body.payment_method||'', body.status||'pending', body.notes||'').run()
  return c.json({ success: true })
})

app.post('/api/admin/transactions/:id/status', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE transactions SET status=? WHERE id=?').bind(status, c.req.param('id')).run()
  return c.json({ success: true })
})

app.delete('/api/admin/transactions/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  await c.env.DB.prepare('DELETE FROM transactions WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

// ---- Reviews API ----
app.post('/api/admin/reviews/:id/status', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const { is_active } = await c.req.json()
  await c.env.DB.prepare('UPDATE reviews SET is_active=? WHERE id=?').bind(is_active, c.req.param('id')).run()
  return c.json({ success: true })
})

app.delete('/api/admin/reviews/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  await c.env.DB.prepare('DELETE FROM reviews WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

// ---- Live Orders API ----
app.delete('/api/admin/liveorders/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  await c.env.DB.prepare('DELETE FROM live_orders WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})
app.post('/api/admin/games/:id/status', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE games SET status=? WHERE id=?').bind(status, c.req.param('id')).run()
  return c.json({ success: true })
})

app.delete('/api/admin/products/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  await c.env.DB.prepare('DELETE FROM flash_sales WHERE product_id = ?').bind(c.req.param('id')).run()
  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

app.post('/api/admin/products/:id/status', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE products SET status=? WHERE id=?').bind(status, c.req.param('id')).run()
  return c.json({ success: true })
})

app.post('/api/admin/marketplace/:id/status', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE marketplace_accounts SET status=? WHERE id=?').bind(status, c.req.param('id')).run()
  return c.json({ success: true })
})

app.delete('/api/admin/marketplace/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  await c.env.DB.prepare('DELETE FROM marketplace_accounts WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

// Settings API for favicon/logo URLs
app.get('/api/settings', async (c) => {
  const settings = await getSettings(c.env.DB)
  return c.json({ 
    logo_url: settings.logo_url || '',
    favicon_url: settings.favicon_url || '',
    site_title: settings.site_title || 'EVOGAME'
  })
})

// Settings API for reviews section
app.post('/api/admin/settings/review', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const body = await c.req.json()
  for (const [key, val] of Object.entries(body)) {
    await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(key, String(val)).run()
  }
  return c.json({ success: true })
})

// Settings API for live order
app.post('/api/admin/settings/liveorder', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false }, 401)
  const body = await c.req.json()
  for (const [key, val] of Object.entries(body)) {
    await c.env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(key, String(val)).run()
  }
  return c.json({ success: true })
})

// ============================
// ADMIN LAYOUT HELPER
// ============================
function getAdminLayout(content: string, title: string, settings: any): string {
  const siteName = settings?.site_title || 'EVOGAME'
  const logoUrl = settings?.logo_url || ''
  const faviconUrl = settings?.favicon_url || ''
  let faviconTag = `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">`
  if (faviconUrl) faviconTag = `<link rel="icon" href="${faviconUrl}">`
  let logoHtml = `<i class="fas fa-gamepad"></i><span>${siteName}</span>`
  if (logoUrl) logoHtml = `<img src="${logoUrl}" alt="${siteName}" style="height:30px;object-fit:contain">`

  return `<!DOCTYPE html>
<html lang="id" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Admin ${siteName}</title>
  ${faviconTag}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body class="dark-theme admin-body">
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="admin-sidebar-header">
        <a href="/admin/dashboard" class="admin-logo">
          ${logoHtml}
        </a>
        <button class="admin-sidebar-close" onclick="toggleSidebar()"><i class="fas fa-times"></i></button>
      </div>
      <nav class="admin-nav" id="adminNav">
        <a href="/admin/dashboard" class="admin-nav-item" data-path="/admin/dashboard"><i class="fas fa-home"></i> Dashboard</a>
        <a href="/admin/games" class="admin-nav-item" data-path="/admin/games"><i class="fas fa-gamepad"></i> Kelola Game</a>
        <a href="/admin/marketplace" class="admin-nav-item" data-path="/admin/marketplace"><i class="fas fa-store"></i> Marketplace</a>
        <a href="/admin/transactions" class="admin-nav-item" data-path="/admin/transactions"><i class="fas fa-receipt"></i> Transaksi</a>
        <a href="/admin/reviews" class="admin-nav-item" data-path="/admin/reviews"><i class="fas fa-star"></i> Ulasan</a>
        <a href="/admin/liveorders" class="admin-nav-item" data-path="/admin/liveorders"><i class="fas fa-bolt"></i> Live Order</a>
        <a href="/admin/popup" class="admin-nav-item" data-path="/admin/popup"><i class="fas fa-bell"></i> Pop-up</a>
        <a href="/admin/sk" class="admin-nav-item" data-path="/admin/sk"><i class="fas fa-file-contract"></i> Syarat &amp; Ketentuan</a>
        <a href="/admin/settings" class="admin-nav-item" data-path="/admin/settings"><i class="fas fa-cog"></i> Pengaturan</a>
        <div style="margin-top:auto;padding-top:20px;border-top:1px solid var(--border)">
          <a href="/" target="_blank" class="admin-nav-item"><i class="fas fa-external-link-alt"></i> Lihat Website</a>
          <a href="/admin/logout" class="admin-nav-item" style="color:#ef4444"><i class="fas fa-sign-out-alt"></i> Keluar</a>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Bar -->
      <div class="admin-topbar">
        <button class="admin-menu-btn" onclick="toggleSidebar()">
          <i class="fas fa-bars"></i>
        </button>
        <div style="flex:1"></div>
        <a href="/" target="_blank" style="color:var(--text-muted);text-decoration:none;font-size:14px"><i class="fas fa-eye"></i> Lihat Website</a>
      </div>

      <!-- Page Content -->
      <div class="admin-content">
        ${content}
      </div>
    </div>
  </div>
  <div class="admin-sidebar-overlay" id="adminOverlay" onclick="toggleSidebar()"></div>
  <script src="/static/app.js"></script>
  <script>
    function toggleSidebar() {
      var s = document.getElementById('adminSidebar');
      var o = document.getElementById('adminOverlay');
      if (!s) return;
      var isOpen = s.classList.contains('open');
      if (isOpen) {
        s.classList.remove('open');
        if (o) { o.classList.remove('show'); o.style.display = 'none'; }
        document.body.style.overflow = '';
      } else {
        s.classList.add('open');
        if (o) { o.classList.add('show'); o.style.display = 'block'; }
        document.body.style.overflow = 'hidden';
      }
    }
    // Expose globally
    window.toggleSidebar = toggleSidebar;
    // Highlight active nav item
    (function() {
      var path = window.location.pathname;
      var items = document.querySelectorAll('#adminNav .admin-nav-item[data-path]');
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        var elPath = el.getAttribute('data-path');
        if (path === elPath || (elPath !== '/admin/dashboard' && path.startsWith(elPath))) {
          el.classList.add('active');
        }
      }
    })();
  </script>
</body>
</html>`
}

// ============================
// UTILITY FUNCTIONS
// ============================
function formatRupiah(n: number): string {
  if (!n) return 'Rp 0'
  return 'Rp ' + n.toLocaleString('id-ID')
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function uploadPreviewScript(): string {
  return `<script>
  function previewImg(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
      reader.readAsDataURL(input.files[0]);
    }
  }
  </script>`
}

export default app
