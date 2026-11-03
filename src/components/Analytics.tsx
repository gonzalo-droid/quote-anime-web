"use client";

import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Loaded via next/third-parties, which defers and optimizes the GA script
// so it doesn't compete with the page's own LCP/hydration work. Skipped on
// /admin so the owner's own visits don't pollute visitor analytics, and
// skipped entirely when no measurement ID is configured.
export default function Analytics() {
  const pathname = usePathname();

  if (!GA_MEASUREMENT_ID || pathname?.startsWith("/admin")) {
    return null;
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
