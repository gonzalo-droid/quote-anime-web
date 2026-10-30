"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Modal } from "@/components/admin/ui/Modal";
import { Button } from "@/components/admin/ui/Button";
import { QuoteFormData, Category } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { Upload, FileJson, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VALID_CATEGORIES = new Set<string>(CATEGORIES);

interface ParsedRow {
  index: number;
  data: QuoteFormData;
  warnings: string[];
}

interface ParseError {
  index: number;
  message: string;
}

interface ImportQuotesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (quotes: QuoteFormData[]) => Promise<void>;
}

function parseJson(raw: unknown): { rows: ParsedRow[]; errors: ParseError[] } {
  if (!Array.isArray(raw)) {
    return {
      rows: [],
      errors: [{ index: -1, message: "El archivo debe contener un array JSON en la raíz." }],
    };
  }

  const rows: ParsedRow[] = [];
  const errors: ParseError[] = [];

  raw.forEach((item, i) => {
    if (typeof item !== "object" || item === null) {
      errors.push({ index: i, message: `Elemento ${i + 1}: no es un objeto.` });
      return;
    }

    const obj = item as Record<string, unknown>;
    const missing: string[] = [];

    if (!obj.quote || typeof obj.quote !== "string" || !obj.quote.trim())
      missing.push("quote");
    if (!obj.author || typeof obj.author !== "string" || !obj.author.trim())
      missing.push("author");
    if (!obj.anime || typeof obj.anime !== "string" || !obj.anime.trim())
      missing.push("anime");

    if (missing.length) {
      errors.push({
        index: i,
        message: `Elemento ${i + 1}: faltan campos obligatorios: ${missing.join(", ")}.`,
      });
      return;
    }

    const warnings: string[] = [];

    let categories: Category[] | null = null;
    if (obj.categories !== undefined) {
      if (!Array.isArray(obj.categories)) {
        warnings.push("categories ignorado (no es array)");
      } else {
        const valid = (obj.categories as unknown[]).filter(
          (c): c is Category => typeof c === "string" && VALID_CATEGORIES.has(c)
        );
        const invalid = (obj.categories as unknown[]).filter(
          (c) => typeof c !== "string" || !VALID_CATEGORIES.has(c as string)
        );
        if (invalid.length) warnings.push(`categorías inválidas ignoradas: ${invalid.join(", ")}`);
        categories = valid.length > 0 ? valid : null;
      }
    }

    let animeSlug: string | null = null;
    if (obj.animeSlug !== undefined) {
      if (typeof obj.animeSlug === "string" && obj.animeSlug.trim()) {
        animeSlug = obj.animeSlug.trim();
      } else {
        warnings.push("animeSlug ignorado (inválido)");
      }
    }

    rows.push({
      index: i,
      data: {
        quote: (obj.quote as string).trim(),
        author: (obj.author as string).trim(),
        anime: (obj.anime as string).trim(),
        categories,
        animeSlug,
        size: null,
      },
      warnings,
    });
  });

  return { rows, errors };
}

