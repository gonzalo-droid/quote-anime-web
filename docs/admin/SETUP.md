# Panel /admin — guía de configuración

El panel de administración de quotes vive en `/admin` (oculto, sin enlaces
desde la web pública, con `robots: noindex` y `disallow` en `robots.ts`).
Usa el mismo proyecto de Firebase Realtime Database que `dashboard-quote-anime`
(nodos `quotes` e `imagenes`), así que ambos repos pueden coexistir mientras
decides qué hacer con el dashboard original.

## 1. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores de Firebase
(los mismos que usa `dashboard-quote-anime`) más el allowlist de correos:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS=gonzalo.lozg@gmail.com
```

Si despliegas en Vercel, añade las mismas variables en
**Project Settings → Environment Variables** del proyecto `quote-anime-web`.

## 2. Habilitar Google como proveedor en Firebase Auth

En Firebase Console → **Authentication → Sign-in method**, habilita el
proveedor **Google** (si no lo estaba ya para este proyecto). Añade el
dominio de producción `animequote.app` (y `localhost` para desarrollo) a
**Authentication → Settings → Authorized domains**.

## 3. Reglas de Firebase Realtime Database (seguridad real)

El allowlist de `NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS` solo controla la UI: cierra
la sesión de cualquier cuenta de Google no autorizada después de iniciar
sesión. **No bloquea escrituras directas a la API de Firebase.** La
protección real debe estar en las reglas de la base de datos.

Pega el contenido de [`firebase-rtdb-rules.json`](./firebase-rtdb-rules.json)
en Firebase Console → **Realtime Database → Reglas** y publica:

```json
{
  "rules": {
    "quotes": {
      ".read": true,
      ".write": "auth != null && auth.token.email_verified == true && auth.token.email == 'gonzalo.lozg@gmail.com'"
    },
    "imagenes": {
      ".read": true,
      ".write": "auth != null && auth.token.email_verified == true && auth.token.email == 'gonzalo.lozg@gmail.com'"
    }
  }
}
```

- `.read: true` se mantiene público porque la app móvil de AnimeQuote lee
  `quotes`/`imagenes` directamente desde el cliente, sin autenticarse.
- `.write` solo permite escribir a una sesión de Firebase Auth cuyo email
  verificado sea exactamente el correo autorizado.
- Si en el futuro autorizas más cuentas, actualiza tanto
  `NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS` como esta regla (puedes usar
  `auth.token.email in ['a@gmail.com', 'b@gmail.com']` si son varias).

## 4. `dashboard-quote-anime` (repo original)

Por ahora no se modifica. Las reglas de Firebase anteriores (si no
restringían escritura) cambian para todo el proyecto de Firebase, así que
una vez publiques las reglas de arriba, `dashboard-quote-anime` también
necesitará que su usuario inicie sesión con Firebase Auth para poder
escribir — hoy ese dashboard no tiene login, por lo que sus escrituras
quedarían bloqueadas. Si sigues usando ese dashboard en paralelo, tenlo en
cuenta antes de publicar las reglas.

## 5. Esquema de una frase (`quotes/{id}`) — contrato con la app móvil

| Campo        | Tipo                                   | Notas |
|--------------|----------------------------------------|-------|
| `anime`      | string                                 | Requerido. |
| `author`     | string                                 | Requerido. |
| `quote`      | string                                 | Requerido. Texto en **español**. Se mantiene como texto plano para que las versiones actuales de la app sigan funcionando. |
| `quoteEn`    | string (opcional)                      | Traducción al **inglés**. Si falta, la app debe usar `quote`. |
| `size`       | `"xs"` \| `"short"` \| `"medium"` \| `"long"` (opcional) | `xs` = cabe en el **widget del home** (máx. 60 caracteres en cada idioma; el dashboard lo valida). La app debe mostrar en ese widget solo frases `xs`. |
| `categories` | string[] (opcional)                    | Ver `src/lib/categories.ts`. |
| `animeSlug`  | string (opcional)                      | Clave en el nodo `imagenes`. |

El límite de 60 caracteres vive en `HOME_WIDGET_MAX_CHARS`
(`src/lib/quoteSize.ts`); si cambia el diseño del widget, actualízalo ahí.

Los tamaños son ordenados (`xs` < `short` < `medium` < `long`): donde la app
hoy filtra `size == "short"` (widget de la pantalla de bloqueo), debería
aceptar también `xs`, porque una frase XS también es corta.

Cómo se asigna `xs` desde el dashboard:
- **Import de JSON:** si una frase no trae `size` (o trae uno inválido) y cabe
  en el widget, se guarda como `xs` automáticamente. Un `size` válido explícito
  se respeta.
- **Botón "Asignar XS"** en `/admin`: recorre las frases existentes que caben
  y las marca como `xs` en una sola escritura. Por defecto solo toca las que no
  tienen tamaño; incluir las que ya son short/medium/long es opcional.
- **Filtro "Caben en widget"** para revisar cuáles califican.

## 6. Import automático de frases (Admin SDK, sin login)

La tarea semanal de frases ("Frases anime semanales") no puede iniciar
sesión con Google, así que para que suba sus lotes directo a Firebase sin
que tengas que importarlos a mano desde `/admin`, usa el Admin SDK con una
**service account**, que escribe sin pasar por las reglas de la sección 3
(esas reglas solo aplican al SDK de cliente).

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
importar a mano desde `/admin` como respaldo.

La service account tiene acceso total de lectura/escritura a toda la
base, no solo a `quotes`/`imagenes`, así que trátala con el mismo cuidado
que una contraseña: no la pegues en chats, issues ni commits.
