import { Tv2, Zap, BookOpen, Images, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "quotes" | "imagenes";

interface HeaderProps {
  totalQuotes: number;
  totalAnimes: number;
  connected: boolean;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export function Header({
  totalQuotes,
  totalAnimes,
  connected,
  activeTab,
  onTabChange,
  userEmail,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Tv2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-100 leading-none">AnimeQuotes</h1>
            <p className="text-xs text-gray-500 leading-none mt-0.5">Dashboard</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
            <span>
              <span className="text-gray-200 font-medium">{totalQuotes}</span> quotes
            </span>
            <span className="text-gray-700">·</span>
            <span>
              <span className="text-gray-200 font-medium">{totalAnimes}</span> animes
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-red-400"
              }`}
            />
            <span className="text-xs text-gray-500 hidden sm:block">
              {connected ? "Conectado" : "Sin conexión"}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-1">
            <Zap className="w-3 h-3" />
            Tiempo real
          </div>

          {userEmail && onSignOut && (
            <div className="flex items-center gap-2 pl-3 border-l border-gray-800">
              <span className="hidden lg:block text-xs text-gray-500 truncate max-w-32" title={userEmail}>
                {userEmail}
              </span>
              <button
                onClick={onSignOut}
                className="text-gray-500 hover:text-gray-200 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 gap-1 border-t border-gray-800/50">
        <TabButton
          active={activeTab === "quotes"}
          onClick={() => onTabChange("quotes")}
          icon={<BookOpen className="w-3.5 h-3.5" />}
          label="Quotes"
        />
        <TabButton
          active={activeTab === "imagenes"}
          onClick={() => onTabChange("imagenes")}
          icon={<Images className="w-3.5 h-3.5" />}
          label="Imágenes"
        />
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all",
        active
          ? "border-indigo-500 text-indigo-400"
          : "border-transparent text-gray-500 hover:text-gray-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
