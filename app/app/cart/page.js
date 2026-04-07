"use client";

import { useState } from "react";
import Link from "next/link";
import { getCart, updateCartQuantity, removeFromCart, clearCart } from "../../lib/cart";
import { formatPrice } from "../../lib/utils";
import { apiPost } from "../../lib/api";
import Toast, { showToast } from "../../components/Toast";
import { useAuth } from "../../components/AuthProvider";

const TAX_RATE = 0.08;

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(getCart());
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    setCart(getCart());
  }

  function handleUpdateQty(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
      showToast("Item removed from cart");
    } else {
      updateCartQuantity(productId, newQty);
    }
    refresh();
  }

  function handleRemove(productId) {
    removeFromCart(productId);
    refresh();
    showToast("Item removed from cart");
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const items = cart.map((item) => ({ productId: item.productId, quantity: item.quantity }));
    const customer = {
      name: formData.get("name"),
      email: formData.get("email"),
      address: {
        street: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
      },
    };

    try {
      const result = await apiPost("/orders", { items, customer });
      clearCart();
      setCart([]);
      setOrder({ id: result.orderId, total: result.total, customerName: customer.name });
    } catch (err) {
      showToast("Failed to place order. Please try again.");
      console.error(err);
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <main className="container">
        <div className="order-confirmation">
          <div className="icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you, {order.customerName}! Your order has been received.</p>
          <div className="order-id">Order ID: {order.id}</div>
          <p style={{ marginTop: "16px", color: "var(--text-light)" }}>Total: {formatPrice(order.total)}</p>
          <br />
          <Link href="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
        <Toast />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container">
        <div className="cart-empty">
          <div className="icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Browse our products and add some items!</p>
          <br />
          <Link href="/" className="btn btn-primary">Shop Now</Link>
        </div>
        <Toast />
      </main>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return (
    <main className="container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.productId}>
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <div className="price">{formatPrice(item.price)}</div>
            </div>
            <div className="quantity-selector">
              <button onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}>+</button>
            </div>
            <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
            <button className="remove-btn" onClick={() => handleRemove(item.productId)} title="Remove">&times;</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="summary-row"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
        <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>

      {user ? (
        <div className="checkout-form">
          <h2>Checkout</h2>
          <form onSubmit={handleCheckout}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cust-name">Full Name</label>
                <input type="text" id="cust-name" name="name" required defaultValue={user.displayName || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="cust-email">Email</label>
                <input type="email" id="cust-email" name="email" required defaultValue={user.email || ""} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cust-address">Street Address</label>
              <input type="text" id="cust-address" name="address" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cust-city">City</label>
                <input type="text" id="cust-city" name="city" />
              </div>
              <div className="form-group">
                <label htmlFor="cust-state">State</label>
                <input type="text" id="cust-state" name="state" />
              </div>
            </div>
            <br />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      ) : (
        <div className="checkout-form auth-prompt">
          <h2>Checkout</h2>
          <p><Link href="/login">Sign in</Link> to place your order.</p>
        </div>
      )}
      <Toast />
    </main>
  );
}
