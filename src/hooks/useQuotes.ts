"use client";

import { useEffect, useState, useCallback } from "react";
import { Quote, QuoteFormData } from "@/types";
import {
  subscribeToQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from "@/services/firebase/quotes";

interface UseQuotesReturn {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  create: (data: QuoteFormData) => Promise<string>;
  update: (id: string, data: QuoteFormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useQuotes(): UseQuotesReturn {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuotes(
      (data) => {
        setQuotes(data);
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

  const create = useCallback(async (data: QuoteFormData): Promise<string> => {
    return createQuote(data);
  }, []);

  const update = useCallback(async (id: string, data: QuoteFormData): Promise<void> => {
    return updateQuote(id, data);
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    return deleteQuote(id);
  }, []);

  return { quotes, loading, error, create, update, remove };
}
