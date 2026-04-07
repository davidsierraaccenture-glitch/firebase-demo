import { apiGet } from "../lib/api";
import ProductGrid from "../components/ProductGrid";
import Toast from "../components/Toast";

export default async function HomePage() {
  let products = [];
  try {
    const res = await apiGet("/products", { cache: "no-store" });
    products = res.data;
  } catch (err) {
    console.error("Failed to load products:", err);
  }

  return (
    <main className="container">
      <div className="hero">
        <h1>Welcome to Acme Shop</h1>
        <p>Quality products, delivered fast.</p>
      </div>
      <ProductGrid products={products} />
      <Toast />
    </main>
  );
}
