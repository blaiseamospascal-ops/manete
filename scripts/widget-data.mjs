// Génère android/app/src/main/assets/widget_data.json à partir de www/index.html
// (saint ou fête du jour pour chaque date, et les paroles de la Bible).
// Usage : node scripts/widget-data.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const html = readFileSync(new URL("../www/index.html", import.meta.url), "utf8");
const block = (start) => { const i = html.indexOf(start); if (i < 0) throw new Error("introuvable : " + start); const a = html.indexOf("`", i) + 1, b = html.indexOf("`", a); return html.slice(a, b); };
const saints = {};
for (const l of block("const SAINT_JOUR={};").split("\n")) { const [k, n] = l.split("|"); if (k && n) saints[k] = n; }
for (const l of block("const FIXED={};").split("\n")) { const [k, n] = l.split("|"); if (k && n) saints[k] = n; }
const vi = html.indexOf("const VERSES=["), ve = html.indexOf("];", vi);
const verses = new Function("return " + html.slice(vi + "const VERSES=".length, ve + 1))();
mkdirSync(new URL("../android/app/src/main/assets/", import.meta.url), { recursive: true });
writeFileSync(new URL("../android/app/src/main/assets/widget_data.json", import.meta.url), JSON.stringify({ saints, verses }));
console.log(`widget_data.json : ${Object.keys(saints).length} jours, ${verses.length} paroles`);
