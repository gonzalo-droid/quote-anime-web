import { Quote, QuoteFilters, SortConfig } from "@/types";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function filterQuotes(quotes: Quote[], filters: QuoteFilters): Quote[] {
  return quotes.filter((q) => {
    const search = filters.search.toLowerCase().trim();
    if (search) {
      const matchesAuthor = q.author.toLowerCase().includes(search);
      const matchesQuote = q.quote.toLowerCase().includes(search);
      if (!matchesAuthor && !matchesQuote) return false;
    }

    if (filters.anime) {
      if (!q.anime.toLowerCase().includes(filters.anime.toLowerCase())) {
        return false;
      }
    }

    if (filters.categories.length > 0) {
      if (!q.categories) return false;
      const hasAll = filters.categories.every((c) => q.categories!.includes(c));
      if (!hasAll) return false;
    }

    if (filters.size) {
      if (q.size !== filters.size) return false;
    }

    return true;
  });
}

export function sortQuotes(quotes: Quote[], sort: SortConfig): Quote[] {
  return [...quotes].sort((a, b) => {
    const aVal = a[sort.field].toLowerCase();
    const bVal = b[sort.field].toLowerCase();
    const cmp = aVal.localeCompare(bVal);
    return sort.direction === "asc" ? cmp : -cmp;
  });
}

export function paginateQuotes<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getUniqueAnimes(quotes: Quote[]): string[] {
  return Array.from(new Set(quotes.map((q) => q.anime))).sort();
}
