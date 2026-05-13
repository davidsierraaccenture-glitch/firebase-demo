"use client";

import { useEffect } from "react";
import { initPerformance } from "../lib/performance";

export default function PerformanceProvider() {
  useEffect(() => {
    initPerformance();
  }, []);

  return null;
}
