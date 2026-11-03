"use client";

import { useState, useMemo } from "react";
import { Quote, QuoteFilters, QuoteSize, SortConfig, Category, TranslationFilter, HomeWidgetFilter } from "@/types";
import { filterQuotes, sortQuotes } from "@/lib/utils";

const DEFAULT_FILTERS: QuoteFilters = {
  search: "",
  anime: "",
  categories: [],
  size: null,
  translation: "all",
  homeWidget: "all",
};

const DEFAULT_SORT: SortConfig = {
  field: "anime",
  direction: "asc",
};

interface UseFiltersReturn {
  filters: QuoteFilters;
  sort: SortConfig;
  filteredQuotes: Quote[];
  setSearch: (v: string) => void;
  setAnime: (v: string) => void;
  toggleCategory: (c: Category) => void;
  setSize: (v: QuoteSize | null) => void;
  setTranslation: (v: TranslationFilter) => void;
  setHomeWidget: (v: HomeWidgetFilter) => void;
  setSort: (field: SortConfig["field"]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

export function useFilters(quotes: Quote[]): UseFiltersReturn {
  const [filters, setFilters] = useState<QuoteFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortConfig>(DEFAULT_SORT);

  const filteredQuotes = useMemo(
    () => sortQuotes(filterQuotes(quotes, filters), sort),
    [quotes, filters, sort]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.anime) count++;
    if (filters.size) count++;
    if (filters.translation !== "all") count++;
    if (filters.homeWidget !== "all") count++;
    count += filters.categories.length;
    return count;
  }, [filters]);

  function setSearch(v: string) {
    setFilters((f) => ({ ...f, search: v }));
  }

  function setAnime(v: string) {
    setFilters((f) => ({ ...f, anime: v }));
  }

  function setSize(v: QuoteSize | null) {
    setFilters((f) => ({ ...f, size: v }));
  }

  function setTranslation(v: TranslationFilter) {
    setFilters((f) => ({ ...f, translation: v }));
  }

  function setHomeWidget(v: HomeWidgetFilter) {
    setFilters((f) => ({ ...f, homeWidget: v }));
  }

  function toggleCategory(c: Category) {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(c)
        ? f.categories.filter((x) => x !== c)
        : [...f.categories, c],
    }));
  }

  function handleSetSort(field: SortConfig["field"]) {
    setSort((s) =>
      s.field === field
        ? { field, direction: s.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return {
    filters,
    sort,
    filteredQuotes,
    setSearch,
    setAnime,
    toggleCategory,
    setSize,
    setTranslation,
    setHomeWidget,
    setSort: handleSetSort,
    clearFilters,
    activeFilterCount,
  };
}
