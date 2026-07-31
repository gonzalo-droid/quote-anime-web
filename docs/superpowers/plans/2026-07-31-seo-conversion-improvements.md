# SEO y Conversión de Descarga Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mejorar el SEO técnico de quoteanime.app (imagen OG real, datos estructurados, sitemap correcto, alt texts) y reducir la fricción de conversión hacia la descarga de la app (QR para escritorio, barra flotante en móvil, FAQ).

**Architecture:** Sitio estático Next.js 15 App Router de una sola página. Todo el contenido nuevo (FAQ) vive en `src/lib/constants.ts` como los demás datos. Los cambios son aditivos: nuevos componentes de UI + metadata, sin tocar la arquitectura existente (sin backend, sin llamadas a API, sin librería de estado).

**Tech Stack:** Next.js 15.3, React 18, TypeScript, Tailwind CSS 3.4, Framer Motion 11. Generación de imagen OG vía `next/og` (`ImageResponse`, incluido en Next.js, sin dependencia nueva). QR generado una sola vez con el CLI de `qrcode` vía `npx` (no se añade como dependencia del proyecto).

## Global Constraints

- Dark mode únicamente — fondo `#0C0C1E` (`bgDark`), acento `#A78BFA` (`accent`). Nunca añadir un toggle de tema claro.
- Play Store URL: `https://play.google.com/store/apps/details?id=com.gondroid.quoteanime` (constante `PLAY_STORE_URL`)
- App Store URL: `https://apps.apple.com/pe/app/quoteanime-frases-de-anime/id6762100338?l=en-GB` (constante `APP_STORE_URL`)
- `metadataBase` ya apunta a `https://quoteanime.app` en `layout.tsx` — no tocar.
- Sin integrar Google Analytics ni otra herramienta de analytics — el usuario solo usará Google Search Console.
- Sin `aggregateRating` en el JSON-LD — no hay conteo real de reseñas verificable.
- Sin añadir dependencias de runtime nuevas (nada de `package.json` nuevo) — el paquete `qrcode` se usa solo una vez vía `npx` para generar un archivo estático, no se instala.
- Este repo no tiene suite de tests (`npm run lint` y `npm run build` son las únicas verificaciones automatizadas; ver `CLAUDE.md`). La verificación de cada tarea es: `npm run build` (sin errores de tipos) + inspección manual en `npm run dev`.
- Todo el texto de cara al usuario está en español, siguiendo el tono ya usado en `constants.ts` y los componentes existentes.

---

## Task 1: Sitemap con fechas fijas

**Files:**
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `SITE_URL` de `src/lib/constants.ts` (ya existe)
- Produces: nada consumido por otras tareas

- [ ] **Step 1: Reemplazar `new Date()` por fechas fijas**

Reemplaza el contenido completo de `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Actualizar manualmente esta fecha cuando cambie el contenido de la ruta.
const LAST_MODIFIED: Record<string, string> = {
  "": "2026-07-31",
  "/privacy-policy": "2026-07-13",
  "/terms-and-conditions": "2026-07-13",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/privacy-policy", "/terms-and-conditions"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED[route],
    changeFrequency: route === "" ? "weekly" : "yearly",
    priority: route === "" ? 1 : 0.3,
  }));
}
```

- [ ] **Step 2: Verificar con build y en el navegador**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run dev`, abre `http://localhost:3000/sitemap.xml`
Expected: las tres URLs aparecen con las fechas fijas de `LAST_MODIFIED` (no la fecha de hoy generada dinámicamente en cada carga).

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "fix: use static lastModified dates in sitemap"
```

---

## Task 2: Metadata ampliada en layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: nada nuevo
- Produces: nada consumido por otras tareas (Task 3 añade la imagen OG por convención de archivo, no depende de este export)

- [ ] **Step 1: Actualizar el objeto `metadata`**

En `src/app/layout.tsx`, reemplaza el bloque `export const metadata: Metadata = { ... };` completo por:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://quoteanime.app"),
  title: "Quote Anime — Frases del universo anime",
  description:
    "Frases motivacionales del universo anime para Android e iOS. Notificaciones, widget, favoritos y más.",
  keywords: [
    "frases anime",
    "quotes anime",
    "app frases anime",
    "widget anime",
    "notificaciones anime",
    "frases motivacionales anime",
  ],
  alternates: {
    canonical: "https://quoteanime.app",
  },
  openGraph: {
    title: "Quote Anime",
    description: "Frases del universo anime en tu pantalla cada día.",
    url: "https://quoteanime.app",
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quote Anime",
    description: "Frases motivacionales del universo anime.",
  },
  icons: {
    icon: "/images/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};
```

