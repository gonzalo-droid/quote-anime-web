"use client";

import { useState, useMemo, useEffect } from "react";
import { paginateQuotes } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

interface UsePaginationReturn<T> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  paginated: T[];
  pageSizeOptions: number[];
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

export function usePagination<T>(items: T[]): UsePaginationReturn<T> {
  const [page, setPageRaw] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(DEFAULT_PAGE_SIZE);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Reset to page 1 when items change significantly
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally resets pagination whenever the result count changes.
    setPageRaw(1);
  }, [total]);

  const paginated = useMemo(
    () => paginateQuotes(items, page, pageSize),
    [items, page, pageSize]
  );

  function setPage(p: number) {
    setPageRaw(Math.min(Math.max(1, p), totalPages));
  }

  function setPageSize(s: number) {
    setPageSizeRaw(s);
    setPageRaw(1);
  }

  function goNext() {
    setPage(page + 1);
  }

  function goPrev() {
    setPage(page - 1);
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    paginated,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    setPage,
    setPageSize,
    goNext,
    goPrev,
  };
}
