"use client";

import { Category } from "@/types";
import { CATEGORIES, CATEGORY_COLORS, MAX_CATEGORIES, MIN_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selected: Category[];
  onChange: (categories: Category[]) => void;
  error?: string;
}

export function CategorySelector({ selected, onChange, error }: CategorySelectorProps) {
  function toggle(cat: Category) {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else if (selected.length < MAX_CATEGORIES) {
      onChange([...selected, cat]);
    }
  }

  const isAtMax = selected.length >= MAX_CATEGORIES;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Categorías</label>
        <span className="text-xs text-gray-500">
          {selected.length}/{MAX_CATEGORIES} (min. {MIN_CATEGORIES})
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat);
          const colors = CATEGORY_COLORS[cat];
          const isDisabled = !isSelected && isAtMax;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cat)}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                "transition-all duration-150 cursor-pointer",
                isSelected
                  ? cn(colors.bg, colors.text, colors.border, "ring-1 ring-offset-1 ring-offset-gray-900", colors.border)
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
