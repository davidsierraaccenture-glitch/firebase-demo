"use client";

import { getPerformance, trace } from "firebase/performance";
import { app } from "./firebase";

let performanceInstance = null;

function getPerformanceInstance() {
  if (typeof window === "undefined") return null;
  if (performanceInstance) return performanceInstance;
  try {
    performanceInstance = getPerformance(app);
    return performanceInstance;
  } catch (err) {
    console.error("Performance init failed:", err);
    return null;
  }
}

export function initPerformance() {
  getPerformanceInstance();
}

export function startTrace(name) {
  const instance = getPerformanceInstance();
  if (!instance) return { stop: () => {}, putAttribute: () => {} };
  try {
    const t = trace(instance, name);
    t.start();
    return t;
  } catch (err) {
    console.error("startTrace failed:", err);
    return { stop: () => {}, putAttribute: () => {} };
  }
}
