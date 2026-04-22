"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const { user, loading, login, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      const cart = JSON.parse(localStorage.getItem("acme-cart") || "[]");
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    }
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">
          Acme<span>Shop</span>
        </Link>
        <nav>
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            Products
          </Link>
          <Link href="/cart" className={`cart-link ${pathname === "/cart" ? "active" : ""}`}>
            🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {!loading && (
            user ? (
              <span className="user-menu">
                {user.photoURL && <img src={user.photoURL} alt="" className="user-avatar" referrerPolicy="no-referrer" />}
                <span className="user-name">{user.displayName || user.email}</span>
                <button onClick={logout} className="auth-btn">Sign Out</button>
              </span>
            ) : (
              <Link href="/login" className="auth-btn">Sign In</Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
