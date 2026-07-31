# SEO y conversión de descarga — diseño

**Fecha:** 2026-07-31
**Objetivo:** mejorar el SEO técnico de quoteanime.app y aumentar la tasa de conversión hacia la descarga de la app, sin añadir dependencias de analytics (el usuario solo usará Google Search Console para estadísticas).

## Contexto

Sitio Next.js 15 App Router de una sola página (`/` + `/privacy-policy` + `/terms-and-conditions`). Todo el contenido estático vive en `src/lib/constants.ts`. Sin backend, sin llamadas a API, sin gestor de estado (ver `CLAUDE.md`).

Hallazgos del análisis previo:
- `layout.tsx` referencia `/og-image.png`, archivo inexistente en `public/`.
- No hay datos estructurados (JSON-LD) para la app.
- `sitemap.ts` usa `new Date()` en cada build, generando `lastModified` sin sentido.
- Alt texts de `Screenshots.tsx` son genéricos ("Home", "Ajustes").
- No hay mecanismo de conversión para visitantes de escritorio (no pueden "tocar" un badge de store).
- No hay CTA persistente en móvil tras pasar el Hero.
- No hay sección de FAQ (ni el rich-snippet asociado, ni la reducción de fricción de compra).

## Bloque 1 — SEO técnico

### 1.1 Open Graph image generada
Nuevo archivo `src/app/opengraph-image.tsx` usando la convención de Next.js (`next/og` `ImageResponse`). Genera una imagen 1200×630 en runtime: gradiente de marca (`#0C0C1E` → `#1A0A2E`), logo (`logo_white.png` embebido como base64 o vía `ImageResponse` con `<img>`), título "Quote Anime" y el tagline "Frases del universo anime". Next.js inyecta automáticamente esta imagen en las metaetiquetas `og:image` y `twitter:image` — se elimina la referencia manual rota a `/og-image.png` en `layout.tsx`.

### 1.2 JSON-LD `MobileApplication`
En `src/app/page.tsx`, añadir un `<script type="application/ld+json">` (Server Component, sin `"use client"`) con:
```json
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Quote Anime",
  "operatingSystem": "ANDROID, IOS",
  "applicationCategory": "LifestyleApplication",
  "url": "https://quoteanime.app",
  "downloadUrl": "<PLAY_STORE_URL>",
  "sameAs": ["<APP_STORE_URL>", "<INSTAGRAM_URL>", "<FACEBOOK_URL>"],
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Frases motivacionales del universo anime para Android e iOS."
}
```
Sin `aggregateRating` (decisión explícita: no hay conteo real de reseñas verificable).

### 1.3 FAQ + FAQPage schema
Nuevo componente `src/components/FAQ.tsx` (client component con acordeón, `useState` + Framer Motion para expandir/colapsar), insertado en `page.tsx` entre `Screenshots` y `Download`. Contenido en `FAQ_ITEMS` (nuevo array en `constants.ts`), 5 preguntas:
1. ¿Quote Anime es gratis?
2. ¿Tiene anuncios?
3. ¿Cómo funcionan las notificaciones?
4. ¿Puedo guardar frases sin conexión a internet?
5. ¿Qué pasa con mis datos / privacidad?

Mismo componente renderiza un `<script type="application/ld+json">` con `FAQPage` + `mainEntity` mapeado desde `FAQ_ITEMS`.

### 1.4 Sitemap con fechas reales
En `sitemap.ts`, reemplazar `lastModified: new Date()` por fechas ISO fijas: `"2026-07-31"` para la home (se modifica hoy); para `/privacy-policy` y `/terms-and-conditions`, la fecha del último commit real que tocó cada archivo (vía `git log -1 --format=%cd --date=short -- <archivo>`). Se documenta con un comentario que estas fechas deben actualizarse manualmente cuando cambie el contenido de cada ruta.

