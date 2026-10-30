"use client";

import { Category, QuoteSize } from "@/types";
import { QuoteFilters as FiltersType } from "@/types";
import { Input } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { CategoryBadge } from "@/components/admin/ui/Badge";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const SIZE_OPTIONS: { value: QuoteSize; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

interface QuoteFiltersProps {
  filters: FiltersType;
  animeOptions: string[];
  activeFilterCount: number;
  onSearchChange: (v: string) => void;
  onAnimeChange: (v: string) => void;
  onToggleCategory: (c: Category) => void;
  onSizeChange: (v: QuoteSize | null) => void;
  onClear: () => void;
}

export function QuoteFilters({
  filters,
  animeOptions,
  activeFilterCount,
  onSearchChange,
  onAnimeChange,
  onToggleCategory,
  onSizeChange,
  onClear,
}: QuoteFiltersProps) {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Buscar por autor o frase..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              filters.search ? (
                <button onClick={() => onSearchChange("")} className="pointer-events-auto text-gray-400 hover:text-gray-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null
            }
          />
        </div>

        {/* Anime select */}
        <div className="min-w-44">
          <select
            value={filters.anime}
            onChange={(e) => onAnimeChange(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-100 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              hover:border-gray-600 transition-all"
          >
            <option value="">Todos los animes</option>
            {animeOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Size select */}
        <div className="min-w-44">
          <select
            value={filters.size ?? ""}
            onChange={(e) => onSizeChange((e.target.value as QuoteSize) || null)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-100 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              hover:border-gray-600 transition-all"
          >
            <option value="">Todos los tamaños</option>
            {SIZE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Category toggle */}
        <Button
          variant={showCategories || filters.categories.length > 0 ? "secondary" : "outline"}
          size="md"
          onClick={() => setShowCategories((v) => !v)}
        >
          <Filter className="w-4 h-4" />
          Categorías
          {filters.categories.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold leading-none">
              {filters.categories.length}
            </span>
          )}
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showCategories && "rotate-180")} />
        </Button>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="md" onClick={onClear}>
            <X className="w-4 h-4" />
            Limpiar ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Category chips */}
      {showCategories && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-800">
          {CATEGORIES.map((cat) => {
            const isActive = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={cn(
                  "transition-all duration-150 rounded-full",
                  isActive ? "ring-2 ring-indigo-500 ring-offset-1 ring-offset-gray-900" : "opacity-60 hover:opacity-100"
                )}
              >
                <CategoryBadge category={cat} />
              </button>
            );
          })}
        </div>
      )}

      {/* Active category filter pills */}
      {!showCategories && filters.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
            >
              <CategoryBadge category={cat} />
              <X className="w-3 h-3 text-gray-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
