// === Acme Shop — Cart & Checkout ===

const TAX_RATE = 0.08;

function loadCart() {
  const cart = getCart();
  const container = document.getElementById("cart-content");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Browse our products and add some items!</p>
        <br>
        <a href="/" class="btn btn-primary">Shop Now</a>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  container.innerHTML = `
    <h1>Shopping Cart</h1>
    <div class="cart-items">
      ${cart.map((item) => `
        <div class="cart-item" data-id="${item.productId}">
          <img src="${item.imageUrl}" alt="${item.name}">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <div class="price">${formatPrice(item.price)}</div>
          </div>
          <div class="quantity-selector">
            <button onclick="updateQty('${item.productId}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQty('${item.productId}', ${item.quantity + 1})">+</button>
          </div>
          <div style="font-weight:700">${formatPrice(item.price * item.quantity)}</div>
          <button class="remove-btn" onclick="removeItem('${item.productId}')" title="Remove">&times;</button>
        </div>
      `).join("")}
    </div>

    <div class="cart-summary">
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Tax (8%)</span><span>${formatPrice(tax)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    </div>

    <div class="checkout-form">
      <h2>Checkout</h2>
      <form onsubmit="placeOrder(event)">
        <div class="form-row">
          <div class="form-group">
            <label for="cust-name">Full Name</label>
            <input type="text" id="cust-name" required>
          </div>
          <div class="form-group">
            <label for="cust-email">Email</label>
            <input type="email" id="cust-email" required>
          </div>
        </div>
        <div class="form-group">
          <label for="cust-address">Street Address</label>
          <input type="text" id="cust-address">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cust-city">City</label>
            <input type="text" id="cust-city">
          </div>
          <div class="form-group">
            <label for="cust-state">State</label>
            <input type="text" id="cust-state">
          </div>
        </div>
        <br>
        <button type="submit" class="btn btn-primary" id="checkout-btn">Place Order</button>
      </form>
    </div>
  `;
}

function updateQty(productId, newQty) {
  if (newQty <= 0) {
    removeItem(productId);
    return;
  }
  updateCartQuantity(productId, newQty);
  loadCart();
}

function removeItem(productId) {
  removeFromCart(productId);
  loadCart();
  showToast("Item removed from cart");
}

async function placeOrder(e) {
  e.preventDefault();
  const btn = document.getElementById("checkout-btn");
  btn.disabled = true;
  btn.textContent = "Processing...";

  const cart = getCart();
  const items = cart.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const customer = {
    name: document.getElementById("cust-name").value,
    email: document.getElementById("cust-email").value,
    address: {
      street: document.getElementById("cust-address").value,
      city: document.getElementById("cust-city").value,
      state: document.getElementById("cust-state").value,
    },
  };

  try {
    const result = await apiPost("/orders", {items, customer});
    clearCart();
    const container = document.getElementById("cart-content");
    container.innerHTML = `
      <div class="order-confirmation">
        <div class="icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you, ${customer.name}! Your order has been received.</p>
        <div class="order-id">Order ID: ${result.orderId}</div>
        <p style="margin-top:16px;color:var(--text-light)">Total: ${formatPrice(result.total)}</p>
        <br>
        <a href="/" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
  } catch (err) {
    showToast("Failed to place order. Please try again.");
    console.error(err);
    btn.disabled = false;
    btn.textContent = "Place Order";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader("cart");
  renderFooter();
  loadCart();
});
