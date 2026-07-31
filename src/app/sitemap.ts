import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Actualizar manualmente esta fecha cuando cambie el contenido de la ruta.
const LAST_MODIFIED: Record<string, string> = {
  "": "2026-07-31",
  "/privacy-policy": "2026-07-13",
  "/terms-and-conditions": "2026-07-13",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/privacy-policy", "/terms-and-conditions"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED[route],
    changeFrequency: route === "" ? "weekly" : "yearly",
    priority: route === "" ? 1 : 0.3,
  }));
}
