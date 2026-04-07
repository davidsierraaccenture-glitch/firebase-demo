export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("acme-cart") || "[]");
}

export function saveCart(cart) {
  localStorage.setItem("acme-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product, quantity = 1) {
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
}

export function updateCartQuantity(productId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else {
    const item = cart.find((item) => item.productId === productId);
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.productId !== productId));
}

export function clearCart() {
  localStorage.removeItem("acme-cart");
  window.dispatchEvent(new Event("cart-updated"));
}
