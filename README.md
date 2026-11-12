# Manete · Cœur à Cœur

*Manete in me* : « Demeurez en moi » (Jn 15,4).

Application de prière catholique **gratuite, sans publicité, sans compte et sans collecte de données**. Tout reste sur le téléphone.

*A free, ad-free Catholic prayer app. No account, no tracking: everything stays on the phone. French for now.*

## Ce que fait l'app

- **Prière guidée** de 5 à 30 minutes : entrer en présence, une Parole, un temps de silence les yeux fermés, un cœur à cœur avec Jésus, une prière de l'Église.
- **Neuvaines** : une bibliothèque (Marie, saint Joseph, saint Thomas d'Aquin, défunts, Noël, Esprit Saint, miséricorde), ou n'importe quelle neuvaine que l'on colle soi-même. Un cierge s'allume par jour.
- **Bénédicités** : avant et après le repas, pour les enfants (avec des gestes) et entre adultes, plus ceux que l'on ajoute soi-même.
- **Prier autrement** : chapelet guidé, Angélus (*Regina Caeli* au temps pascal), examen du soir, prière en famille, louange (liens vers Spotify, YouTube ou Deezer), oraison, psaumes, adoration, prière du couple, prière aux anges gardiens (matin et soir).
- **Complies** (la prière de la nuit) et **retraites de 7 jours** : Avent, Carême, apprendre à prier.
- **Widget Android** : saint et parole du jour sur l'écran d'accueil, avec un bouton « 1 minute avec Jésus ».
- **Prière express** d'une minute, et **pause** dans le chapelet et les autres prières : on reprend plus tard, là où on en était.
- **Calendrier liturgique** : saint du jour pour chaque jour de l'année, fête du jour, temps liturgique et couleur, et la bonne neuvaine proposée au bon moment.
- **Saint patron** au choix (liste ou saint ajouté soi-même) avec sa prière de dévotion, carnet d'intentions, « Ce qu'il m'a dit », médailles, jour de grâce. Les points peuvent être masqués.
- **Couleur de fond** au choix : bleu nuit, bordeaux, forêt, prune, bleu canard, encre, ou parchemin clair.
- **Rappels** (notifications locales), **sauvegarde et restauration** par fichier, **partage** d'une neuvaine ou d'une parole.

## Images saintes

L'app peut afficher de vraies peintures et icônes anciennes (Fra Angelico, Murillo, Sassoferrato, Rembrandt, Holman Hunt, l'icône du Christ du Sinaï…), toutes du **domaine public**.

1. Lance **une fois** `npm run images` (connexion internet nécessaire). Le script cherche chaque œuvre sur Wikimedia Commons, **ne garde que les fichiers marqués domaine public ou CC0**, et les range dans `www/images/` avec leurs crédits (`credits.json`).
2. Vérifie chaque image : le lien vers sa page Commons est dans `credits.json` et dans l'app (Réglages › Images saintes). Si une image ne convient pas, indique le fichier exact dans `scripts/fetch-images.mjs` (champ `file`) et relance.
3. Lance `npm run sync`.

Les images sont ensuite intégrées à l'app : aucune connexion n'est faite pendant la prière. Sans elles, l'app garde ses dessins dorés.

## Liens vers l'Église

L'app renvoie vers les sites de référence plutôt que de recopier leurs textes : AELF (lectures du jour, liturgie des heures, Bible), Nominis (saints du jour), Hozana (prière en communauté), Messes.info (horaires de messes). Chaque référence biblique est cliquable et ouvre le chapitre sur AELF.

## Vie privée

L'app n'a pas de serveur. Elle n'envoie rien, à personne : pas d'analytics, pas de publicité, pas de compte. Les polices sont intégrées, sans Google Fonts. Voir [PRIVACY.md](PRIVACY.md).

## Accessibilité

L'app vise WCAG 2.2 niveau AA. Voir [ACCESSIBILITE.md](ACCESSIBILITE.md) pour l'évaluation et ses limites.

## Structure

| Dossier | Contenu |
|---|---|
| `www/index.html` | Toute l'application (HTML, CSS et JavaScript, sans dépendance) |
| `android/` | Projet Android généré par Capacitor |
| `assets/` | Icône et écran de démarrage (sources) |
| `docs/` | Version web installable (GitHub Pages) et page de confidentialité. Générée par `npm run web` |
| `scripts/` | Génération de la version web et des données du widget |

## Lancer et compiler

```bash
npm install
npm run android        # synchronise puis ouvre Android Studio
```

Après une modification de `www/index.html`, lancer `npm run sync` : il régénère les données du widget, la version web dans `docs/`, puis synchronise Android.

## Version web (GitHub Pages)

1. Pousse le dépôt sur GitHub, puis **Settings › Pages** : branche `main`, dossier `/docs`.
2. L'app est alors en ligne sur `https://<ton-compte>.github.io/<depot>/`. Elle fonctionne hors ligne et s'installe sur l'écran d'accueil (Android : menu ⋮ › Installer ; iPhone : Partager › Sur l'écran d'accueil).
3. La politique de confidentialité est à `…/confidentialite.html` : c'est l'adresse à donner à Google Play.
4. Les boutons « Partager » ajoutent automatiquement l'adresse du site.

La version web n'a pas les rappels ni le widget, qui demandent l'app Android. Pour publier sur Google Play, voir [PUBLIER-PLAY-STORE.md](PUBLIER-PLAY-STORE.md).

## Licences

- **Code** : MIT (voir [LICENSE](LICENSE)).
- **Textes originaux** (méditations, neuvaines rédigées pour l'app) : CC BY-SA 4.0.
- **Bible** : d'après la traduction Louis Segond 1910 (domaine public), où « l'Éternel » est rendu par « le Seigneur ». Les quelques versets des livres deutérocanoniques (Tobie, Sagesse, Maccabées) sont traduits pour l'app. **Prières traditionnelles** (*Notre Père*, *Je vous salue Marie*, *Souvenez-vous*, Angélus, prière de Léon XIII à saint Joseph…) : domaine public.
- **Polices** : Cinzel, EB Garamond et Jost, sous licence SIL Open Font License.
- **Musique** : aucune n'est intégrée. L'app ouvre seulement une recherche dans l'application de musique choisie par l'utilisateur.

## Contribuer

Les corrections (textes, calendrier liturgique, traductions) sont les bienvenues par *issue* ou *pull request*.