Nota: se elimina el array manual `openGraph.images` que apuntaba a `/og-image.png` (archivo inexistente) — Task 3 lo reemplaza con una imagen generada automáticamente por convención de Next.js.

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run dev`, abre `http://localhost:3000`, "Ver código fuente de la página" (view-source)
Expected: `<meta name="keywords" ...>` y `<link rel="canonical" href="https://quoteanime.app">` presentes en el `<head>`.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: expand SEO metadata (keywords, canonical, OG locale)"
```

---

## Task 3: Imagen Open Graph generada

**Files:**
- Create: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: `public/images/logo_white.png` (archivo ya existente)
- Produces: nada consumido por otras tareas — Next.js inyecta automáticamente `og:image` y `twitter:image` en el `<head>` de todas las páginas que heredan este layout

- [ ] **Step 1: Crear el generador de imagen OG**

Crea `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Quote Anime — Frases del universo anime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/logo_white.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #0C0C1E 0%, #0F0A2E 50%, #1A0A2E 100%)",
        }}
      >
        <img src={logoSrc} width={140} height={140} alt="" />
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontWeight: 700,
            color: "#F0EAFF",
            display: "flex",
          }}
        >
          Quote Anime
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "#A78BFA",
            display: "flex",
          }}
        >
          Frases del universo anime, en tu pantalla cada día
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: build sin errores (la ruta `/opengraph-image` aparece en el resumen de rutas generadas).

Run: `npm run dev`, abre `http://localhost:3000/opengraph-image`
Expected: se renderiza una imagen PNG de 1200×630 con el logo, "Quote Anime" y el tagline sobre el gradiente de marca.

Abre `http://localhost:3000` y revisa "Ver código fuente de la página"
Expected: `<meta property="og:image" content="https://quoteanime.app/opengraph-image?...">` presente.

- [ ] **Step 3: Commit**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: generate Open Graph image via next/og"
```

---

## Task 4: Sección FAQ con datos estructurados

**Files:**
- Modify: `src/lib/constants.ts`
- Create: `src/components/FAQ.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: ninguno
- Produces: `FAQ_ITEMS: { question: string; answer: string }[]` exportado desde `src/lib/constants.ts`, usado por `FAQ.tsx`. Componente `FAQ` (default export) usado por `page.tsx`.

- [ ] **Step 1: Añadir `FAQ_ITEMS` a constants.ts**

Al final de `src/lib/constants.ts`, después de `NAV_LINKS`, añade:

```ts

export const FAQ_ITEMS = [
  {
    question: "¿Quote Anime es gratis?",
    answer:
      "Sí, Quote Anime es completamente gratis para descargar y usar, sin necesidad de registro.",
  },
  {
    question: "¿Tiene anuncios?",
    answer:
      "No mostramos anuncios intrusivos. La app está pensada para que disfrutes las frases sin interrupciones.",
  },
  {
    question: "¿Cómo funcionan las notificaciones?",
    answer:
      "Puedes elegir recibir de 1 a 10 frases al día, en el rango horario que prefieras, para no molestarte de noche.",
  },
  {
    question: "¿Puedo guardar frases sin conexión a internet?",
    answer:
      "Sí, tus frases favoritas se guardan offline y puedes acceder a ellas en cualquier momento, sin necesidad de conexión.",
  },
  {
    question: "¿Qué pasa con mis datos y mi privacidad?",
    answer:
      "No pedimos registro ni datos personales para usar la app. Puedes revisar el detalle completo en nuestra Política de Privacidad.",
  },
];
```

- [ ] **Step 2: Crear el componente FAQ**

Crea `src/components/FAQ.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 px-6 relative scroll-mt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Preguntas frecuentes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-textPrimary">
            ¿Tienes dudas?
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="bg-surface border border-accent/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-textPrimary font-semibold">
                    {item.question}
                  </span>
                  <motion.svg
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-textSecondary leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Insertar FAQ en la página**

Reemplaza el contenido completo de `src/app/page.tsx`:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ShareShowcase from "@/components/ShareShowcase";
import Screenshots from "@/components/Screenshots";
import FAQ from "@/components/FAQ";
import Download from "@/components/Download";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <ShareShowcase />
      <Screenshots />
      <FAQ />
      <Download />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run dev`, abre `http://localhost:3000`, desplázate a la sección "¿Tienes dudas?" (entre las capturas y "Disponible ahora")
Expected: 5 preguntas listadas; al hacer clic en una se expande mostrando la respuesta y el ícono "+" rota a "×"; al hacer clic de nuevo se colapsa.

