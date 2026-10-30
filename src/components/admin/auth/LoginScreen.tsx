"use client";

import { Tv2, AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onSignIn: () => void;
  error: string | null;
}

export function LoginScreen({ onSignIn, error }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Tv2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-100">AnimeQuotes Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Inicia sesión con tu cuenta de Google autorizada.
          </p>
        </div>

        {error && (
          <div className="w-full flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300/90">{error}</p>
          </div>
        )}

        <button
          onClick={onSignIn}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium px-4 py-2.5 transition-colors"
        >
          <GoogleIcon className="w-4 h-4" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.2 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.3 5.3C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}
