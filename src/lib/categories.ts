import { Category } from "@/types";

export const CATEGORIES: Category[] = [
  "motivación",
  "lucha",
  "tristeza",
  "amor",
  "amistad",
  "reflexión",
  "soledad",
  "sacrificio",
  "esperanza",
  "orgullo",
];

export const MIN_CATEGORIES = 1;
export const MAX_CATEGORIES = 4;

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  motivación: { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/40" },
  lucha:      { bg: "bg-red-500/20",    text: "text-red-300",    border: "border-red-500/40" },
  tristeza:   { bg: "bg-blue-500/20",   text: "text-blue-300",   border: "border-blue-500/40" },
  amor:       { bg: "bg-pink-500/20",   text: "text-pink-300",   border: "border-pink-500/40" },
  amistad:    { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/40" },
  reflexión:  { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/40" },
  soledad:    { bg: "bg-slate-500/20",  text: "text-slate-300",  border: "border-slate-500/40" },
  sacrificio: { bg: "bg-rose-500/20",   text: "text-rose-300",   border: "border-rose-500/40" },
  esperanza:  { bg: "bg-emerald-500/20",text: "text-emerald-300",border: "border-emerald-500/40" },
  orgullo:    { bg: "bg-violet-500/20", text: "text-violet-300", border: "border-violet-500/40" },
};

export function isValidCategory(value: string): value is Category {
  return CATEGORIES.includes(value as Category);
}

export function validateCategories(categories: Category[]): string | null {
  if (categories.length < MIN_CATEGORIES) {
    return `Debes seleccionar al menos ${MIN_CATEGORIES} categorías.`;
  }
  if (categories.length > MAX_CATEGORIES) {
    return `Máximo ${MAX_CATEGORIES} categorías permitidas.`;
  }
  const invalid = categories.filter((c) => !isValidCategory(c));
  if (invalid.length > 0) {
    return `Categorías no válidas: ${invalid.join(", ")}`;
  }
  return null;
}
