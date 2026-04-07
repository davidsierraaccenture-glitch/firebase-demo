"use client";

import { useState } from "react";
import { renderStars } from "../lib/utils";
import { apiPost } from "../lib/api";
import { showToast } from "./Toast";

export default function ReviewSection({ productId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiPost("/reviews", {
        productId,
        userName: name,
        rating: parseInt(rating),
        comment,
      });
      setReviews([
        { userName: name, rating: parseInt(rating), comment, createdAt: new Date().toISOString() },
        ...reviews,
      ]);
      setName("");
      setRating("5");
      setComment("");
      showToast("Review submitted!");
    } catch (err) {
      showToast("Failed to submit review.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="reviews-section">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.length === 0 && <p>No reviews yet. Be the first!</p>}
      {reviews.map((r, i) => (
        <div className="review-card" key={i}>
          <div className="review-header">
            <span className="review-author">{r.userName}</span>
            <span className="review-rating">{renderStars(r.rating)}</span>
          </div>
          <p className="review-comment">{r.comment}</p>
        </div>
      ))}

      <div className="review-form">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rev-name">Your Name</label>
            <input id="rev-name" type="text" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="rev-rating">Rating</label>
            <select id="rev-rating" required value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="rev-comment">Comment</label>
            <textarea id="rev-comment" required maxLength={500} placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
