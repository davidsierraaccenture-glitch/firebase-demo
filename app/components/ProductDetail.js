"use client";

import { useState } from "react";
import { formatPrice } from "../lib/utils";
import { addToCart } from "../lib/cart";
import { showToast } from "./Toast";

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const inStock = product.stock > 0;

  function handleAdd() {
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`);
    setQty(1);
  }

  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-info">
        <div className="category">{product.category}</div>
        <h1>{product.name}</h1>
        <div className="price">{formatPrice(product.price)}</div>
        <p className="description">{product.description}</p>
        <div className="tags">
          {(product.tags || []).map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className={`stock-badge ${inStock ? "in-stock" : "out-of-stock"}`}>
          {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
        </div>
        {inStock && (
          <>
            <div className="quantity-selector">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
            <button className="btn btn-primary" onClick={handleAdd}>
              Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
