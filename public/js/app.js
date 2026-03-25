// === Acme Shop — Shared Utilities ===

const API_BASE = "/api";

// --- API helpers ---
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {"Content-Type": "application/json"},
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({error: res.statusText}));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

function apiGet(path) {
  return apiFetch(path);
}

function apiPost(path, body) {
  return apiFetch(path, {method: "POST", body: JSON.stringify(body)});
}

// --- Cart (localStorage) ---
function getCart() {
  return JSON.parse(localStorage.getItem("acme-cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("acme-cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

function updateCartQuantity(productId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else {
    const item = cart.find((item) => item.productId === productId);
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.productId !== productId));
}

function clearCart() {
  localStorage.removeItem("acme-cart");
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const count = getCartCount();
    badge.textContent = count > 0 ? count : "";
  }
}

// --- Formatting ---
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

// --- Toast ---
function showToast(message, duration = 2500) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// --- Header/Footer injection ---
function renderHeader(activePage) {
  const header = document.getElementById("header");
  if (!header) return;
  header.innerHTML = `
    <div class="header-inner">
      <a href="/" class="logo">Acme<span>Shop</span></a>
      <nav>
        <a href="/" class="${activePage === "home" ? "active" : ""}">Products</a>
        <a href="/cart.html" class="cart-link ${activePage === "cart" ? "active" : ""}">
          🛒 <span id="cart-badge" class="cart-badge"></span>
        </a>
      </nav>
    </div>
  `;
  updateCartBadge();
}

function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;
  footer.innerHTML = `
    <p>Acme Shop &mdash; Powered by <a href="https://firebase.google.com" target="_blank">Firebase</a></p>
  `;
}

// --- Loading ---
function showLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
}

// --- Init on every page ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
