// === Acme Shop — Product Listing ===

let allProducts = [];

async function loadProducts() {
  const grid = document.getElementById("product-grid");
  showLoading(grid);

  try {
    const res = await apiGet("/products");
    allProducts = res.data;
    renderProducts(allProducts);
    buildFilters(allProducts);
  } catch (err) {
    grid.innerHTML = `<p class="loading">Failed to load products. Please try again.</p>`;
    console.error(err);
  }
}

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  if (products.length === 0) {
    grid.innerHTML = `<p class="loading">No products found.</p>`;
    return;
  }
  grid.innerHTML = products.map((p) => `
    <div class="product-card" onclick="location.href='/product.html?id=${p.id}'">
      <img src="${p.imageUrl}" alt="${p.name}" loading="lazy">
      <div class="product-card-body">
        <div class="category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="rating">${renderStars(p.rating)} <span class="count">(${p.reviewCount})</span></div>
        <div class="price">${formatPrice(p.price)}</div>
      </div>
    </div>
  `).join("");
}

function buildFilters(products) {
  const container = document.getElementById("filters");
  const categories = [...new Set(products.map((p) => p.category))].sort();

  container.innerHTML = `
    <button class="filter-btn active" data-category="all">All</button>
    ${categories.map((c) => `<button class="filter-btn" data-category="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</button>`).join("")}
  `;

  container.addEventListener("click", (e) => {
    if (!e.target.classList.contains("filter-btn")) return;
    container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");

    const category = e.target.dataset.category;
    if (category === "all") {
      renderProducts(allProducts);
    } else {
      renderProducts(allProducts.filter((p) => p.category === category));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader("home");
  renderFooter();
  loadProducts();
});
