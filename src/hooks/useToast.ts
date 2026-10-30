"use client";

import { useState, useCallback } from "react";
import { ToastMessage } from "@/types";

interface UseToastReturn {
  toasts: ToastMessage[];
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  remove: (id: string) => void;
}

let idCounter = 0;

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const add = useCallback((type: ToastMessage["type"], message: string) => {
    const id = String(++idCounter);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    success: (m) => add("success", m),
    error: (m) => add("error", m),
    info: (m) => add("info", m),
    remove,
  };
}
