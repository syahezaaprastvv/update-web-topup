// ================================
// TopUp Store - Frontend JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initNavbar();
  initCategoryTabs();
  initSearch();
  initFlashTimer();
  initFAQ();
  initPopup();
});

// ================================
// THEME
// ================================
function initTheme() {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', async () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    document.body.className = newTheme + '-theme';
    toggleBtn.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (e) {}

    localStorage.setItem('theme', newTheme);
  });
}

// ================================
// NAVBAR
// ================================
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const overlay = document.getElementById('overlay');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  mobileMenuClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });
  }

  const path = window.location.pathname;
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });

  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.2)' : 'none';
    }
  });
}

// ================================
// CATEGORY TABS
// ================================
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  if (tabs.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const currentCat = params.get('category') || 'all';

  tabs.forEach(tab => {
    const cat = tab.getAttribute('data-category');
    if (cat === currentCat) tab.classList.add('active');

    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const newUrl = cat === 'all' ? '/' : `/?category=${cat}`;
      window.history.pushState({}, '', newUrl);
      filterGames(cat);
    });
  });
}

function filterGames(category) {
  const gameCards = document.querySelectorAll('.game-card[data-category], .disabled-card[data-category]');
  gameCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const show = category === 'all' || cardCat === category;
    card.style.display = show ? '' : 'none';
  });
}

// ================================
// SEARCH
// ================================
function initSearch() {
  const searchInput = document.getElementById('gameSearch');
  if (!searchInput) return;

  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      searchGames(query);
    }, 300);
  });
}

function searchGames(query) {
  const gameCards = document.querySelectorAll('.game-card, .disabled-card');
  gameCards.forEach(card => {
    const name = card.querySelector('.game-card-name')?.textContent.toLowerCase() || '';
    card.style.display = (query === '' || name.includes(query)) ? '' : 'none';
  });
}

// ================================
// FLASH TIMER
// ================================
function initFlashTimer() {
  const timerEl = document.getElementById('flashTimer');
  if (!timerEl) return;

  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 0);
  let remaining = Math.floor((end - now) / 1000);

  function updateTimer() {
    if (remaining <= 0) return;
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    const hEl = document.getElementById('timer-h');
    const mEl = document.getElementById('timer-m');
    const sEl = document.getElementById('timer-s');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');

    remaining--;
  }
  updateTimer();
  setInterval(updateTimer, 1000);
}

// ================================
// FAQ
// ================================
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer?.classList.contains('open');

      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('open');
        q.nextElementSibling?.classList.remove('open');
      });

      if (!isOpen && answer) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}

// ================================
// POPUP - Muncul sekali per sesi, bisa di-close
// ================================
function initPopup() {
  const popup = document.getElementById('sitePopup');
  if (!popup) return;

  // Cek apakah popup sudah pernah ditutup di sesi ini
  const popupDismissed = sessionStorage.getItem('popup_dismissed');
  if (popupDismissed) {
    popup.style.display = 'none';
    return;
  }

  // Popup akan muncul (via CSS animation)
  popup.style.display = 'flex';
  
  // Close ketika klik overlay (area luar popup box)
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });
}

function closePopup() {
  const popup = document.getElementById('sitePopup');
  if (!popup) return;
  
  popup.style.animation = 'none';
  popup.style.opacity = '1';
  popup.style.transition = 'opacity 0.3s ease';
  
  requestAnimationFrame(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.style.display = 'none';
      // Simpan ke sessionStorage agar tidak muncul lagi di sesi ini
      sessionStorage.setItem('popup_dismissed', '1');
    }, 300);
  });
}

// ================================
// PRODUCT SELECTION (Detail Page)
// ================================
let selectedProduct = null;

function selectProduct(id, name, price, originalPrice) {
  selectedProduct = { id, name, price, originalPrice };

  document.querySelectorAll('.product-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.productId == id);
  });

  updateOrderSummary();
}

function updateOrderSummary() {
  const summaryEl = document.getElementById('orderSummary');
  const productNameEl = document.getElementById('summaryProduct');
  const priceEl = document.getElementById('summaryPrice');
  const totalEl = document.getElementById('summaryTotal');

  if (!selectedProduct) {
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (summaryEl) summaryEl.style.display = 'block';
  if (productNameEl) productNameEl.textContent = selectedProduct.name;
  if (priceEl) priceEl.textContent = formatCurrency(selectedProduct.price);
  if (totalEl) totalEl.textContent = formatCurrency(selectedProduct.price);
}

// ================================
// BUY NOW - WHATSAPP REDIRECT
// ================================
function buyNow() {
  const gameName = document.getElementById('gameName')?.value || '';
  const gameId = document.getElementById('inputGameId')?.value?.trim() || '';
  const nickname = document.getElementById('inputNickname')?.value?.trim() || '';
  const server = document.getElementById('inputServer')?.value?.trim() || '';
  const voucher = document.getElementById('inputVoucher')?.value?.trim() || '';
  const waNumber = document.getElementById('waNumber')?.value || '';

  if (!selectedProduct) {
    showToast('Pilih nominal top up terlebih dahulu!', 'error');
    return;
  }
  if (!gameId) {
    showToast('Masukkan ID Game terlebih dahulu!', 'error');
    document.getElementById('inputGameId')?.focus();
    return;
  }
  if (!nickname) {
    showToast('Masukkan Nickname terlebih dahulu!', 'error');
    document.getElementById('inputNickname')?.focus();
    return;
  }

  const paymentEl = document.querySelector('input[name="payment_method"]:checked');
  if (!paymentEl) {
    showToast('Pilih metode pembayaran terlebih dahulu!', 'error');
    return;
  }
  const paymentMethod = paymentEl.value;

  let msg = `Halo admin, saya mau topup *${gameName}*.\n\n`;
  msg += `Detail Pesanan :\n\n`;
  msg += `Player ID : ${gameId}\n`;
  msg += `Nickname : ${nickname}\n`;
  if (server) msg += `Server : ${server}\n`;
  if (voucher) msg += `Kode Voucher : ${voucher}\n`;
  msg += `Jumlah Pembelian : ${selectedProduct.name}\n\n`;
  msg += `==========================\n\n`;
  msg += `Total Pembayaran : ${formatCurrency(selectedProduct.price)}\n`;
  msg += `Bayar dengan : ${paymentMethod}\n\n`;
  msg += `Silahkan Lakukan Pembayaran, dan Kirimkan Bukti Transfer ke Admin Agar Pesanan Kami Proses\n\n`;
  msg += `via : https://evogamestore.my.id`;

  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;
  window.open(waUrl, '_blank');
}

// ================================
// FORMAT CURRENCY
// ================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ================================
// TOAST NOTIFICATION
// ================================
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ================================
// ADMIN HELPERS
// ================================
function openModal(id) {
  const modal = document.getElementById(id);
  modal?.classList.add('show');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  modal?.classList.remove('show');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});

function confirmDelete(url, name, type) {
  if (confirm(`Yakin ingin menghapus "${name}"?`)) {
    fetch(url, { method: 'DELETE' })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          showToast('Data berhasil dihapus!', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('Gagal menghapus data!', 'error');
        }
      })
      .catch(() => showToast('Terjadi kesalahan!', 'error'));
  }
}

if (typeof toggleSidebar === 'undefined') {
  window.toggleSidebar = function() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('adminOverlay');
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      sidebar.classList.remove('open');
      overlay?.classList.remove('show');
      document.body.style.overflow = '';
    } else {
      sidebar.classList.add('open');
      overlay?.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };
}
