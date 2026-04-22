"use client";

import { useState } from "react";
import { renderStars } from "../lib/utils";
import { apiPost } from "../lib/api";
import { showToast } from "./Toast";
import { useAuth } from "./AuthProvider";

export default function ReviewSection({ productId, initialReviews }) {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      login();
      return;
    }
    setSubmitting(true);

    try {
      await apiPost("/reviews", {
        productId,
        userName: user.displayName || "Anonymous",
        rating: parseInt(rating),
        comment,
      });
      setReviews([
        { userName: user.displayName, rating: parseInt(rating), comment, createdAt: new Date().toISOString() },
        ...reviews,
      ]);
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
        {user ? (
          <form onSubmit={handleSubmit}>
            <p style={{ marginBottom: "16px", color: "var(--text-light)" }}>
              Posting as <strong>{user.displayName}</strong>
            </p>
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
        ) : (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <p style={{ marginBottom: "12px", color: "var(--text-light)" }}>Sign in to write a review</p>
            <button className="btn btn-primary" onClick={login}>Sign in with Google</button>
          </div>
        )}
      </div>
    </div>
  );
}
