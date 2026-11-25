import { GoogleAnalytics } from "@next/third-parties/google";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Loaded via next/third-parties, which defers and optimizes the GA script
// so it doesn't compete with the page's own LCP/hydration work. Skipped
// entirely when no measurement ID is configured.
export default function Analytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
