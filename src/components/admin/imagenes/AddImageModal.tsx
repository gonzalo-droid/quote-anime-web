"use client";

import { useState, FormEvent } from "react";
import { Modal } from "@/components/admin/ui/Modal";
import { Input } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { isValidUrl } from "@/lib/utils";
import { ImageIcon, AlertCircle } from "lucide-react";

interface AddImageModalProps {
  open: boolean;
  slug: string;
  existingUrls: string[];
  onClose: () => void;
  onAdd: (url: string) => Promise<void>;
}

export function AddImageModal({ open, slug, existingUrls, onClose, onAdd }: AddImageModalProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  function reset() {
    setUrl("");
    setError(null);
    setPreviewError(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("La URL es requerida.");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("URL no válida. Debe comenzar con http:// o https://");
      return;
    }
    if (existingUrls.includes(trimmed)) {
      setError("Esta URL ya está registrada para este anime.");
      return;
    }

    setLoading(true);
    try {
      await onAdd(trimmed);
      reset();
      onClose();
    } catch {
      setError("Error al guardar la imagen.");
    } finally {
      setLoading(false);
    }
  }

  const hasValidUrl = url.trim() && isValidUrl(url.trim());

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Añadir imagen · ${slug}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="URL de imagen (Cloudinary)"
          placeholder="https://res.cloudinary.com/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
            setPreviewError(false);
          }}
          error={error ?? undefined}
          leftIcon={<ImageIcon className="w-4 h-4" />}
          autoFocus
        />

        {/* Preview */}
        {hasValidUrl && !previewError && (
          <div className="rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img
              src={url.trim()}
              alt="Preview"
              className="w-full h-40 object-cover"
              onError={() => setPreviewError(true)}
            />
          </div>
        )}

        {hasValidUrl && previewError && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            No se pudo cargar el preview, pero la URL será guardada.
          </div>
        )}

        {existingUrls.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-gray-500">Imágenes actuales ({existingUrls.length})</p>
            <div className="flex gap-2 flex-wrap">
              {existingUrls.map((u, i) => (
                <img
                  key={i}
                  src={u}
                  alt=""
                  className="w-12 h-12 rounded-md object-cover border border-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
          <Button variant="outline" type="button" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Añadir imagen
          </Button>
        </div>
      </form>
    </Modal>
  );
}
