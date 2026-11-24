# Datos de AnimeQuote en Firebase — esquema e imports

El panel de administración de frases **ya no vive en este repo**. Se movió a
Nekodojo:

- URL: <https://nekodojo.app/apps/animequote/admin> (el antiguo
  `animequote.app/admin` redirige ahí con un 308).
- Repo: `/Volumes/Neko/webs/neko-dojo`, carpeta `src/apps/animequote/admin/`.
- Guía de configuración (variables, login con Google, allowlist):
  `docs/animequote-admin/README.md` en ese repo.

Aquí quedan el esquema de datos (contrato con la app móvil), los scripts de
import con Admin SDK que usa la tarea semanal de frases y las reglas de la
base de datos.

## Reglas de Firebase Realtime Database (seguridad real)

[`firebase-rtdb-rules.json`](./firebase-rtdb-rules.json) es la protección
real de los nodos `quotes` e `imagenes` del proyecto `quoteanime-76a76`:
lectura pública (la app móvil lee sin autenticarse) y escritura solo para una
sesión de Firebase Auth con el email verificado autorizado. El allowlist del
panel solo controla la UI. Para cambiarlas, pega el archivo en Firebase
Console → **Realtime Database → Reglas** y publica.

## Esquema de una frase (`quotes/{id}`) — contrato con la app móvil

| Campo        | Tipo                                   | Notas |
|--------------|----------------------------------------|-------|
| `anime`      | string                                 | Requerido. |
| `author`     | string                                 | Requerido. |
| `quote`      | string                                 | Requerido. Texto en **español**. Se mantiene como texto plano para que las versiones actuales de la app sigan funcionando. |
| `quoteEn`    | string (opcional)                      | Traducción al **inglés**. Si falta, la app debe usar `quote`. |
| `size`       | `"xs"` \| `"short"` \| `"medium"` \| `"long"` (opcional) | `xs` = cabe en el **widget del home** (máx. 60 caracteres en cada idioma; el panel lo valida). La app debe mostrar en ese widget solo frases `xs`. |
| `categories` | string[] (opcional)                    | Lista en `src/apps/animequote/admin/lib/categories.ts` (Nekodojo) y copia en `ALLOWED_CATEGORIES` de `scripts/import-quotes-to-firebase.mjs` (aquí); si cambia, actualiza ambas. |
| `animeSlug`  | string (opcional)                      | Clave en el nodo `imagenes`. |

El límite de 60 caracteres vive en `HOME_WIDGET_MAX_CHARS`
(`src/apps/animequote/admin/lib/quoteSize.ts` en Nekodojo); si cambia el
diseño del widget, actualízalo ahí.

Los tamaños son ordenados (`xs` < `short` < `medium` < `long`): donde la app
hoy filtra `size == "short"` (widget de la pantalla de bloqueo), debería
aceptar también `xs`, porque una frase XS también es corta.

Cómo se asigna `xs` desde el panel:
- **Import de JSON:** si una frase no trae `size` (o trae uno inválido) y cabe
  en el widget, se guarda como `xs` automáticamente. Un `size` válido explícito
  se respeta.
- **Botón "Asignar XS"**: recorre las frases existentes que caben y las marca
  como `xs` en una sola escritura. Por defecto solo toca las que no tienen
  tamaño; incluir las que ya son short/medium/long es opcional.
- **Filtro "Caben en widget"** para revisar cuáles califican.

## Import automático de frases (Admin SDK, sin login)

La tarea semanal de frases ("Frases anime semanales") no puede iniciar
sesión con Google, así que para que suba sus lotes directo a Firebase sin
que tengas que importarlos a mano desde el panel, usa el Admin SDK con una
**service account**, que escribe sin pasar por las reglas de arriba (esas
reglas solo aplican al SDK de cliente).

**Generar la credencial (una sola vez):**

1. Firebase Console → ⚙️ **Project settings** → **Service accounts**.
2. **Generate new private key** → descarga el JSON.
3. Guárdalo fuera de cualquier repo que subas a GitHub, por ejemplo en
   `quote-anime/secrets/firebase-service-account.json` (esa carpeta ya
   está en `.gitignore`, igual que cualquier archivo que contenga
   `firebase-service-account` en el nombre). **Nunca lo commitees.**

**Variables de entorno para los scripts:**

```
FIREBASE_SERVICE_ACCOUNT_KEY=/ruta/a/secrets/firebase-service-account.json
FIREBASE_DATABASE_URL=https://quoteanime-76a76-default-rtdb.firebaseio.com
```

**Subir un lote nuevo:**

```bash
npm run import-quotes -- /ruta/al/lote-de-frases.json
```

Agrega `-- --dry-run` al final para ver qué importaría sin escribir nada.
El script (`scripts/import-quotes-to-firebase.mjs`) valida cada frase
(campos requeridos, `categories`, `size` incluyendo `xs`, formato de
`animeSlug`) y **omite duplicados exactos** (mismo `anime` + `author` +
`quote`), así que reimportar el mismo archivo no genera copias.

**Completar `quoteEn`/`size` en frases que ya existen** (sin crear
duplicados, a diferencia del botón "Asignar XS" que solo toca `size`):

```bash
npm run backfill-translations -- /ruta/al/lote-de-traducciones.json
```

Formato esperado: `[{ "id": "<key de Firebase>", "quoteEn": "...", "size": "xs" }, ...]`.

Si cualquiera de los dos comandos falla (falta la credencial, sin red,
datos inválidos), no escribe nada — el JSON original queda intacto para
importar a mano desde el panel de Nekodojo como respaldo.

La service account tiene acceso total de lectura/escritura a toda la
base, no solo a `quotes`/`imagenes`, así que trátala con el mismo cuidado
que una contraseña: no la pegues en chats, issues ni commits.
