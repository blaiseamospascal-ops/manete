// Télécharge des peintures et icônes du domaine public depuis Wikimedia Commons,
// et les range dans www/images/ avec leurs crédits (www/images/credits.json).
// Usage : npm run images     (une seule fois, avec une connexion internet)
// Seuls les fichiers marqués « domaine public » ou CC0 sur Commons sont gardés.
// Pour imposer un fichier précis, renseigne "file" (ex. "File:Nom exact.jpg").
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";

const CATALOGUE = [
  { id: "lumiere", title: "La Lumière du monde", artist: "William Holman Hunt", date: "1851-1853", desc: "« Voici, je me tiens à la porte, et je frappe. » (Ap 3,20)", q: "Holman Hunt The Light of the World Keble College" },
  { id: "pantocrator", title: "Christ Pantocrator", artist: "Monastère Sainte-Catherine du Sinaï", date: "VIe siècle", desc: "L'une des plus anciennes icônes du Christ.", q: "Christ Pantocrator Saint Catherine's Monastery Sinai icon" },
  { id: "sacrecoeur", title: "Le Sacré-Cœur de Jésus", artist: "Pompeo Batoni", date: "1767", desc: "« Voici ce Cœur qui a tant aimé les hommes. »", q: "Pompeo Batoni Sacred Heart of Jesus" },
  { id: "tete", title: "Tête du Christ", artist: "Rembrandt", date: "vers 1648", desc: "Un visage de douceur, peint d'après nature.", q: "Rembrandt Head of Christ" },
  { id: "gethsemani", title: "Le Christ à Gethsémani", artist: "Heinrich Hofmann", date: "1890", desc: "« Que ta volonté soit faite. » (Mt 26,42)", q: "Heinrich Hofmann Christ in Gethsemane" },
  { id: "enfants", title: "Le Christ bénissant les enfants", artist: "Lucas Cranach l'Ancien", date: "XVIe siècle", desc: "« Laissez les petits enfants venir à moi. » (Mc 10,14)", q: "Lucas Cranach Christ blessing the children" },
  { id: "vierge", title: "La Vierge en prière", artist: "Sassoferrato", date: "1640-1650", desc: "Marie recueillie, modèle de toute prière.", q: "Sassoferrato The Virgin in Prayer National Gallery" },
  { id: "immaculee", title: "L'Immaculée Conception", artist: "Bartolomé Esteban Murillo", date: "1678", desc: "« Une femme enveloppée du soleil. » (Ap 12,1)", q: "Murillo Immaculate Conception of Soult Prado" },
  { id: "vladimir", title: "Notre-Dame de Vladimir", artist: "Icône de Constantinople", date: "XIIe siècle", desc: "La Mère et l'Enfant, joue contre joue : la tendresse.", q: "Theotokos of Vladimir icon Tretyakov" },
  { id: "annonciation", title: "L'Annonciation", artist: "Fra Angelico", date: "vers 1440", desc: "« Voici la servante du Seigneur. » (Lc 1,38)", q: "Fra Angelico Annunciation San Marco Florence corridor" },
  { id: "famille", title: "La Sainte Famille à l'oiseau", artist: "Bartolomé Esteban Murillo", date: "vers 1650", desc: "Jésus, Marie et Joseph dans la joie d'une maison.", q: "Murillo Holy Family with a Little Bird Prado" },
  { id: "joseph", title: "Saint Joseph et l'Enfant Jésus", artist: "Guido Reni", date: "vers 1635", desc: "Le père nourricier, l'homme juste.", q: "Guido Reni Saint Joseph with the Infant Jesus" },
  { id: "ange", title: "L'Ange gardien", artist: "Le Dominiquin", date: "1615", desc: "« Il ordonnera à ses anges de te garder. » (Ps 91,11)", q: "Domenichino Guardian Angel Capodimonte" }
];

const API = "https://commons.wikimedia.org/w/api.php";
const UA = { "User-Agent": "Manete/1.0 (application de prière libre ; images du domaine public)" };
const PROPS = "&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=900&format=json&origin=*";
const isFree = (ii) => /public domain|^pd|cc0|cc-zero/i.test((ii.extmetadata?.LicenseShortName?.value || "") + " " + (ii.extmetadata?.License?.value || ""));
const okMime = (ii) => /image\/(jpeg|png)/.test(ii.mime || "");

export function pick(apiJson) {
  const pages = Object.values(apiJson?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  for (const p of pages) { const ii = p.imageinfo?.[0]; if (ii && okMime(ii) && isFree(ii) && ii.thumburl) return { title: p.title, ii }; }
  return null;
}

async function find(item) {
  const url = item.file
    ? `${API}?action=query&titles=${encodeURIComponent(item.file)}${PROPS}`
    : `${API}?action=query&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch=${encodeURIComponent(item.q)}${PROPS}`;
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error("Commons a répondu " + r.status);
  return pick(await r.json());
}

async function main() {
  const dir = new URL("../www/images/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const creditsFile = new URL("credits.json", dir);
  const credits = existsSync(creditsFile) ? JSON.parse(readFileSync(creditsFile, "utf8")) : {};
  for (const item of CATALOGUE) {
    try {
      const hit = await find(item);
      if (!hit) { console.log(`✗ ${item.id} : aucun fichier libre trouvé (précise "file" dans le catalogue)`); continue; }
      const ext = /png/.test(hit.ii.mime) ? "png" : "jpg";
      const img = await fetch(hit.ii.thumburl, { headers: UA });
      if (!img.ok) throw new Error("téléchargement " + img.status);
      writeFileSync(new URL(`${item.id}.${ext}`, dir), Buffer.from(await img.arrayBuffer()));
      credits[item.id] = { src: `images/${item.id}.${ext}`, title: item.title, artist: item.artist, date: item.date, desc: item.desc,
        license: (hit.ii.extmetadata?.LicenseShortName?.value || "Domaine public").replace(/<[^>]+>/g, ""), page: hit.ii.descriptionurl, file: hit.title };
      console.log(`✓ ${item.id} ← ${hit.title}  [${credits[item.id].license}]`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) { console.log(`✗ ${item.id} : ${e.message}`); }
  }
  writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
  console.log(`\n${Object.keys(credits).length} image(s) prête(s). Vérifie chaque fichier sur sa page Commons (lien dans credits.json),\npuis lance « npm run sync ».`);
}
if (import.meta.url === `file://${process.argv[1]}`) main();