En "Ver código fuente de la página", busca `"@type":"FAQPage"`
Expected: presente con las 5 preguntas y respuestas.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts src/components/FAQ.tsx src/app/page.tsx
git commit -m "feat: add FAQ section with FAQPage structured data"
```

---

## Task 5: Datos estructurados MobileApplication

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `PLAY_STORE_URL`, `APP_STORE_URL`, `INSTAGRAM_URL`, `FACEBOOK_URL`, `SITE_URL` de `src/lib/constants.ts` (todos ya existen)
- Produces: nada consumido por otras tareas

- [ ] **Step 1: Añadir el script JSON-LD a la página**

Reemplaza el contenido completo de `src/app/page.tsx`:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ShareShowcase from "@/components/ShareShowcase";
import Screenshots from "@/components/Screenshots";
import FAQ from "@/components/FAQ";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import {
  PLAY_STORE_URL,
  APP_STORE_URL,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  SITE_URL,
} from "@/lib/constants";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Quote Anime",
    operatingSystem: "ANDROID, IOS",
    applicationCategory: "LifestyleApplication",
    url: SITE_URL,
    downloadUrl: PLAY_STORE_URL,
    sameAs: [APP_STORE_URL, INSTAGRAM_URL, FACEBOOK_URL],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Frases motivacionales del universo anime para Android e iOS. Notificaciones, widget, favoritos y más.",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <Features />
      <ShareShowcase />
      <Screenshots />
      <FAQ />
      <Download />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run dev`, abre `http://localhost:3000`, "Ver código fuente de la página", busca `"@type":"MobileApplication"`
Expected: presente, sin campo `aggregateRating`, con `downloadUrl`, `sameAs` (3 URLs) y `offers.price` = "0".

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add MobileApplication structured data"
```

---

## Task 6: Alt texts descriptivos en Screenshots

**Files:**
- Modify: `src/components/Screenshots.tsx`

**Interfaces:**
- Consumes: ninguno
- Produces: ninguno

- [ ] **Step 1: Reemplazar los alt texts genéricos**

En `src/components/Screenshots.tsx`, dentro de `<Screenshots />`, reemplaza cada bloque `<PhoneImage ... alt="..." .../>`:

```tsx
            <PhoneImage
              src="/images/home_app.png"
              alt="Pantalla principal de Quote Anime mostrando una frase de anime a pantalla completa"
              delay={0.1}
              className="translate-y-8"
            />
            <PhoneImage
              src="/images/category_app.png"
              alt="Catálogo de frases de Quote Anime filtrado por anime"
              delay={0.2}
              className="translate-y-4"
            />
            <PhoneImage
              src="/images/quotes_app.png"
              alt="Lista de frases favoritas guardadas en Quote Anime"
              delay={0}
              className="-translate-y-2"
            />
            <PhoneImage
              src="/images/setting_app.png"
              alt="Ajustes de notificaciones y widget en Quote Anime"
              delay={0.3}
              className="translate-y-4"
            />
```

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run dev`, abre `http://localhost:3000`, inspecciona (DevTools) cualquiera de las 4 imágenes de capturas
Expected: el atributo `alt` de cada `<img>` contiene la descripción nueva, no "Home"/"Ajustes"/etc.

- [ ] **Step 3: Commit**

```bash
git add src/components/Screenshots.tsx
git commit -m "fix: use descriptive alt text for screenshot images"
```

---

## Task 7: Código QR para descarga desde escritorio

**Files:**
- Create: `public/images/qr-download.svg` (generado, no escrito a mano)
- Modify: `src/components/Download.tsx`

**Interfaces:**
- Consumes: ninguno
- Produces: ninguno

- [ ] **Step 1: Generar el SVG del QR**

Run:
```bash
npx --yes qrcode -o public/images/qr-download.svg -t svg "https://quoteanime.app/#download"
```
Expected: se crea `public/images/qr-download.svg` (confirmado por el mensaje `saved qrcode to: public/images/qr-download.svg`). No se añade `qrcode` a `package.json` — solo se usa vía `npx` para generar el archivo estático.

- [ ] **Step 2: Añadir la tarjeta QR a Download.tsx**

En `src/components/Download.tsx`, envuelve `<StoreBadges />` en un contenedor flex que agregue la tarjeta QR (visible solo en `md:` y superior). Reemplaza:

```tsx
          <StoreBadges />

          {/* Trust points */}
```

por:

```tsx
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <StoreBadges />
            <div className="hidden md:flex flex-col items-center gap-2 bg-white rounded-2xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/qr-download.svg"
                alt="Código QR para descargar Quote Anime"
                width={120}
                height={120}
              />
              <span className="text-bgDark text-xs font-medium">
                Escanéalo con tu móvil
              </span>
            </div>
          </div>

          {/* Trust points */}
```

