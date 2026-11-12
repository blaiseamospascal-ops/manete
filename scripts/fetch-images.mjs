// Télécharge des peintures et icônes du domaine public depuis Wikimedia Commons,
// et les range dans www/images/ avec leurs crédits (www/images/credits.json).
// Usage : npm run images     (avec une connexion internet ; les images déjà présentes sont gardées)
//         npm run images -- --force   (tout retélécharger)
// Seuls les fichiers marqués « domaine public » ou CC0 sur Commons sont gardés.
// Pour imposer un fichier précis, renseigne "file" (ex. "File:Nom exact.jpg").
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const CATALOGUE = [
  { id: "lumiere", must: "Hunt", title: "La Lumière du monde", artist: "William Holman Hunt", date: "1851-1853", desc: "« Voici, je me tiens à la porte, et je frappe. » (Ap 3,20)", q: "Holman Hunt The Light of the World Keble College" },
  { id: "pantocrator", must: "Pantocrator", title: "Christ Pantocrator", artist: "Monastère Sainte-Catherine du Sinaï", date: "VIe siècle", desc: "L'une des plus anciennes icônes du Christ.", q: "Christ Pantocrator Saint Catherine's Monastery Sinai icon" },
  { id: "sacrecoeur", must: "Batoni", title: "Le Sacré-Cœur de Jésus", artist: "Pompeo Batoni", date: "1767", desc: "« Voici ce Cœur qui a tant aimé les hommes. »", q: "Pompeo Batoni Sacred Heart Jesus Gesù" },
  { id: "tete", must: "Rembrandt", title: "Tête du Christ", artist: "Rembrandt", date: "vers 1648", desc: "Un visage de douceur, peint d'après nature.", q: "Rembrandt Head of Christ" },
  { id: "gethsemani", must: "Hofmann|Gethsemane", title: "Le Christ à Gethsémani", artist: "Heinrich Hofmann", date: "1890", desc: "« Que ta volonté soit faite. » (Mt 26,42)", q: "Heinrich Hofmann Christ in Gethsemane" },
  { id: "enfants", must: "Cranach", title: "Le Christ bénissant les enfants", artist: "Lucas Cranach l'Ancien", date: "XVIe siècle", desc: "« Laissez les petits enfants venir à moi. » (Mc 10,14)", q: "Lucas Cranach Christ blessing the children" },
  { id: "vierge", must: "Sassoferrato", title: "La Vierge en prière", artist: "Sassoferrato", date: "1640-1650", desc: "Marie recueillie, modèle de toute prière.", q: "Sassoferrato The Virgin in Prayer National Gallery" },
  { id: "immaculee", must: "Murillo|Venerable", title: "L'Immaculée Conception", artist: "Bartolomé Esteban Murillo", date: "1678", desc: "« Une femme enveloppée du soleil. » (Ap 12,1)", q: "Murillo Immaculate Conception of Soult Prado" },
  { id: "vladimir", must: "Vladimir", title: "Notre-Dame de Vladimir", artist: "Icône de Constantinople", date: "XIIe siècle", desc: "La Mère et l'Enfant, joue contre joue : la tendresse.", q: "Theotokos of Vladimir icon Tretyakov" },
  { id: "annonciation", must: "Angelico", title: "L'Annonciation", artist: "Fra Angelico", date: "vers 1440", desc: "« Voici la servante du Seigneur. » (Lc 1,38)", q: "Fra Angelico Annunciation San Marco Florence corridor" },
  { id: "famille", must: "Murillo", title: "La Sainte Famille à l'oiseau", artist: "Bartolomé Esteban Murillo", date: "vers 1650", desc: "Jésus, Marie et Joseph dans la joie d'une maison.", q: "Murillo Holy Family with a Little Bird Prado" },
  { id: "joseph", must: "Reni", title: "Saint Joseph et l'Enfant Jésus", artist: "Guido Reni", date: "vers 1635", desc: "Le père nourricier, l'homme juste.", q: "Guido Reni Saint Joseph with the Infant Jesus" },
  { id: "ange", must: "Cortona|Berrettini", title: "L'Ange gardien", artist: "Pierre de Cortone", date: "1656", desc: "« Il ordonnera à ses anges de te garder. » (Ps 91,11)", q: "Pietro da Cortona Guardian Angel" },
  // Vie du Christ
  { id: "appel", must: "Caravaggio|Caravage", title: "La Vocation de saint Matthieu", artist: "Le Caravage", date: "1600", desc: "« Suis-moi. » Et Matthieu se leva. (Mt 9,9)", q: "Caravaggio Calling of Saint Matthew Contarelli" },
  { id: "prodigue", must: "Rembrandt", title: "Le Retour du fils prodigue", artist: "Rembrandt", date: "vers 1668", desc: "« Son père le vit et fut ému de compassion. » (Lc 15,20)", q: "Rembrandt Return of the Prodigal Son Hermitage" },
  { id: "sermon", must: "Bloch", title: "Le Sermon sur la montagne", artist: "Carl Bloch", date: "1877", desc: "« Heureux les cœurs purs. » (Mt 5,8)", q: "Carl Bloch Sermon on the Mount" },
  { id: "bethesda", must: "Bloch", title: "Le Christ guérissant à Bethesda", artist: "Carl Bloch", date: "1883", desc: "« Veux-tu être guéri ? » (Jn 5,6)", q: "Carl Bloch Christ healing the sick at Bethesda" },
  { id: "emmaus", must: "Caravaggio|Caravage", title: "Le Souper à Emmaüs", artist: "Le Caravage", date: "1601", desc: "« Ils le reconnurent à la fraction du pain. » (Lc 24,35)", q: "Caravaggio Supper at Emmaus National Gallery London" },
  { id: "cene", must: "Leonardo|Vinci", title: "La Cène", artist: "Léonard de Vinci", date: "1495-1498", desc: "« Faites ceci en mémoire de moi. » (Lc 22,19)", q: "Leonardo da Vinci The Last Supper restored" },
  { id: "crucifix", must: "Vel[aá]zquez", title: "Le Christ en croix", artist: "Diego Velázquez", date: "vers 1632", desc: "« Il n'y a pas de plus grand amour. » (Jn 15,13)", q: "Velazquez Christ Crucified Prado" },
  { id: "resurrection", must: "Piero", not: "guard|detail|soldat|soldier", title: "La Résurrection", artist: "Piero della Francesca", date: "vers 1463", desc: "« Il est ressuscité, il n'est point ici. » (Mc 16,6)", q: "Piero della Francesca Resurrection Sansepolcro" },
  { id: "nativite", must: "Honthorst", title: "L'Adoration des bergers", artist: "Gerrit van Honthorst", date: "1622", desc: "« Il vous est né un Sauveur. » (Lc 2,11)", q: "Gerard van Honthorst Adoration of the Shepherds 1622" },
  { id: "latour", must: "Tour", title: "Le Nouveau-né", artist: "Georges de La Tour", date: "vers 1648", desc: "Marie contemple l'Enfant, à la lumière d'une bougie.", q: "Georges de La Tour The New-born Child Rennes" },
  { id: "transfiguration", must: "Angelico", title: "La Transfiguration", artist: "Fra Angelico", date: "vers 1440", desc: "« Il est bon que nous soyons ici. » (Mt 17,4)", q: "Fra Angelico Transfiguration San Marco" },
  { id: "pentecote", must: "Greco", title: "La Pentecôte", artist: "Le Greco", date: "vers 1600", desc: "« Ils furent tous remplis du Saint-Esprit. » (Ac 2,4)", q: "El Greco Pentecost Prado" },
  { id: "agneau", must: "Lamb|Lam ?Gods|Agneau", not: "open|closed|ferm|\\bAdam\\b|\\bEve\\b|polyptych|detail", title: "L'Adoration de l'Agneau mystique", artist: "Jan et Hubert van Eyck", date: "1432", desc: "Le chef-d'œuvre de la cathédrale Saint-Bavon, à Gand.", q: "Ghent Altarpiece Adoration of the Mystic Lamb central panel" },
  { id: "descente", must: "Weyden", title: "La Descente de croix", artist: "Rogier van der Weyden", date: "vers 1435", desc: "Le peintre de Tournai et Bruxelles, au sommet de son art.", q: "Rogier van der Weyden Descent from the Cross Prado" },
  // Marie
  { id: "memling", must: "Memling", title: "La Vierge et l'Enfant", artist: "Hans Memling", date: "vers 1480", desc: "Un maître de Bruges.", q: "Hans Memling Virgin and Child" },
  { id: "rosaire", must: "Murillo", title: "La Vierge du Rosaire", artist: "Bartolomé Esteban Murillo", date: "vers 1650", desc: "Marie tend le chapelet.", q: "Murillo Virgin of the Rosary Prado" },
  { id: "sixtine", must: "Raffaello|Raphael|Sanzio", title: "La Madone Sixtine", artist: "Raphaël", date: "1512", desc: "Marie présente l'Enfant au monde.", q: "Raphael Sistine Madonna" },
  { id: "magnificat", must: "Botticelli", title: "La Vierge du Magnificat", artist: "Sandro Botticelli", date: "vers 1483", desc: "« Mon âme exalte le Seigneur. » (Lc 1,46)", q: "Botticelli Madonna of the Magnificat Uffizi" },
  { id: "bellini", must: "Bellini", title: "La Vierge à la prairie", artist: "Giovanni Bellini", date: "vers 1505", desc: "La paix d'une mère et de son enfant.", q: "Giovanni Bellini Madonna of the Meadow" },
  { id: "perpetuel", must: "Perpetual|Perp[eé]tuel|Succour", title: "Notre-Dame du Perpétuel Secours", artist: "Icône crétoise", date: "XVe siècle", desc: "L'icône confiée aux rédemptoristes, à Rome.", q: "Our Lady of Perpetual Help icon Rome" },
  { id: "guadalupe", must: "Guadalupe", title: "Notre-Dame de Guadalupe", artist: "Image de la tilma de Juan Diego", date: "1531", desc: "Marie apparue à Juan Diego, au Mexique.", q: "Virgen de Guadalupe tilma 1531" },
  { id: "lys", must: "Bouguereau", title: "La Vierge aux lys", artist: "William Bouguereau", date: "1899", desc: "Marie toute pure, entourée d'anges.", q: "Bouguereau The Virgin of the Lilies" },
  { id: "pieta", must: "Bouguereau", title: "Pietà", artist: "William Bouguereau", date: "1876", desc: "Marie près de son Fils : la consolation des affligés.", q: "Bouguereau Pieta 1876" },
  // Saints et anges
  { id: "michel", must: "Reni", title: "Saint Michel archange", artist: "Guido Reni", date: "1635", desc: "« Qui est comme Dieu ? »", q: "Guido Reni Archangel Michael Santa Maria della Concezione" },
  { id: "francois", must: "Giotto", not: "copy|Lokhoff", title: "Saint François prêchant aux oiseaux", artist: "Giotto", date: "vers 1297", desc: "« Loué sois-tu, mon Seigneur, avec toutes tes créatures. »", q: "Giotto Saint Francis preaching to the birds Assisi" },
  { id: "thomas", must: "Crivelli", title: "Saint Thomas d'Aquin", artist: "Carlo Crivelli", date: "1476", desc: "Le docteur angélique, son livre à la main.", q: "Carlo Crivelli Saint Thomas Aquinas" },
  { id: "augustin", must: "Champaigne", title: "Saint Augustin", artist: "Philippe de Champaigne", date: "vers 1650", desc: "Le cœur brûlant, entre la Vérité et l'Écriture. Un peintre bruxellois.", q: "Philippe de Champaigne Saint Augustine LACMA" },
  { id: "monique", must: "Scheffer", title: "Saint Augustin et sainte Monique", artist: "Ary Scheffer", date: "1854", desc: "La mère et le fils, à Ostie, regardant le ciel.", q: "Ary Scheffer Saint Augustine and Saint Monica" },
  { id: "jerome", must: "Caravaggio|Caravage", title: "Saint Jérôme écrivant", artist: "Le Caravage", date: "1606", desc: "« Ignorer les Écritures, c'est ignorer le Christ. »", q: "Caravaggio Saint Jerome Writing Borghese" },
  { id: "ignace", must: "Rubens", title: "Saint Ignace de Loyola", artist: "Pierre Paul Rubens", date: "vers 1620", desc: "« Tout pour la plus grande gloire de Dieu. » Un peintre d'Anvers.", q: "Rubens Saint Ignatius of Loyola Norton Simon" },
  { id: "tobie", must: "Tobi", title: "Tobie et l'ange", artist: "Filippino Lippi", date: "vers 1475-1480", desc: "L'ange Raphaël guide Tobie vers Sara.", q: "Filippino Lippi Tobias and the Angel" },
  // La prière au quotidien
  { id: "angelus", must: "Millet", title: "L'Angélus", artist: "Jean-François Millet", date: "1857-1859", desc: "Au son de la cloche, deux paysans s'arrêtent pour prier.", q: "Jean-Francois Millet The Angelus Orsay" },
  { id: "benedicite", must: "Chardin", title: "Le Bénédicité", artist: "Jean Siméon Chardin", date: "1740", desc: "Une petite fille dit le bénédicité avant le repas.", q: "Chardin Le Benedicite Louvre" },
  { id: "invite", must: "Uhde", title: "Viens, Seigneur Jésus, sois notre hôte", artist: "Fritz von Uhde", date: "1885", desc: "Le Christ s'invite à la table d'une famille.", q: "Fritz von Uhde Komm Herr Jesu sei unser Gast" },
  { id: "mains", must: "D[uü]rer", title: "Les Mains en prière", artist: "Albrecht Dürer", date: "1508", desc: "Le dessin le plus célèbre de la prière.", q: "Albrecht Durer Praying Hands Albertina" },
  { id: "temple", must: "Hunt", title: "Jésus retrouvé au Temple", artist: "William Holman Hunt", date: "1860", desc: "« Ne saviez-vous pas qu'il faut que je sois aux affaires de mon Père ? » (Lc 2,49)", q: "Holman Hunt Finding of the Saviour in the Temple" }
];

