"use client";

import { useState } from "react";
import { AnimeImagesMap, AnimeImageEntry } from "@/types";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { ImagePreviewModal } from "@/components/admin/ui/ImagePreviewModal";
import { AddImageModal } from "./AddImageModal";
import { AddAnimeModal } from "./AddAnimeModal";
import { cn, copyToClipboard } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  ImageOff,
  ZoomIn,
  Image,
  PackageOpen,
} from "lucide-react";

interface ImagenesSectionProps {
  imagenesMap: AnimeImagesMap;
  loading: boolean;
  error: string | null;
  onAddUrl: (slug: string, url: string) => Promise<void>;
  onRemoveUrl: (slug: string, url: string) => Promise<void>;
  onCreateAnime: (slug: string) => Promise<void>;
  onDeleteAnime: (slug: string) => Promise<void>;
  onToastSuccess: (msg: string) => void;
  onToastError: (msg: string) => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={handleCopy} className="text-gray-600 hover:text-gray-300 transition-colors" title="Copiar slug">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

interface Thumb {
  slug: string;
  url: string;
}

function ImageThumbnail({ src, slug, onExpand, onRemove }: { src: string; slug: string; onExpand: () => void; onRemove: () => void }) {
  const [error, setError] = useState(false);
  const [hovering, setHovering] = useState(false);

  if (error) {
    return (
      <div className="relative w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group">
        <ImageOff className="w-5 h-5 text-gray-600" />
        <button
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          title="Eliminar"
        >
          <span className="text-xs leading-none">×</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 group flex-shrink-0"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        src={src}
        alt={slug}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
        onError={() => setError(true)}
      />
      {hovering && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-1.5">
          <button
            onClick={onExpand}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            title="Ver imagen"
          >
            <ZoomIn className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded-full bg-red-600/80 hover:bg-red-500 flex items-center justify-center transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ImagenesSection({
  imagenesMap,
  loading,
  error,
  onAddUrl,
  onRemoveUrl,
  onCreateAnime,
  onDeleteAnime,
  onToastSuccess,
  onToastError,
}: ImagenesSectionProps) {
  const [addImageTarget, setAddImageTarget] = useState<string | null>(null);
  const [addAnimeOpen, setAddAnimeOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Thumb | null>(null);
  const [removingUrl, setRemovingUrl] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const entries: AnimeImageEntry[] = Object.entries(imagenesMap)
    .map(([slug, urls]) => ({ slug, urls }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const totalImages = entries.reduce((acc, e) => acc + e.urls.length, 0);

  async function handleDeleteAnime() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await onDeleteAnime(deleteTarget);
      onToastSuccess(`Anime "${deleteTarget}" eliminado.`);
      setDeleteTarget(null);
    } catch {
      onToastError("Error al eliminar el anime.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleRemoveUrl() {
    if (!removeTarget) return;
    setRemovingUrl(true);
    try {
      await onRemoveUrl(removeTarget.slug, removeTarget.url);
      onToastSuccess("Imagen eliminada.");
      setRemoveTarget(null);
    } catch {
      onToastError("Error al eliminar la imagen.");
    } finally {
      setRemovingUrl(false);
    }
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-5 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-base font-semibold text-gray-100">Imágenes por anime</h2>
          {!loading && (
            <p className="text-xs text-gray-500 mt-0.5">
              {entries.length} anime{entries.length !== 1 ? "s" : ""} · {totalImages} imagen{totalImages !== 1 ? "es" : ""}
            </p>
          )}
        </div>
        <Button onClick={() => setAddAnimeOpen(true)}>
          <Plus className="w-4 h-4" />
          Nuevo anime
        </Button>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-center py-16 text-sm text-red-400">{error}</div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <PackageOpen className="w-7 h-7 text-gray-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-300">Sin animes registrados</p>
            <p className="text-xs text-gray-500 mt-1">Añade el primer anime para empezar a gestionar imágenes.</p>
          </div>
          <Button onClick={() => setAddAnimeOpen(true)}>
            <Plus className="w-4 h-4" /> Nuevo anime
          </Button>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 text-left">
                  Slug
                </th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 text-left">
                  Imágenes
                </th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr
                  key={entry.slug}
                  className={cn(
                    "border-b border-gray-800/60 transition-colors",
                    idx % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50",
                    "hover:bg-gray-800/40"
                  )}
                >
                  {/* Slug */}
                  <td className="px-5 py-4 w-56">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {entry.slug}
                      </code>
                      <CopyButton text={entry.slug} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {entry.urls.length} imagen{entry.urls.length !== 1 ? "es" : ""}
                    </p>
                  </td>

                  {/* Images */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      {entry.urls.length === 0 ? (
                        <span className="text-xs text-gray-600 italic">Sin imágenes</span>
                      ) : (
                        entry.urls.map((url, i) => (
                          <ImageThumbnail
                            key={`${url}-${i}`}
                            src={url}
                            slug={entry.slug}
                            onExpand={() => setPreviewImage(url)}
                            onRemove={() => setRemoveTarget({ slug: entry.slug, url })}
                          />
                        ))
                      )}

                      {/* Add URL button inline */}
                      <button
                        onClick={() => setAddImageTarget(entry.slug)}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-1 transition-all text-gray-600 hover:text-indigo-400 flex-shrink-0"
                        title="Añadir imagen"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs leading-none">Add</span>
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddImageTarget(entry.slug)}
                        title="Añadir imagen"
                      >
                        <Image className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(entry.slug)}
                        title="Eliminar anime"
                        className="hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AddImageModal
        open={addImageTarget !== null}
        slug={addImageTarget ?? ""}
        existingUrls={addImageTarget ? (imagenesMap[addImageTarget] ?? []) : []}
        onClose={() => setAddImageTarget(null)}
        onAdd={async (url) => {
          await onAddUrl(addImageTarget!, url);
          onToastSuccess("Imagen añadida.");
        }}
      />

      <AddAnimeModal
        open={addAnimeOpen}
        existingSlugs={Object.keys(imagenesMap)}
        onClose={() => setAddAnimeOpen(false)}
        onCreate={async (slug) => {
          await onCreateAnime(slug);
          onToastSuccess(`Anime "${slug}" creado.`);
          setAddAnimeOpen(false);
          setAddImageTarget(slug);
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAnime}
        title="Eliminar anime"
        description={`¿Eliminar el anime "${deleteTarget}" y todas sus imágenes? Esta acción no se puede deshacer.`}
        loading={deleting}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveUrl}
        title="Eliminar imagen"
        description="¿Eliminar esta imagen del anime? No se puede deshacer."
        confirmLabel="Eliminar"
        loading={removingUrl}
      />

      {previewImage && (
        <ImagePreviewModal
          src={previewImage}
          alt="Preview"
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
