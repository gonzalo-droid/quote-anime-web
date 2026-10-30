"use client";

import { useState } from "react";
import { Quote, SortConfig, AnimeImagesMap } from "@/types";
import { CategoryBadge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { ImagePreviewModal } from "@/components/admin/ui/ImagePreviewModal";
import { cn, truncate, copyToClipboard } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Copy,
  Check,
  ImageOff,
  ZoomIn,
} from "lucide-react";

interface QuoteTableProps {
  quotes: Quote[];
  sort: SortConfig;
  imagenesMap: AnimeImagesMap;
  onSort: (field: SortConfig["field"]) => void;
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

function SortIcon({ field, sort }: { field: SortConfig["field"]; sort: SortConfig }) {
  if (sort.field !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
  return sort.direction === "asc"
    ? <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
    : <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-gray-600 hover:text-gray-300 transition-colors"
      title="Copiar"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

interface ImageCellProps {
  src: string;
  alt: string;
  onExpand: () => void;
}

function ImageCell({ src, alt, onExpand }: ImageCellProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
        <ImageOff className="w-4 h-4 text-gray-600" />
      </div>
    );
  }

  return (
    <div
      className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-700 cursor-pointer group flex-shrink-0"
      onClick={onExpand}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ZoomIn className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
}

export function QuoteTable({ quotes, sort, imagenesMap, onSort, onEdit, onDelete }: QuoteTableProps) {
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const headerCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";
  const sortable = "cursor-pointer hover:text-gray-300 select-none flex items-center gap-1";

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th
                className={cn(headerCls, sortable, "px-4 py-3 text-left")}
                onClick={() => onSort("anime")}
              >
                Anime <SortIcon field="anime" sort={sort} />
              </th>
              <th className={cn(headerCls, "px-4 py-3 text-left")}>Categorías</th>
              <th className={cn(headerCls, "px-4 py-3 text-left")}>Slug</th>
              <th className={cn(headerCls, "px-4 py-3 text-right")}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q, idx) => {

              return (
                <tr
                  key={q.id}
                  className={cn(
                    "border-b border-gray-800/60 transition-colors",
                    idx % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50",
                    "hover:bg-gray-800/50"
                  )}
                >


                  {/* Anime */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-200">{q.anime}</span>
                      <CopyButton text={q.anime} />
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-4 py-3 text-gray-400">{q.author}</td>

                  {/* Quote */}
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <p
                        className="text-gray-300 leading-relaxed italic"
                        title={q.quote}
                      >
                        &ldquo;{truncate(q.quote, 100)}&rdquo;
                      </p>
                      <CopyButton text={q.quote} />
                    </div>
                  </td>

                  {/* Categories */}
                  <td className="px-4 py-3">
                    {q.categories && q.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {q.categories.map((cat) => (
                          <CategoryBadge key={cat} category={cat} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 italic">—</span>
                    )}
                  </td>

                  {/* Slug */}
                  <td className="px-4 py-3">
                    {q.animeSlug ? (
                      <div className="flex items-center gap-1.5">
                        <code className="text-xs text-indigo-400/80 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {q.animeSlug}
                        </code>
                        <CopyButton text={q.animeSlug} />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 italic">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(q)}
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(q)}
                        title="Eliminar"
                        className="hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <ImagePreviewModal
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}
