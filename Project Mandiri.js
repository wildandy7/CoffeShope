// ========== GLOBAL VARIABLES ==========
let cart = [];

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ========== SMOOTH SCROLL & OFFCANVAS CLOSE ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      const offcanvasElement = document.getElementById('offcanvasDarkNavbar');
      if (offcanvasElement) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) offcanvasInstance.hide();
      }
    }
  });
});

// ========== ALERT FUNCTION ==========
function showAlert(message, type = 'info') {
  const alertContainer = document.createElement('div');
  alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertContainer.style.top = '80px';
  alertContainer.style.right = '20px';
  alertContainer.style.zIndex = '9999';
  alertContainer.style.minWidth = '300px';
  alertContainer.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertContainer);
  setTimeout(() => alertContainer.remove(), 4000);
}

// ========== CONTACT FORM ==========
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message)
      return showAlert('Semua field harus diisi!', 'warning');

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email))
      return showAlert('Format email tidak valid!', 'danger');

    showAlert('Pesan berhasil dikirim! Terima kasih telah menghubungi kami.', 'success');
    form.reset();
  });
}

// ========== CAROUSEL AUTO-ADVANCE ==========
function initCarousel() {
  const carousel = document.getElementById('carouselHero');
  if (carousel)
    new bootstrap.Carousel(carousel, { interval: 5000, wrap: true });
}

// ========== DEBOUNCE FUNCTION ==========
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ========== BACK TO TOP BUTTON ==========
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.className = 'btn btn-success btn-lg';
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position: fixed; bottom: 30px; right: 30px;
    border-radius: 50%; width: 50px; height: 50px;
    display: none; z-index: 999;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', debounce(() => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }, 100));

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== CART ICON ==========
function createCartIcon() {
  if (document.getElementById('cartIcon')) return;
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const div = document.createElement('div');
  div.id = 'cartIcon';
  div.innerHTML = `
    <i class="fas fa-shopping-bag text-white"></i>
    <span id="cartCount"
      style="position:absolute;top:-10px;right:-12px;
             background:#A0522D;color:white;border-radius:50%;
             width:22px;height:22px;display:none;
             justify-content:center;align-items:center;
             font-size:12px;font-weight:bold;">0</span>`;
  div.style.cssText = 'position:absolute;top:10px;right:60px;cursor:pointer;font-size:24px;';
  div.addEventListener('click', e => { e.preventDefault(); showCart(); });
  navbar.appendChild(div);
}

// ========== ORDER SYSTEM ==========
function initOrderSystem() {
  const menu = document.getElementById('menu');
  if (!menu) return;
  createCartIcon();

  menu.querySelectorAll('.card').forEach(card => {
    const name = card.querySelector('.card-title')?.textContent.trim();
    const priceText = card.querySelector('.text-primary')?.textContent.trim() || '0';
    const price = parseInt(priceText.replace(/\D/g, '')) || 0;
    const img = card.querySelector('.card-img-top');

    const btn = document.createElement('button');
    btn.className = 'btn btn-success w-100 mt-3';
    btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Pesan';
    btn.onclick = () => openOrderModal(name, price);
    card.querySelector('.card-body').appendChild(btn);

    [card, img].forEach(el => {
      if (el) el.addEventListener('click', e => {
        if (e.target !== btn) openOrderModal(name, price);
      });
    });
  });
}

function openOrderModal(name, price) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title">Pesan ${name}</h5>
        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p><strong>Harga:</strong> Rp ${price.toLocaleString('id-ID')}</p>
        <div class="input-group mb-3">
          <button class="btn btn-outline-secondary" id="minus">−</button>
          <input type="number" id="qty" class="form-control text-center" value="1" min="1">
          <button class="btn btn-outline-secondary" id="plus">+</button>
        </div>
        <textarea id="notes" class="form-control" rows="2" placeholder="Catatan (opsional)"></textarea>
        <p class="mt-3"><strong>Total:</strong> <span id="total">Rp ${price.toLocaleString('id-ID')}</span></p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        <button class="btn btn-success" id="add"><i class="fas fa-check"></i> Tambah ke Keranjang</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal);

  const m = new bootstrap.Modal(modal);
  m.show();

  const qty = modal.querySelector('#qty');
  const total = modal.querySelector('#total');
  modal.querySelector('#minus').onclick = () => { if (qty.value > 1) qty.value--; update(); };
  modal.querySelector('#plus').onclick = () => { qty.value++; update(); };
  const update = () => total.textContent = 'Rp ' + (price * qty.value).toLocaleString('id-ID');
  modal.querySelector('#add').onclick = () => {
    addToCart({ id: Date.now(), name, price, quantity: parseInt(qty.value), notes: modal.querySelector('#notes').value.trim() });
    m.hide(); showAlert(`${name} ditambahkan ke keranjang!`, 'success');
  };
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

// ========== CART FUNCTIONS ==========
function addToCart(item) { cart.push(item); updateCartCount(); }
function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  el.textContent = cart.length;
  el.style.display = cart.length ? 'flex' : 'none';
}

function showCart() {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  let html = '';
  let total = 0;
  if (!cart.length) {
    html = '<div class="text-center text-muted py-5">Keranjang kosong</div>';
  } else {
    html = `<table class="table table-sm">
      <thead class="table-dark"><tr><th>Produk</th><th>Jumlah</th><th>Subtotal</th><th></th></tr></thead><tbody>`;
    cart.forEach((item, i) => {
      const sub = item.price * item.quantity;
      total += sub;
      html += `<tr>
        <td>${item.name}${item.notes ? `<br><small>${item.notes}</small>` : ''}</td>
        <td>${item.quantity}</td>
        <td>Rp ${sub.toLocaleString('id-ID')}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${i})"><i class="fas fa-trash"></i></button></td>
      </tr>`;
    });
    html += `</tbody></table><div class="p-3 bg-light"><strong>Total: Rp ${total.toLocaleString('id-ID')}</strong></div>`;
  }
  modal.innerHTML = `
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title">Keranjang</h5>
        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">${html}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
        ${cart.length ? `
        <button class="btn btn-danger" onclick="clearCart()">Hapus Semua</button>
        <button class="btn btn-success" onclick="checkout()">Checkout</button>` : ''}
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal);
  const m = new bootstrap.Modal(modal);
  m.show();
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function removeFromCart(i) { cart.splice(i, 1); updateCartCount(); showCart(); }
function clearCart() { if (confirm('Hapus semua item?')) { cart = []; updateCartCount(); showCart(); } }

function checkout() {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const summary = cart.map(i => `${i.quantity}x ${i.name} (Rp ${(i.price * i.quantity).toLocaleString('id-ID')})${i.notes ? ' - ' + i.notes : ''}`).join('\n');
  const text = `Halo, saya ingin memesan:\n\n${summary}\n\nTotal: Rp ${total.toLocaleString('id-ID')}`;
  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  cart = []; updateCartCount();
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initCarousel();
  initBackToTop();
  initOrderSystem();
  console.log('✓ CoffeeShope JS aktif!');
});

document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cartCount");
  let count = 0;

  // Contoh klik menambah jumlah cart
  cartIcon.addEventListener("click", () => {
    count++;
    cartCount.textContent = count;
  });
});
