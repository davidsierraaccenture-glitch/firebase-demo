"use client";

import { getAnalytics, isSupported, logEvent, setUserId } from "firebase/analytics";
import { app } from "./firebase";

let analyticsInstance = null;
let initPromise = null;

async function getAnalyticsInstance() {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const supported = await isSupported();
        if (!supported) return null;
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      } catch (err) {
        console.error("Analytics init failed:", err);
        return null;
      }
    })();
  }
  return initPromise;
}

export async function logAnalyticsEvent(name, params) {
  const instance = await getAnalyticsInstance();
  if (!instance) return;
  try {
    logEvent(instance, name, params);
  } catch (err) {
    console.error("logEvent failed:", err);
  }
}

export async function setAnalyticsUserId(uid) {
  const instance = await getAnalyticsInstance();
  if (!instance) return;
  try {
    setUserId(instance, uid);
  } catch (err) {
    console.error("setUserId failed:", err);
  }
}
