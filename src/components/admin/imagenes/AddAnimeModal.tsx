"use client";

import { useState, FormEvent } from "react";
import { Modal } from "@/components/admin/ui/Modal";
import { Input } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { Link2 } from "lucide-react";

interface AddAnimeModalProps {
  open: boolean;
  existingSlugs: string[];
  onClose: () => void;
  onCreate: (slug: string) => Promise<void>;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AddAnimeModal({ open, existingSlugs, onClose, onCreate }: AddAnimeModalProps) {
  const [rawName, setRawName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setRawName(value);
    if (!slugManual) {
      setSlug(toSlug(value));
    }
    setError(null);
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setError(null);
  }

  function reset() {
    setRawName("");
    setSlug("");
    setSlugManual(false);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const finalSlug = slug.trim();

    if (!finalSlug) {
      setError("El slug es requerido.");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(finalSlug)) {
      setError("Solo letras minúsculas, números y guiones.");
      return;
    }
    if (existingSlugs.includes(finalSlug)) {
      setError("Este slug ya existe.");
      return;
    }

    setLoading(true);
    try {
      await onCreate(finalSlug);
      reset();
    } catch {
      setError("Error al crear el anime.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Nuevo anime" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre del anime"
          placeholder="Ej: Fullmetal Alchemist"
          value={rawName}
          onChange={(e) => handleNameChange(e.target.value)}
          hint="Se genera el slug automáticamente."
          autoFocus
        />

        <Input
          label="Slug *"
          placeholder="ej: fullmetal-alchemist"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          error={error ?? undefined}
          leftIcon={<Link2 className="w-4 h-4" />}
          hint="Identificador único. Solo minúsculas, números y guiones."
        />

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
          <Button variant="outline" type="button" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={!slug.trim()}>
            Crear anime
          </Button>
        </div>
      </form>
    </Modal>
  );
}
