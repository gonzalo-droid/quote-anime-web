import { QuoteSize } from "@/types";

/** Longest quote (per language) that renders uncut in the mobile home-screen widget. */
export const HOME_WIDGET_MAX_CHARS = 60;

export const SIZE_OPTIONS: { value: QuoteSize; label: string; hint: string }[] = [
  { value: "xs", label: "XS", hint: `Cabe en el widget del home (máx. ${HOME_WIDGET_MAX_CHARS} caracteres por idioma)` },
  { value: "short", label: "Short", hint: "Frase corta — ideal para lock screen compacto" },
  { value: "medium", label: "Medium", hint: "Frase mediana" },
  { value: "long", label: "Long", hint: "Frase larga — puede no caber en widget pequeño" },
];

const SIZE_VALUES = new Set<string>(SIZE_OPTIONS.map((o) => o.value));

export function isQuoteSize(value: unknown): value is QuoteSize {
  return typeof value === "string" && SIZE_VALUES.has(value);
}

/** True when every provided translation fits the home widget. */
export function fitsHomeWidget(quote: string, quoteEn: string | null): boolean {
  return [quote, quoteEn ?? ""].every((text) => text.trim().length <= HOME_WIDGET_MAX_CHARS);
}
