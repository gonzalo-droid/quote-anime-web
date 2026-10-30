"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/lib/constants";

const STORAGE_KEY = "hideDownloadBar";

export default function StickyDownloadBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only available client-side, so this can't be read during render/SSR.
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-surface/95 border-t border-accent/20 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3"
        >
          <span className="text-textPrimary text-sm font-semibold shrink-0">
            Descarga Quote Anime
          </span>
          <div className="flex items-center gap-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Descargar en Google Play"
              className="bg-accent text-canvas text-xs font-semibold px-3 py-2 rounded-lg"
            >
              Google Play
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Descargar en App Store"
              className="border border-accent/40 text-accent text-xs font-semibold px-3 py-2 rounded-lg"
            >
              App Store
            </a>
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              className="text-textSecondary hover:text-accent p-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
