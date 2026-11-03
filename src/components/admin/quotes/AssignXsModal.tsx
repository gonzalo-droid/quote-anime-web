"use client";

import { useMemo, useState } from "react";
import { Quote } from "@/types";
import { Modal } from "@/components/admin/ui/Modal";
import { Button } from "@/components/admin/ui/Button";
import { fitsHomeWidget, HOME_WIDGET_MAX_CHARS } from "@/lib/quoteSize";
import { truncate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface AssignXsModalProps {
  open: boolean;
  quotes: Quote[];
  onClose: () => void;
  onConfirm: (ids: string[]) => Promise<void>;
}

export function AssignXsModal({ open, quotes, onClose, onConfirm }: AssignXsModalProps) {
  const [includeSized, setIncludeSized] = useState(false);
  const [saving, setSaving] = useState(false);

  const { unsized, sized } = useMemo(() => {
    const candidates = quotes.filter((q) => q.size !== "xs" && fitsHomeWidget(q.quote, q.quoteEn));
    return {
      unsized: candidates.filter((q) => !q.size),
      sized: candidates.filter((q) => q.size),
    };
  }, [quotes]);

  const selected = includeSized ? [...unsized, ...sized] : unsized;

  function handleClose() {
    if (saving) return;
    setIncludeSized(false);
    onClose();
  }

  async function handleConfirm() {
    setSaving(true);
    try {
      await onConfirm(selected.map((q) => q.id));
      setIncludeSized(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Asignar XS (widget del home)" size="lg">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-400">
          Marca como <span className="font-semibold text-emerald-300">XS</span> las frases con máximo{" "}
          {HOME_WIDGET_MAX_CHARS} caracteres en cada idioma.
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-gray-800 bg-gray-800/40 px-3 py-2">
            <p className="text-2xl font-bold text-gray-100">{unsized.length}</p>
            <p className="text-xs text-gray-500">caben y no tienen tamaño</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-800/40 px-3 py-2">
            <p className="text-2xl font-bold text-gray-100">{sized.length}</p>
            <p className="text-xs text-gray-500">caben pero ya tienen otro tamaño</p>
          </div>
        </div>

        {sized.length > 0 && (
          <label className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSized}
              onChange={(e) => setIncludeSized(e.target.checked)}
              className="mt-0.5 accent-amber-400"
            />
            <span>
              <span className="flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Incluir también las {sized.length} que ya tienen short/medium/long
              </span>
              Si la app arma el widget de la pantalla de bloqueo filtrando solo{" "}
              <code>size == &quot;short&quot;</code>, esas frases dejarían de aparecer ahí hasta que la app
              trate XS como &quot;short o más corta&quot;.
            </span>
          </label>
        )}

        {selected.length > 0 ? (
          <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-800 divide-y divide-gray-800/60">
            {selected.map((q) => (
              <div key={q.id} className="flex items-start justify-between gap-3 px-3 py-2 text-xs">
                <div className="min-w-0">
                  <p className="text-gray-300 italic">&ldquo;{truncate(q.quote, 80)}&rdquo;</p>
                  <p className="text-gray-600">{q.anime} · {q.author}</p>
                </div>
                <div className="shrink-0 text-right text-gray-500">
                  <p>{q.quote.trim().length} ES{q.quoteEn ? ` · ${q.quoteEn.trim().length} EN` : ""}</p>
                  {q.size && <p className="uppercase">{q.size} → xs</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-gray-800 px-3 py-6 text-center text-sm text-gray-500">
            {unsized.length + sized.length === 0
              ? "Todas las frases que caben en el widget ya tienen XS."
              : "Marca la casilla de arriba para incluir las frases que ya tienen tamaño."}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} loading={saving} disabled={selected.length === 0}>
            Asignar XS a {selected.length} frase{selected.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
