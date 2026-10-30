"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimeImagesMap } from "@/types";
import {
  subscribeToImagenes,
  addImageUrl,
  removeImageUrl,
  createAnimeEntry,
  deleteAnimeEntry,
} from "@/services/firebase/imagenes";

interface UseImagenesReturn {
  imagenesMap: AnimeImagesMap;
  loading: boolean;
  error: string | null;
  addUrl: (slug: string, url: string) => Promise<void>;
  removeUrl: (slug: string, url: string) => Promise<void>;
  createAnime: (slug: string) => Promise<void>;
  deleteAnime: (slug: string) => Promise<void>;
}

export function useImagenes(): UseImagenesReturn {
  const [imagenesMap, setImagenesMap] = useState<AnimeImagesMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToImagenes(
      (map) => {
        setImagenesMap(map);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addUrl = useCallback(async (slug: string, url: string) => {
    const current = imagenesMap[slug] ?? [];
    await addImageUrl(slug, url, current);
  }, [imagenesMap]);

  const removeUrl = useCallback(async (slug: string, url: string) => {
    const current = imagenesMap[slug] ?? [];
    await removeImageUrl(slug, url, current);
  }, [imagenesMap]);

  const createAnime = useCallback(async (slug: string) => {
    await createAnimeEntry(slug);
  }, []);

  const deleteAnime = useCallback(async (slug: string) => {
    await deleteAnimeEntry(slug);
  }, []);

  return { imagenesMap, loading, error, addUrl, removeUrl, createAnime, deleteAnime };
}
