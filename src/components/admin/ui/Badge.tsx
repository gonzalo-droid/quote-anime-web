import { Category } from "@/types";
import { CATEGORY_COLORS } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface BadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: BadgeProps) {
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {category}
    </span>
  );
}
