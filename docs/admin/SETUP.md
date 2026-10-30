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
dominio de producción de `quoteanime.app` (y `localhost` para desarrollo) a
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

- `.read: true` se mantiene público porque la app móvil de QuoteAnime lee
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
