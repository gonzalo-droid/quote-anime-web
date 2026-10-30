import {
  ref,
  set,
  remove,
  onValue,
  off,
  DataSnapshot,
} from "firebase/database";
import { getDb } from "./config";
import { AnimeImagesMap } from "@/types";

const IMAGENES_PATH = "imagenes";

function imagenesRef() {
  return ref(getDb(), IMAGENES_PATH);
}

function animeRef(slug: string) {
  return ref(getDb(), `${IMAGENES_PATH}/${slug}`);
}

function snapshotToMap(snapshot: DataSnapshot): AnimeImagesMap {
  const data = snapshot.val();
  if (!data) return {};

  const result: AnimeImagesMap = {};
  for (const [slug, value] of Object.entries(data)) {
    // Firebase may return array-like objects ({0: url, 1: url}) or actual arrays
    if (Array.isArray(value)) {
      result[slug] = value.filter((v): v is string => typeof v === "string");
    } else if (value && typeof value === "object") {
      result[slug] = Object.values(value as Record<string, string>).filter(
        (v): v is string => typeof v === "string"
      );
    }
  }
  return result;
}

export function subscribeToImagenes(
  onData: (map: AnimeImagesMap) => void,
  onError: (error: Error) => void
): () => void {
  const r = imagenesRef();
  const handler = (snapshot: DataSnapshot) => {
    onData(snapshotToMap(snapshot));
  };
  onValue(r, handler, onError);
  return () => off(r, "value", handler);
}

export async function addImageUrl(slug: string, url: string, currentUrls: string[]): Promise<void> {
  const updated = [...currentUrls.filter((u) => u !== url), url];
  await set(animeRef(slug), updated);
}

export async function removeImageUrl(slug: string, url: string, currentUrls: string[]): Promise<void> {
  const updated = currentUrls.filter((u) => u !== url);
  if (updated.length === 0) {
    await remove(animeRef(slug));
  } else {
    await set(animeRef(slug), updated);
  }
}

export async function createAnimeEntry(slug: string): Promise<void> {
  await set(animeRef(slug), []);
}

export async function deleteAnimeEntry(slug: string): Promise<void> {
  await remove(animeRef(slug));
}