### 1.5 Alt texts descriptivos
En `Screenshots.tsx`, reemplazar los alt genéricos:
- `"Home"` → `"Pantalla principal de Quote Anime mostrando una frase de anime a pantalla completa"`
- `"Categorías"` → `"Catálogo de frases de Quote Anime filtrado por anime"`
- `"Frases"` → `"Lista de frases favoritas guardadas en Quote Anime"`
- `"Ajustes"` → `"Ajustes de notificaciones y widget en Quote Anime"`

### 1.6 Metadata adicional
En `layout.tsx`, agregar a `metadata`:
- `keywords: ["frases anime", "quotes anime", "app frases anime", "widget anime", "notificaciones anime"]`
- `alternates: { canonical: "https://quoteanime.app" }`
- `openGraph.locale: "es_PE"`
- Quitar el array manual `openGraph.images` (lo cubre `opengraph-image.tsx` automáticamente).

## Bloque 2 — Conversión / descarga

### 2.1 Código QR para escritorio
Generar un SVG estático offline (script de un solo uso con el paquete `qrcode`, ejecutado localmente, no añadido como dependencia de runtime) codificando `https://quoteanime.app/#download`. Guardar como `public/images/qr-download.svg`. En `Download.tsx`, añadir una tarjeta junto a `StoreBadges` con el QR y el texto "Escanéalo con tu móvil", visible solo en `md:` y superior (`hidden md:flex`).

### 2.2 Barra de descarga flotante (móvil)
Nuevo componente `src/components/StickyDownloadBar.tsx` (client component):
- Usa `useEffect` + listener de `scroll` (o `useScroll` de Framer Motion) para mostrarse cuando `scrollY > window.innerHeight` (es decir, tras pasar el Hero).
- Barra fija inferior (`fixed bottom-0 sm:hidden`) con versión compacta de ambos badges de store y un botón "✕" para cerrar.
- Al cerrar, guarda `sessionStorage.setItem("hideDownloadBar", "1")` para no reaparecer en la misma sesión.
- Se monta en `page.tsx` a nivel de página (fuera de `<main>` o al final), no depende de otros componentes.

### 2.3 FAQ como reductor de fricción
La sección FAQ del bloque 1 cumple doble función: SEO (rich snippet) y conversión (resuelve objeciones antes del CTA final de `Download.tsx`).

## Archivos afectados

- `src/app/layout.tsx` — metadata (editar)
- `src/app/opengraph-image.tsx` — nuevo
- `src/app/page.tsx` — insertar `<FAQ />`, `<StickyDownloadBar />`, JSON-LD `MobileApplication`
- `src/app/sitemap.ts` — fechas fijas (editar)
- `src/components/Screenshots.tsx` — alt texts (editar)
- `src/components/FAQ.tsx` — nuevo
- `src/components/Download.tsx` — QR card (editar)
- `src/components/StickyDownloadBar.tsx` — nuevo
- `src/lib/constants.ts` — `FAQ_ITEMS` (editar)
- `public/images/qr-download.svg` — nuevo asset generado

## Fuera de alcance

- Integrar Google Analytics u otra herramienta de analytics (el usuario solo usará Search Console).
- Corregir el rating estático 4.5/4.5 en `constants.ts` (el usuario lo revisará por su cuenta).
- Cualquier cambio de arquitectura de datos/estado (el sitio se mantiene 100% estático).

## Testing / verificación

- `npm run build` — sin errores de tipos.
- `npm run lint` — sin errores.
- Levantar `npm run dev` y verificar visualmente: FAQ (abrir/cerrar preguntas), barra flotante (aparece al hacer scroll en viewport móvil, se cierra y no reaparece en la misma sesión), QR visible solo en desktop, OG image renderizada en `/opengraph-image` (ruta de depuración de Next.js).
- Validar manualmente que el JSON-LD generado es JSON válido (no hay forma de correr el Rich Results Test de Google desde este entorno).
