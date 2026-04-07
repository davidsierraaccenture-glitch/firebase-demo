import { apiGet } from "../../../lib/api";
import ProductDetail from "../../../components/ProductDetail";
import ReviewSection from "../../../components/ReviewSection";
import Toast from "../../../components/Toast";

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product = null;

  try {
    product = await apiGet(`/products/${id}`, { cache: "no-store" });
  } catch (err) {
    console.error("Failed to load product:", err);
  }

  if (!product) {
    return (
      <main className="container">
        <p className="loading">Product not found.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <ProductDetail product={product} />
      <ReviewSection productId={product.id} initialReviews={product.reviews || []} />
      <Toast />
    </main>
  );
}
