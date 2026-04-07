"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, renderStars } from "../lib/utils";

export default function ProductGrid({ products }) {
  const [filter, setFilter] = useState("all");
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div className="filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.length === 0 && <p className="loading">No products found.</p>}
        {filtered.map((p) => (
          <Link href={`/product/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="product-card">
              <img src={p.imageUrl} alt={p.name} loading="lazy" />
              <div className="product-card-body">
                <div className="category">{p.category}</div>
                <h3>{p.name}</h3>
                <div className="rating">
                  {renderStars(p.rating)} <span className="count">({p.reviewCount})</span>
                </div>
                <div className="price">{formatPrice(p.price)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
