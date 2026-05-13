"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logAnalyticsEvent } from "../lib/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    logAnalyticsEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
