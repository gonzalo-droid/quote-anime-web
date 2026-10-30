export type Category =
  | "motivación"
  | "lucha"
  | "tristeza"
  | "amor"
  | "amistad"
  | "reflexión"
  | "soledad"
  | "sacrificio"
  | "esperanza"
  | "orgullo";

export type QuoteSize = "short" | "medium" | "long";

export interface Quote {
  id: string;
  anime: string;
  author: string;
  quote: string;
  categories: Category[] | null;
  animeSlug: string | null;
  size: QuoteSize | null;
}

export type QuoteFormData = Omit<Quote, "id">;

export interface QuoteFilters {
  search: string;
  anime: string;
  categories: Category[];
  size: QuoteSize | null;
}

export type SortField = "anime" | "author" | "quote";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

/** Map of animeSlug → array of image URLs (from "imagenes" Firebase node) */
export type AnimeImagesMap = Record<string, string[]>;

/** Flat entry used for rendering the imagenes table */
export interface AnimeImageEntry {
  slug: string;
  urls: string[];
}
