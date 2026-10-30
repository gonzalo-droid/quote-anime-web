"use client";

import { ToastMessage } from "@/types";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
    },
    error: {
      icon: <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
      border: "border-red-500/30",
      bg: "bg-red-500/10",
    },
    info: {
      icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
    },
  }[toast.type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl",
        "bg-gray-900 backdrop-blur-sm w-80 max-w-full",
        "animate-in slide-in-from-right-4 duration-200",
        config.border,
        config.bg
      )}
    >
      {config.icon}
      <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-500 hover:text-gray-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