const API = "https://commons.wikimedia.org/w/api.php";
const UA = { "User-Agent": "Manete/1.0 (application de prière libre ; images du domaine public)" };
const PROPS = "&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=900&format=json&origin=*";
const isFree = (ii) => /public domain|^pd|cc0|cc-zero/i.test((ii.extmetadata?.LicenseShortName?.value || "") + " " + (ii.extmetadata?.License?.value || ""));
const okMime = (ii) => /image\/(jpeg|png)/.test(ii.mime || "");

// « must » : le nom du peintre (ou de l'œuvre) doit apparaître dans le nom du fichier ou les métadonnées.
export function pick(apiJson, must, not) {
  const re = must ? new RegExp(must, "i") : null;
  const no = not ? new RegExp(not, "i") : null;
  const pages = Object.values(apiJson?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !okMime(ii) || !isFree(ii) || !ii.thumburl) continue;
    const meta = p.title + " " + (ii.extmetadata?.Artist?.value || "") + " " + (ii.extmetadata?.ObjectName?.value || "");
    if (re && !re.test(meta)) continue;
    if (no && no.test(meta)) continue;
    return { title: p.title, ii };
  }
  return null;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Wikimedia limite les demandes rapprochées (erreur 429) : on attend puis on réessaie.
async function get(url) {
  for (let essai = 0; essai < 5; essai++) {
    const r = await fetch(url, { headers: UA });
    if (r.status !== 429 && r.status !== 503) return r;
    const attente = (Number(r.headers.get("retry-after")) || 5 * 2 ** essai) * 1000;
    console.log(`   … Wikimedia demande de patienter ${Math.round(attente / 1000)} s`);
    await sleep(attente);
  }
  throw new Error("Wikimedia refuse encore : relance la commande dans quelques minutes");
}