- [ ] **Step 3: Verificar**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run lint`
Expected: sin errores (el comentario `eslint-disable-next-line` evita el warning de `no-img-element`).

Run: `npm run dev`, abre `http://localhost:3000` con el navegador en ancho de escritorio (≥768px), ve a la sección "Disponible ahora"
Expected: junto a los botones de Google Play/App Store aparece una tarjeta blanca con el código QR y el texto "Escanéalo con tu móvil". Reduce el ancho de la ventana a móvil (<768px): la tarjeta QR desaparece, solo quedan los botones de tienda.

Escanea el QR con un teléfono (opcional, si hay uno a mano)
Expected: abre `https://quoteanime.app/#download`.

- [ ] **Step 4: Commit**

```bash
git add public/images/qr-download.svg src/components/Download.tsx
git commit -m "feat: add desktop QR code for app download"
```

---

## Task 8: Barra de descarga flotante en móvil

**Files:**
- Create: `src/components/StickyDownloadBar.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `PLAY_STORE_URL`, `APP_STORE_URL` de `src/lib/constants.ts` (ya existen)
- Produces: componente `StickyDownloadBar` (default export) usado por `page.tsx`

- [ ] **Step 1: Crear el componente**

Crea `src/components/StickyDownloadBar.tsx`:

```tsx
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
              className="bg-accent text-bgDark text-xs font-semibold px-3 py-2 rounded-lg"
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
```

- [ ] **Step 2: Insertar en la página**

En `src/app/page.tsx`, añade el import junto a los demás componentes:

```tsx
import StickyDownloadBar from "@/components/StickyDownloadBar";
```

Y añade `<StickyDownloadBar />` como último elemento dentro de `<main>`, después de `<Footer />`:

```tsx
      <Footer />
      <StickyDownloadBar />
    </main>
```

- [ ] **Step 3: Verificar**

Run: `npm run build`
Expected: build sin errores.

Run: `npm run dev`, abre `http://localhost:3000` con DevTools en modo responsive (viewport móvil, ej. iPhone 12, ancho <640px)
Expected: al cargar la página, no hay barra visible. Al hacer scroll hacia abajo más de una altura de pantalla, aparece una barra fija inferior con "Descarga Quote Anime" y los botones Google Play / App Store. Al hacer clic en "✕", la barra desaparece. Recarga la página (sin cerrar la pestaña) y vuelve a hacer scroll: la barra ya NO reaparece (persistida en `sessionStorage`).

Cambia el viewport a escritorio (≥640px) y repite el scroll
Expected: la barra nunca aparece (clase `sm:hidden`).

- [ ] **Step 4: Commit**

```bash
git add src/components/StickyDownloadBar.tsx src/app/page.tsx
git commit -m "feat: add mobile sticky download bar on scroll"
```

---

## Task 9: Verificación final completa

**Files:**
- Ninguno (solo verificación)

**Interfaces:**
- Consumes: todos los archivos de las tareas 1-8
- Produces: confirmación de que el sitio compila, pasa lint y funciona correctamente de punta a punta

- [ ] **Step 1: Build y lint completos**

Run: `npm run build`
Expected: build exitoso, sin errores de TypeScript, incluyendo las rutas nuevas (`/opengraph-image`).

Run: `npm run lint`
Expected: sin errores ni warnings nuevos.

- [ ] **Step 2: Recorrido manual completo en el navegador**

Run: `npm run dev`, abre `http://localhost:3000` y verifica en un solo recorrido:
1. Hero, Features, ShareShowcase, Screenshots cargan igual que antes (sin regresiones visuales).
2. Sección FAQ funciona (abrir/cerrar preguntas).
3. Sección Download muestra QR en desktop, no en móvil.
4. Barra flotante aparece en móvil tras el scroll y se puede cerrar.
5. "Ver código fuente de la página" contiene ambos scripts JSON-LD (`MobileApplication` y `FAQPage`), el `<link rel="canonical">`, y `<meta property="og:image">` apuntando a `/opengraph-image`.
6. `http://localhost:3000/sitemap.xml` muestra las 3 rutas con fechas fijas.

Expected: todo lo anterior funciona sin errores en consola del navegador.

- [ ] **Step 3: Commit final (si hubo ajustes durante la verificación)**

Si el paso 2 no requirió cambios, no hay nada que commitear — las tareas 1-8 ya dejaron todo commiteado. Si se detectó y corrigió algo durante la verificación:

```bash
git add -A
git commit -m "fix: address issues found in final verification pass"
```
