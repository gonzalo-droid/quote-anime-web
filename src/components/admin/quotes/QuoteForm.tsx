"use client";

import { useState, FormEvent } from "react";
import { Quote, QuoteFormData, Category, AnimeImagesMap, QuoteSize } from "@/types";
import { Input, Textarea } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { CategorySelector } from "./CategorySelector";
import { validateCategories } from "@/lib/categories";
import { Link2, Images, ChevronDown } from "lucide-react";

interface QuoteFormProps {
  initialData?: Quote;
  imagenesMap: AnimeImagesMap;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  anime?: string;
  author?: string;
  quote?: string;
  categories?: string;
  animeSlug?: string;
}

const EMPTY_FORM: QuoteFormData = {
  anime: "",
  author: "",
  quote: "",
  categories: null,
  animeSlug: null,
  size: null,
};

const SIZE_OPTIONS: { value: QuoteSize; label: string; hint: string }[] = [
  { value: "short", label: "Short", hint: "Frase corta — ideal para lock screen compacto" },
  { value: "medium", label: "Medium", hint: "Frase mediana" },
  { value: "long", label: "Long", hint: "Frase larga — puede no caber en widget pequeño" },
];

export function QuoteForm({ initialData, imagenesMap, onSubmit, onCancel }: QuoteFormProps) {
  const [form, setForm] = useState<QuoteFormData>(
    initialData
      ? {
          anime: initialData.anime,
          author: initialData.author,
          quote: initialData.quote,
          categories: initialData.categories,
          animeSlug: initialData.animeSlug,
          size: initialData.size,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSlugList, setShowSlugList] = useState(false);

  const availableSlugs = Object.keys(imagenesMap).sort();
  const linkedImages = form.animeSlug ? (imagenesMap[form.animeSlug] ?? []) : [];

  function setField<K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.anime.trim()) e.anime = "El nombre del anime es requerido.";
    if (!form.author.trim()) e.author = "El autor es requerido.";
    if (!form.quote.trim()) e.quote = "La frase es requerida.";
    else if (form.quote.trim().length < 10) e.quote = "La frase debe tener al menos 10 caracteres.";

    if (form.categories && form.categories.length > 0) {
      const catError = validateCategories(form.categories);
      if (catError) e.categories = catError;
    }

    if (form.animeSlug && !form.animeSlug.trim().match(/^[a-z0-9-]+$/)) {
      e.animeSlug = "El slug solo puede contener letras minúsculas, números y guiones.";
    }

    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        anime: form.anime.trim(),
        author: form.author.trim(),
        quote: form.quote.trim(),
        categories: form.categories && form.categories.length > 0 ? form.categories : null,
        animeSlug: form.animeSlug?.trim() || null,
        size: form.size ?? null,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Anime *"
          placeholder="Ej: Fullmetal Alchemist"
          value={form.anime}
          onChange={(e) => setField("anime", e.target.value)}
          error={errors.anime}
        />
        <Input
          label="Autor *"
          placeholder="Ej: Edward Elric"
          value={form.author}
          onChange={(e) => setField("author", e.target.value)}
          error={errors.author}
        />
      </div>

      <Textarea
        label="Frase *"
        placeholder="Escribe la frase aquí..."
        rows={4}
        value={form.quote}
        onChange={(e) => setField("quote", e.target.value)}
        error={errors.quote}
      />

      <CategorySelector
        selected={form.categories ?? []}
        onChange={(cats) => setField("categories", cats.length > 0 ? cats as Category[] : null)}
        error={errors.categories}
      />

      {/* Anime Slug */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Input
            label="Anime Slug"
            placeholder="ej: fullmetal-alchemist"
            value={form.animeSlug ?? ""}
            onChange={(e) => setField("animeSlug", e.target.value || null)}
            error={errors.animeSlug}
            leftIcon={<Link2 className="w-4 h-4" />}
            hint="Identificador del anime en el nodo imagenes. Solo minúsculas, números y guiones."
          />
          {availableSlugs.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSlugList((v) => !v)}
              className="absolute right-2 top-7 text-gray-500 hover:text-gray-300 transition-colors"
              title="Ver slugs disponibles"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showSlugList ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Slug dropdown */}
        {showSlugList && availableSlugs.length > 0 && (
          <div className="rounded-lg border border-gray-700 bg-gray-800 divide-y divide-gray-700/50 max-h-40 overflow-y-auto">
            {availableSlugs.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => {
                  setField("animeSlug", slug);
                  setShowSlugList(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-700/50 transition-colors"
              >
                <span className={form.animeSlug === slug ? "text-indigo-400 font-medium" : "text-gray-300"}>
                  {slug}
                </span>
                <span className="text-xs text-gray-600">
                  {imagenesMap[slug]?.length ?? 0} img{imagenesMap[slug]?.length !== 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Linked images preview */}
        {linkedImages.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Images className="w-3.5 h-3.5" />
              <span>{linkedImages.length} imagen{linkedImages.length !== 1 ? "es" : ""} vinculada{linkedImages.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {linkedImages.slice(0, 6).map((url, i) => (
                <ImageThumb key={i} src={url} />
              ))}
              {linkedImages.length > 6 && (
                <div className="w-14 h-14 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{linkedImages.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Size selector */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-300">Tamaño</span>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.hint}
              onClick={() => setField("size", form.size === opt.value ? null : opt.value)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                form.size === opt.value
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {form.size
            ? SIZE_OPTIONS.find((o) => o.value === form.size)?.hint
            : "Opcional — define cómo se mostrará en el widget de lock screen."}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Guardar cambios" : "Crear quote"}
        </Button>
      </div>
    </form>
  );
}

function ImageThumb({ src }: { src: string }) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <img
      src={src}
      alt=""
      className="w-14 h-14 rounded-lg object-cover border border-gray-700"
      onError={() => setError(true)}
    />
  );
}
