"use client";

import { Button } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  pageSizeOptions: number[];
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* Info + page size */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">
          {total === 0 ? "Sin resultados" : `${start}–${end} de ${total}`}
        </p>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded-md px-2 py-1
            focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>{s} por página</option>
          ))}
        </select>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="!px-1.5"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="!px-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-gray-600 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                p === page
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )}
            >
              {p}
            </button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="!px-1.5"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="!px-1.5"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
