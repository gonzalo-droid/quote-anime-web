#!/usr/bin/env node
/**
 * Actualiza quoteEn y size en frases que YA existen en Firebase, por su key
 * (no crea nodos nuevos). Pensado para completar el campo quoteEn en lotes
 * que se subieron antes de tener traducción, sin pasar por el login de
 * Google ni por el botón "Asignar XS" de /admin (que solo toca `size`).
 *
 * Uso:
 *   node scripts/backfill-quote-translations.mjs <archivo.json> [--dry-run]
 *
 * Formato del archivo de entrada (array):
 *   [{ "id": "<key de Firebase>", "quoteEn": "...", "size": "xs" }, ...]
 *
 * Variables de entorno requeridas (mismas que import-quotes-to-firebase.mjs):
 *   FIREBASE_SERVICE_ACCOUNT_KEY
 *   FIREBASE_DATABASE_URL
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const ALLOWED_SIZES = new Set(["xs", "short", "medium", "long"]);

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

const [, , filePath, ...flags] = process.argv;
const dryRun = flags.includes("--dry-run");

if (!filePath) {
  fail("uso: node scripts/backfill-quote-translations.mjs <archivo.json> [--dry-run]");
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
if (!Array.isArray(items)) fail("el archivo debe contener un array JSON en la raíz.");

const problems = [];
items.forEach((item, i) => {
  if (typeof item?.id !== "string" || !item.id.trim()) {
    problems.push(`elemento ${i}: falta "id" (key de Firebase)`);
  }
  if (typeof item?.quoteEn !== "string" || item.quoteEn.trim().length < 10) {
    problems.push(`elemento ${i}: "quoteEn" inválida (debe ser texto >=10 caracteres)`);
  }
  if (item?.size !== undefined && item?.size !== null && !ALLOWED_SIZES.has(item.size)) {
    problems.push(`elemento ${i}: "size" inválido: ${item.size}`);
  }
});
if (problems.length) {
  console.error(`${problems.length} problema(s) de validación:`);
  problems.forEach((p) => console.error(` - ${p}`));
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

let missing = 0;
let unchanged = 0;
const toUpdate = [];

for (const item of items) {
  const current = existing[item.id];
  if (!current) {
    console.warn(`AVISO: no existe ninguna frase con id="${item.id}" (se omite)`);
    missing++;
    continue;
  }
  const nextSize = item.size ?? current.size ?? null;
  if (current.quoteEn === item.quoteEn.trim() && current.size === nextSize) {
    unchanged++;
    continue;
  }
  toUpdate.push({ id: item.id, quoteEn: item.quoteEn.trim(), size: nextSize, anime: current.anime, quote: current.quote });
}

console.log(`Elementos en el archivo: ${items.length}`);
console.log(`No encontrados en Firebase (omitidos): ${missing}`);
console.log(`Ya estaban al día (sin cambios): ${unchanged}`);
console.log(`A actualizar: ${toUpdate.length}`);

if (dryRun) {
  console.log("\n--dry-run: no se escribió nada en Firebase.");
  toUpdate.slice(0, 15).forEach((u) =>
    console.log(` ~ [${u.anime}] "${u.quote.slice(0, 40)}..." -> size=${u.size}, quoteEn="${u.quoteEn.slice(0, 40)}..."`)
  );
  if (toUpdate.length > 15) console.log(`   ... y ${toUpdate.length - 15} más.`);
  process.exit(0);
}

for (const u of toUpdate) {
  await quotesRef.child(u.id).update({ quoteEn: u.quoteEn, size: u.size });
}

console.log(`\nListo. ${toUpdate.length} frase(s) actualizada(s) en Firebase.`);
process.exit(0);
