# Manete · Cœur à Cœur

*Manete in me* : « Demeurez en moi » (Jn 15,4).

Application de prière catholique **gratuite, sans publicité, sans compte et sans collecte de données**. Tout reste sur le téléphone.

*A free, ad-free Catholic prayer app. No account, no tracking: everything stays on the phone. French for now.*

## Ce que fait l'app

- **Prière guidée** de 5 à 30 minutes : entrer en présence, une Parole, un temps de silence les yeux fermés, un cœur à cœur avec Jésus, une prière de l'Église.
- **Neuvaines** : une bibliothèque (Marie, saint Joseph, saint Thomas d'Aquin, défunts, Noël, Esprit Saint, miséricorde), ou n'importe quelle neuvaine que l'on colle soi-même. Un cierge s'allume par jour.
- **Bénédicités** : avant et après le repas, pour les enfants (avec des gestes) et entre adultes, plus ceux que l'on ajoute soi-même.
- **Prier autrement** : chapelet guidé, Angélus (*Regina Caeli* au temps pascal), examen du soir, prière en famille, louange (liens vers Spotify, YouTube ou Deezer), oraison, psaumes, adoration, prière du couple, prière aux anges gardiens (matin et soir).
- **Calendrier liturgique** : fête du jour, temps liturgique et couleur, et la bonne neuvaine proposée au bon moment.
- **Saint patron** au choix (liste ou saint ajouté soi-même) avec sa prière de dévotion, carnet d'intentions, « Ce qu'il m'a dit », médailles, jour de grâce. Les points peuvent être masqués.
- **Couleur de fond** au choix : bleu nuit, bordeaux, forêt, prune, bleu canard, encre, ou parchemin clair.
- **Rappels** (notifications locales), **sauvegarde et restauration** par fichier, **partage** d'une neuvaine ou d'une parole.

## Vie privée

L'app n'a pas de serveur. Elle n'envoie rien, à personne : pas d'analytics, pas de publicité, pas de compte. Les polices sont intégrées, sans Google Fonts. Voir [PRIVACY.md](PRIVACY.md).

## Structure

| Dossier | Contenu |
|---|---|
| `www/index.html` | Toute l'application (HTML, CSS et JavaScript, sans dépendance) |
| `android/` | Projet Android généré par Capacitor |
| `assets/` | Icône et écran de démarrage (sources) |
| `docs/` | Page de confidentialité, publiable avec GitHub Pages |

## Lancer et compiler

```bash
npm install
npm run android        # synchronise puis ouvre Android Studio
```

Après une modification de `www/index.html`, lancer `npx cap sync`. Pour publier sur Google Play, voir [PUBLIER-PLAY-STORE.md](PUBLIER-PLAY-STORE.md).

## Licences

- **Code** : MIT (voir [LICENSE](LICENSE)).
- **Textes originaux** (méditations, neuvaines rédigées pour l'app) : CC BY-SA 4.0.
- **Bible** : d'après la traduction Louis Segond 1910 (domaine public), où « l'Éternel » est rendu par « le Seigneur ». Les quelques versets des livres deutérocanoniques (Tobie, Sagesse, Maccabées) sont traduits pour l'app. **Prières traditionnelles** (*Notre Père*, *Je vous salue Marie*, *Souvenez-vous*, Angélus, prière de Léon XIII à saint Joseph…) : domaine public.
- **Polices** : Cinzel, EB Garamond et Jost, sous licence SIL Open Font License.
- **Musique** : aucune n'est intégrée. L'app ouvre seulement une recherche dans l'application de musique choisie par l'utilisateur.

## Contribuer

Les corrections (textes, calendrier liturgique, traductions) sont les bienvenues par *issue* ou *pull request*.