export function ImportQuotesModal({ open, onClose, onImport }: ImportQuotesModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [done, setDone] = useState(false);

  function reset() {
    setFileName(null);
    setRows([]);
    setErrors([]);
    setImporting(false);
    setProgress(null);
    setDone(false);
  }

  function handleClose() {
    if (importing) return;
    reset();
    onClose();
  }

  function processFile(file: File) {
    if (!file.name.endsWith(".json")) {
      setErrors([{ index: -1, message: "Solo se aceptan archivos .json" }]);
      setRows([]);
      setFileName(file.name);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const { rows: r, errors: errs } = parseJson(parsed);
        setRows(r);
        setErrors(errs);
      } catch {
        setErrors([{ index: -1, message: "El archivo no es un JSON válido." }]);
        setRows([]);
      }
    };
    reader.readAsText(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  async function handleImport() {
    if (!rows.length || importing) return;
    setImporting(true);
    setProgress({ done: 0, total: rows.length });
    try {
      for (let i = 0; i < rows.length; i++) {
        await onImport([rows[i].data]);
        setProgress({ done: i + 1, total: rows.length });
      }
      setDone(true);
    } finally {
      setImporting(false);
    }
  }

  const hasData = rows.length > 0 || errors.length > 0;

  return (
    <Modal open={open} onClose={handleClose} title="Importar quotes desde JSON" size="xl">
      <div className="flex flex-col gap-5">

        {/* Format hint */}
        {!hasData && (
          <div className="rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3 text-xs text-gray-400 space-y-1">
            <p className="font-medium text-gray-300">Formato esperado:</p>
            <pre className="text-gray-500 overflow-x-auto">{`[
  {
    "anime": "Naruto",        // requerido
    "author": "Naruto Uzumaki", // requerido
    "quote": "Texto...",      // requerido
    "categories": ["motivación", "lucha"], // opcional
    "animeSlug": "naruto"     // opcional
  }
]`}</pre>
          </div>
        )}

        {/* Drop zone */}
        {!done && (
          <div
            onClick={() => !importing && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors",
              dragging
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-gray-700 hover:border-gray-600 bg-gray-800/40"
            )}
          >
            {fileName ? (
              <>
                <FileJson className="w-8 h-8 text-indigo-400" />
                <p className="text-sm font-medium text-gray-200">{fileName}</p>
                <p className="text-xs text-gray-500">Haz clic para cambiar el archivo</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500" />
                <p className="text-sm text-gray-400">
                  Arrastra un archivo <span className="text-gray-200 font-medium">.json</span> o haz clic para seleccionarlo
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.length} error{errors.length !== 1 ? "es" : ""} encontrado{errors.length !== 1 ? "s" : ""}
            </p>
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-red-300/80">{err.message}</p>
            ))}
          </div>
        )}

        {/* Success import */}
        {done && (
          <div className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-300">
                {rows.length} quote{rows.length !== 1 ? "s" : ""} importada{rows.length !== 1 ? "s" : ""} correctamente
              </p>
              <p className="text-xs text-green-400/70 mt-0.5">Puedes cerrar esta ventana.</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {importing && progress && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Insertando quotes...</span>
              <span>{progress.done} / {progress.total}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-150"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Preview table */}
        {rows.length > 0 && !done && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-400">
              Vista previa — {rows.length} quote{rows.length !== 1 ? "s" : ""} válida{rows.length !== 1 ? "s" : ""}
            </p>
            <div className="rounded-lg border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-900 border-b border-gray-800">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium w-6">#</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">Anime</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">Autor</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">Quote</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-medium">Categorías</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.index} className="border-t border-gray-800/60 hover:bg-gray-800/30">
                        <td className="px-3 py-2 text-gray-600">{row.index + 1}</td>
                        <td className="px-3 py-2 text-gray-300 whitespace-nowrap">{row.data.anime}</td>
                        <td className="px-3 py-2 text-gray-300 whitespace-nowrap">{row.data.author}</td>
                        <td className="px-3 py-2 text-gray-400 max-w-xs truncate" title={row.data.quote}>
                          {row.data.quote}
                        </td>
                        <td className="px-3 py-2">
                          {row.data.categories ? (
                            <span className="text-indigo-400">{row.data.categories.join(", ")}</span>
                          ) : (
                            <span className="text-gray-700">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {rows.some((r) => r.warnings.length > 0) && (
              <p className="text-xs text-yellow-500/80 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Algunos elementos tienen advertencias. Se importarán sin los campos inválidos.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            {done ? "Cerrar" : "Cancelar"}
          </Button>
          {!done && (
            <Button
              onClick={handleImport}
              loading={importing}
              disabled={rows.length === 0 || importing}
            >
              <Upload className="w-4 h-4" />
              Importar {rows.length > 0 ? `${rows.length} quote${rows.length !== 1 ? "s" : ""}` : ""}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
