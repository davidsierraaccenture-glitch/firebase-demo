// === Acme Shop — Product Detail ===

let currentProduct = null;

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) {
    location.href = "/";
    return;
  }

  const container = document.getElementById("product-content");
  showLoading(container);

  try {
    currentProduct = await apiGet(`/products/${productId}`);
    renderProduct(currentProduct);
    renderReviews(currentProduct.reviews || []);
  } catch (err) {
    container.innerHTML = `<p class="loading">Product not found.</p>`;
    console.error(err);
  }
}

function renderProduct(product) {
  const container = document.getElementById("product-content");
  const inStock = product.stock > 0;

  container.innerHTML = `
    <div class="product-detail">
      <img src="${product.imageUrl}" alt="${product.name}">
      <div class="product-info">
        <div class="category">${product.category}</div>
        <h1>${product.name}</h1>
        <div class="price">${formatPrice(product.price)}</div>
        <p class="description">${product.description}</p>
        <div class="tags">
          ${(product.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="stock-badge ${inStock ? "in-stock" : "out-of-stock"}">
          ${inStock ? `In Stock (${product.stock})` : "Out of Stock"}
        </div>
        ${inStock ? `
          <div class="quantity-selector">
            <button onclick="changeQty(-1)">-</button>
            <span id="qty">1</span>
            <button onclick="changeQty(1)">+</button>
          </div>
          <button class="btn btn-primary" onclick="handleAddToCart()">Add to Cart</button>
        ` : ""}
      </div>
    </div>
  `;
}

let selectedQty = 1;

function changeQty(delta) {
  selectedQty = Math.max(1, Math.min(selectedQty + delta, currentProduct.stock));
  document.getElementById("qty").textContent = selectedQty;
}

function handleAddToCart() {
  addToCart(currentProduct, selectedQty);
  selectedQty = 1;
  document.getElementById("qty").textContent = 1;
}

function renderReviews(reviews) {
  const section = document.getElementById("reviews-section");
  section.innerHTML = `
    <h2>Reviews (${reviews.length})</h2>
    ${reviews.length === 0 ? "<p>No reviews yet. Be the first!</p>" : ""}
    ${reviews.map((r) => `
      <div class="review-card">
        <div class="review-header">
          <span class="review-author">${r.userName}</span>
          <span class="review-rating">${renderStars(r.rating)}</span>
        </div>
        <p class="review-comment">${r.comment}</p>
      </div>
    `).join("")}

    <div class="review-form">
      <h3>Write a Review</h3>
      <form onsubmit="submitReview(event)">
        <div class="form-group">
          <label for="rev-name">Your Name</label>
          <input type="text" id="rev-name" required maxlength="100">
        </div>
        <div class="form-group">
          <label for="rev-rating">Rating</label>
          <select id="rev-rating" required>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="rev-comment">Comment</label>
          <textarea id="rev-comment" required maxlength="500" placeholder="Share your experience..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary" id="rev-submit">Submit Review</button>
      </form>
    </div>
  `;
}

async function submitReview(e) {
  e.preventDefault();
  const btn = document.getElementById("rev-submit");
  btn.disabled = true;
  btn.textContent = "Submitting...";

  try {
    await apiPost("/reviews", {
      productId: currentProduct.id,
      userName: document.getElementById("rev-name").value,
      rating: parseInt(document.getElementById("rev-rating").value),
      comment: document.getElementById("rev-comment").value,
    });
    showToast("Review submitted!");
    loadProduct(); // Reload to show new review
  } catch (err) {
    showToast("Failed to submit review. Please try again.");
    console.error(err);
    btn.disabled = false;
    btn.textContent = "Submit Review";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader("product");
  renderFooter();
  loadProduct();
});
