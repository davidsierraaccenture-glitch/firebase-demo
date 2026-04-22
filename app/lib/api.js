import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://us-central1-fir-demo-69c51.cloudfunctions.net/api";

export async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json" };

  // Attach auth token if user is signed in
  if (typeof window !== "undefined" && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export function apiGet(path, options = {}) {
  return apiFetch(path, options);
}

export function apiPost(path, body) {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}
