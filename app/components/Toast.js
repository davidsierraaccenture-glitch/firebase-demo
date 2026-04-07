"use client";

import { useEffect, useState } from "react";

export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleToast(e) {
      setMessage(e.detail);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    }
    window.addEventListener("show-toast", handleToast);
    return () => window.removeEventListener("show-toast", handleToast);
  }, []);

  return (
    <div className={`toast ${visible ? "show" : ""}`}>{message}</div>
  );
}

export function showToast(message) {
  window.dispatchEvent(new CustomEvent("show-toast", { detail: message }));
}

export function notifyCartUpdate() {
  window.dispatchEvent(new Event("cart-updated"));
}
