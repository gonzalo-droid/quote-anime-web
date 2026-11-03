#!/usr/bin/env node
/**
 * Importa un archivo JSON de frases (mismo formato que el import manual de /admin)
 * directo al nodo "quotes" de Firebase Realtime Database, usando el Admin SDK
 * (service account) en vez del login de Google del panel.
 *
 * Uso:
 *   node scripts/import-quotes-to-firebase.mjs <archivo.json> [--dry-run]
 *
 * Variables de entorno requeridas:
 *   FIREBASE_SERVICE_ACCOUNT_KEY  Ruta al JSON de la service account
 *                                 (ver docs/admin/SETUP.md, sección 6).
 *   FIREBASE_DATABASE_URL         URL de la Realtime Database
 *                                 (mismo valor que NEXT_PUBLIC_FIREBASE_DATABASE_URL).
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const ALLOWED_CATEGORIES = new Set([
  "motivación", "lucha", "tristeza", "amor", "amistad",
  "reflexión", "soledad", "sacrificio", "esperanza", "orgullo",
]);
const ALLOWED_SIZES = new Set(["xs", "short", "medium", "long"]);
const SLUG_RE = /^[a-z0-9-]+$/;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

const [, , filePath, ...flags] = process.argv;
const dryRun = flags.includes("--dry-run");

if (!filePath) {
  fail("uso: node scripts/import-quotes-to-firebase.mjs <archivo.json> [--dry-run]");
}

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!keyPath) fail("falta la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY");
if (!databaseURL) fail("falta la variable de entorno FIREBASE_DATABASE_URL");

let items;
try {
  items = JSON.parse(readFileSync(filePath, "utf-8"));
} catch (e) {
  fail(`no se pudo leer/parsear ${filePath}: ${e.message}`);
}

if (!Array.isArray(items)) {
  fail("el archivo debe contener un array JSON en la raíz.");
}

function validateItem(item, index) {
  const problems = [];
  if (typeof item !== "object" || item === null) {
    return [`elemento ${index}: no es un objeto`];
  }
  for (const field of ["anime", "author", "quote"]) {
    if (typeof item[field] !== "string" || !item[field].trim()) {
      problems.push(`elemento ${index}: falta "${field}"`);
    }
  }
  if (typeof item.quote === "string" && item.quote.trim().length < 10) {
    problems.push(`elemento ${index}: "quote" demasiado corta`);
  }
  if (item.quoteEn !== undefined && item.quoteEn !== null) {
    if (typeof item.quoteEn !== "string" || item.quoteEn.trim().length < 10) {
      problems.push(`elemento ${index}: "quoteEn" inválida (debe ser texto >=10 caracteres)`);
    }
  }
  if (item.animeSlug !== undefined && item.animeSlug !== null) {
    if (typeof item.animeSlug !== "string" || !SLUG_RE.test(item.animeSlug)) {
      problems.push(`elemento ${index}: "animeSlug" inválido (solo a-z, 0-9, -)`);
    }
  }
  if (item.categories !== undefined && item.categories !== null) {
    if (!Array.isArray(item.categories) || item.categories.length === 0 || item.categories.length > 4) {
      problems.push(`elemento ${index}: "categories" debe ser un array de 1 a 4 elementos`);
    } else {
      const bad = item.categories.filter((c) => !ALLOWED_CATEGORIES.has(c));
      if (bad.length) problems.push(`elemento ${index}: categorías inválidas: ${bad.join(", ")}`);
    }
  }
  if (item.size !== undefined && item.size !== null && !ALLOWED_SIZES.has(item.size)) {
    problems.push(`elemento ${index}: "size" inválido: ${item.size}`);
  }
  return problems;
}

const allProblems = items.flatMap((item, i) => validateItem(item, i));
if (allProblems.length) {
  console.error(`${allProblems.length} problema(s) de validación:`);
  allProblems.forEach((p) => console.error(` - ${p}`));
  process.exit(1);
}

const app = initializeApp({
  credential: cert(JSON.parse(readFileSync(keyPath, "utf-8"))),
  databaseURL,
});
const db = getDatabase(app);
const quotesRef = db.ref("quotes");

const snapshot = await quotesRef.get();
const existing = snapshot.val() ?? {};
const existingKeys = new Set(
  Object.values(existing).map((q) =>
    [q.anime, q.author, q.quote].map((s) => (s ?? "").trim().toLowerCase()).join("||")
  )
);

const toImport = [];
const skipped = [];
for (const item of items) {
  const key = [item.anime, item.author, item.quote].map((s) => (s ?? "").trim().toLowerCase()).join("||");
  if (existingKeys.has(key)) {
    skipped.push(item);
    continue;
  }
  toImport.push({
    anime: item.anime.trim(),
    author: item.author.trim(),
    quote: item.quote.trim(),
    quoteEn: item.quoteEn?.trim() || null,
    categories: item.categories ?? null,
    animeSlug: item.animeSlug ?? null,
    size: item.size ?? null,
  });
}

console.log(`Frases en el archivo: ${items.length}`);
console.log(`Ya existen en Firebase (se omiten): ${skipped.length}`);
console.log(`Nuevas a importar: ${toImport.length}`);

if (dryRun) {
  console.log("\n--dry-run: no se escribió nada en Firebase.");
  toImport.forEach((q) => console.log(` + [${q.anime}] ${q.author}: ${q.quote}`));
  process.exit(0);
}

for (const quote of toImport) {
  const newRef = quotesRef.push();
  await newRef.set(quote);
  console.log(`OK  [${quote.anime}] ${quote.author}: ${quote.quote.slice(0, 50)}...`);
}

console.log(`\nListo. ${toImport.length} frase(s) nueva(s) subida(s) a Firebase.`);
process.exit(0);
