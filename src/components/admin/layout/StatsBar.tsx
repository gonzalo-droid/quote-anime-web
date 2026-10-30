import { Quote } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { BookOpen, Tag, Tv2, Users } from "lucide-react";

interface StatsBarProps {
  quotes: Quote[];
}

export function StatsBar({ quotes }: StatsBarProps) {
  const totalAnimes = new Set(quotes.map((q) => q.anime)).size;
  const totalAuthors = new Set(quotes.map((q) => q.author)).size;

  const categoryCount = CATEGORIES.map((cat) => ({
    cat,
    count: quotes.filter((q) => q.categories?.includes(cat)).length,
  }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={<BookOpen className="w-4 h-4" />} label="Total quotes" value={quotes.length} color="indigo" />
      <StatCard icon={<Tv2 className="w-4 h-4" />} label="Animes" value={totalAnimes} color="violet" />
      <StatCard icon={<Users className="w-4 h-4" />} label="Autores" value={totalAuthors} color="blue" />
      <StatCard icon={<Tag className="w-4 h-4" />} label="Categorías únicas" value={categoryCount.length} color="emerald" />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "indigo" | "violet" | "blue" | "emerald";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  }[color];

  return (
    <div className={`rounded-xl p-4 border ${colors.border} ${colors.bg} flex items-center gap-3`}>
      <div className={`flex-shrink-0 ${colors.text}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
