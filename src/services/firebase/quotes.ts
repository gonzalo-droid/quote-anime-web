import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  DatabaseReference,
  DataSnapshot,
} from "firebase/database";
import { getDb } from "./config";
import { Quote, QuoteFormData, QuoteSize } from "@/types";
import { isQuoteSize } from "@/lib/quoteSize";

const QUOTES_PATH = "quotes";

function quotesRef(): DatabaseReference {
  return ref(getDb(), QUOTES_PATH);
}

function quoteRef(id: string): DatabaseReference {
  return ref(getDb(), `${QUOTES_PATH}/${id}`);
}

function snapshotToQuotes(snapshot: DataSnapshot): Quote[] {
  const data = snapshot.val();
  if (!data) return [];
  return Object.entries(data).map(([id, value]) => {
    const raw = value as Record<string, unknown>;
    return {
      id,
      anime: (raw.anime as string) ?? "",
      author: (raw.author as string) ?? "",
      quote: (raw.quote as string) ?? "",
      quoteEn: typeof raw.quoteEn === "string" && raw.quoteEn.trim() ? raw.quoteEn : null,
      categories: Array.isArray(raw.categories) && raw.categories.length > 0
        ? (raw.categories as Quote["categories"])
        : null,
      animeSlug: raw.animeSlug ? (raw.animeSlug as string) : null,
      size: isQuoteSize(raw.size) ? raw.size : null,
    };
  });
}

export function subscribeToQuotes(
  onData: (quotes: Quote[]) => void,
  onError: (error: Error) => void
): () => void {
  const r = quotesRef();
  const handler = (snapshot: DataSnapshot) => {
    onData(snapshotToQuotes(snapshot));
  };
  onValue(r, handler, onError);
  return () => off(r, "value", handler);
}

export async function createQuote(data: QuoteFormData): Promise<string> {
  const r = quotesRef();
  const newRef = push(r);
  await set(newRef, data);
  return newRef.key!;
}

export async function updateQuote(id: string, data: QuoteFormData): Promise<void> {
  await set(quoteRef(id), data);
}

/** Sets `size` on many quotes in a single atomic multi-path update. */
export async function setQuotesSize(ids: string[], size: QuoteSize): Promise<void> {
  if (ids.length === 0) return;
  const updates: Record<string, QuoteSize> = {};
  for (const id of ids) updates[`${id}/size`] = size;
  await update(quotesRef(), updates);
}

export async function deleteQuote(id: string): Promise<void> {
  await remove(quoteRef(id));
}

export async function importQuotes(
  items: QuoteFormData[],
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    const newRef = push(quotesRef());
    await set(newRef, items[i]);
    onProgress?.(i + 1, items.length);
  }
}
