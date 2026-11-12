// Construit la version web installable dans docs/ (pour GitHub Pages).
// Usage : node scripts/build-web.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, cpSync } from "node:fs";
const u = (p) => new URL("../" + p, import.meta.url);
let html = readFileSync(u("www/index.html"), "utf8");
html = html.replace("<title>", '<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icons/icon-192.png">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<title>');
mkdirSync(u("docs/icons"), { recursive: true });
writeFileSync(u("docs/index.html"), html);
for (const f of ["icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"]) copyFileSync(u("assets/web/" + f), u("docs/icons/" + f));
if (existsSync(u("www/images"))) cpSync(u("www/images"), u("docs/images"), { recursive: true });
const version = new Date().toISOString().slice(0, 19).replace(/\D/g, "");
writeFileSync(u("docs/sw.js"), readFileSync(u("scripts/sw-template.js"), "utf8").replace("__VERSION__", version));
writeFileSync(u("docs/manifest.webmanifest"), JSON.stringify({
  name: "Manete · Cœur à Cœur", short_name: "Manete", lang: "fr", start_url: "./", scope: "./", display: "standalone",
  background_color: "#0e1a36", theme_color: "#0e1a36", description: "Prière catholique simple, gratuite et privée.",
  icons: [{ src: "icons/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }],
  shortcuts: [{ name: "1 minute avec Jésus", url: "./#express" }]
}, null, 2));
console.log("docs/ prêt (version " + version + ")");
