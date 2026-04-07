"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../components/AuthProvider";
import Toast, { showToast } from "../../components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push("/");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        showToast("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Signed in!");
      }
      router.push("/");
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use"
        ? "Email already in use"
        : err.code === "auth/wrong-password" || err.code === "auth/invalid-credential"
        ? "Invalid email or password"
        : err.code === "auth/weak-password"
        ? "Password must be at least 6 characters"
        : err.code === "auth/invalid-email"
        ? "Invalid email address"
        : err.message;
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="auth-page">
        <div className="auth-card">
          <h1>{isSignUp ? "Create Account" : "Sign In"}</h1>
          <p className="auth-subtitle">
            {isSignUp ? "Join Acme Shop to place orders and leave reviews" : "Welcome back to Acme Shop"}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="auth-name">Display Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="auth-toggle">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" className="link-btn" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
      <Toast />
    </main>
  );
}