async function find(item) {
  const url = item.file
    ? `${API}?action=query&titles=${encodeURIComponent(item.file)}${PROPS}`
    : `${API}?action=query&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch=${encodeURIComponent(item.q)}${PROPS}`;
  const r = await get(url);
  if (!r.ok) throw new Error("Commons a répondu " + r.status);
  return pick(await r.json(), item.must, item.not);
}

async function main() {
  console.log("Recherche des images sur Wikimedia Commons…\n");
  const dir = new URL("../www/images/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const creditsFile = new URL("credits.json", dir);
  const credits = existsSync(creditsFile) ? JSON.parse(readFileSync(creditsFile, "utf8")) : {};
  const force = process.argv.includes("--force");
  for (const item of CATALOGUE) {
    const deja = credits[item.id];
    const okDeja = deja && existsSync(new URL(deja.src.replace("images/", ""), dir)) && (!item.must || new RegExp(item.must, "i").test(deja.file || "")) && (!item.not || !new RegExp(item.not, "i").test(deja.file || ""));
    if (!force && okDeja) {
      console.log(`= ${item.id} déjà présente`);
      continue;
    }
    delete credits[item.id];
    try {
      const hit = await find(item);
      if (!hit) { console.log(`✗ ${item.id} : aucun fichier libre trouvé (précise "file" dans le catalogue)`); continue; }
      const ext = /png/.test(hit.ii.mime) ? "png" : "jpg";
      const img = await get(hit.ii.thumburl);
      if (!img.ok) throw new Error("téléchargement " + img.status);
      writeFileSync(new URL(`${item.id}.${ext}`, dir), Buffer.from(await img.arrayBuffer()));
      credits[item.id] = { src: `images/${item.id}.${ext}`, title: item.title, artist: item.artist, date: item.date, desc: item.desc,
        license: (hit.ii.extmetadata?.LicenseShortName?.value || "Domaine public").replace(/<[^>]+>/g, ""), page: hit.ii.descriptionurl, file: hit.title };
      console.log(`✓ ${item.id} ← ${hit.title}  [${credits[item.id].license}]`);
      await sleep(1500);
    } catch (e) { console.log(`✗ ${item.id} : ${e.message}`); }
    await sleep(1000);
  }
  writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
  console.log(`\n${Object.keys(credits).length} image(s) prête(s). Vérifie chaque fichier sur sa page Commons (lien dans credits.json),\npuis lance « npm run sync ».`);
}
// Lancé directement (npm run images) : fonctionne aussi avec les chemins Windows.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
