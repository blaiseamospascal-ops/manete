# Manete · Cœur à Cœur

*Manete in me* : « Demeurez en moi » (Jn 15,4).

Application de prière catholique **gratuite, sans publicité, sans compte et sans collecte de données**. Tout reste sur le téléphone.

*A free, ad-free Catholic prayer app. No account, no tracking: everything stays on the phone. French for now.*

## Ce que fait l'app

**Prier**

- **Prière guidée** de 5 à 30 minutes : entrer en présence, une Parole, un temps de silence les yeux fermés, un cœur à cœur avec Jésus, une prière de l'Église. Une cloche, un gong ou un orgue sonne à la fin.
- **Prière express** d'une minute, et **parcours « Apprendre à prier »** : de 1 à 30 minutes par jour, en 7 étapes d'une semaine.
- **Chapelet et rosaire** : les quatre séries de mystères ou le rosaire complet, avec un verset par mystère. On peut prier avec son chapelet en main : toucher un grain du dessin pour s'y placer, et mettre en pause à n'importe quel grain.
- **Prier autrement** : Angélus (*Regina Caeli* au temps pascal), examen du soir, oraison, psaumes, adoration, louange (liens vers Spotify, YouTube ou Deezer), complies, chapelet de la Miséricorde, chemin de croix.
- **Se confesser** : examen de conscience, déroulement de la confession et acte de contrition. Rien de ce qui est coché n'est enregistré.
- **Neuvaines** : une bibliothèque (Marie, saint Joseph, saint Thomas d'Aquin, défunts, Noël, Esprit Saint, miséricorde), ou n'importe quelle neuvaine que l'on colle soi-même. **Retraites de 7 jours** : Avent, Carême, apprendre à prier.

**En famille**

- **Prière en famille**, **prière du couple**, **prière des parents et des grands-parents** pour leurs enfants.
- **Chanter et danser** : trois chants à gestes montrés par le petit bonhomme, et un lien vers les chants gestués de Sœur Agathe.
- **Bénédicités** : avant et après le repas, pour les enfants (avec des gestes) et entre adultes, plus ceux que l'on ajoute soi-même.
- **Les voix du petit bonhomme** : on enregistre quelques mots avec ses enfants, et le compagnon de l'app parle avec leurs voix. Les enregistrements restent sur le téléphone.

**Au rythme de l'Église**

- **Calendrier liturgique** : saint du jour et autres saints fêtés, fête du jour, temps liturgique et couleur, et la bonne neuvaine proposée au bon moment.
- **Saint patron** au choix, avec sa prière de dévotion et sa propre image si on le souhaite. **Fêtes à souhaiter** : on note les personnes à fêter, avec une recherche dans le calendrier de l'app, et un rappel arrive le matin.
- **Fonds de fête** (Avent, Noël, Carême, Pâques, Pentecôte, fêtes de Marie, Toussaint), en plus de sept couleurs de fond.
- **Sanctuaires de Belgique et de France** : carte schématique hors ligne et fiches (Banneux, Beauraing, Lourdes, la Rue du Bac, La Salette…).

**Au quotidien**

- **Carnet** : intentions, grâces reçues, « Ce qu'il m'a dit », neuvaines et retraites achevées. Médailles, série de jours avec un jour de grâce par semaine ; les points peuvent être masqués.
- **Rappels** (notifications locales, avec « Prier maintenant » ou « Dans 1 heure »), **sauvegarde et restauration** par fichier, **partage** d'une neuvaine ou d'une parole, en image.
- **Confort** : taille du texte réglable, trois musiques de fond, lecture à voix haute, vibrations pour prier les yeux fermés, aide à la dictée, verrou du carnet par empreinte.
- **Sur Android** : trois widgets (saint et parole du jour, « Mon chapelet », « Mon saint patron ») et des raccourcis sur l'icône.

## Images saintes

L'app peut afficher près de 50 peintures et icônes anciennes (Fra Angelico, le Caravage, Rembrandt, Van Eyck, Van der Weyden, Memling, Rubens, Millet, Chardin, l'icône du Christ du Sinaï…), toutes du **domaine public**. Chacune a sa place : *L'Angélus* de Millet pour l'Angélus, *Le Bénédicité* de Chardin avant le repas, *Le Retour du fils prodigue* pour la miséricorde, les saints patrons, les neuvaines, les retraites…

1. Lance **une fois** `npm run images` (connexion internet nécessaire). Le script cherche chaque œuvre sur Wikimedia Commons, **ne garde que les fichiers marqués domaine public ou CC0**, et les range dans `www/images/` avec leurs crédits (`credits.json`).
2. Vérifie chaque image : le lien vers sa page Commons est dans `credits.json` et dans l'app (Réglages › Images saintes). Si une image ne convient pas, indique le fichier exact dans `scripts/fetch-images.mjs` (champ `file`) et relance.
3. Lance `npm run sync`.

Les images sont ensuite intégrées à l'app : aucune connexion n'est faite pendant la prière. Sans elles, l'app garde ses dessins dorés.

## Liens vers l'Église

L'app renvoie vers les sites de référence plutôt que de recopier leurs textes : AELF (lectures du jour, liturgie des heures, Bible), Nominis (saints du jour), Hozana (prière en communauté), Egliseinfo.be et Messes.info (horaires de messes en Belgique et en France), Cathobel (l'Église en Belgique), le site du Vatican et le Catéchisme de l'Église catholique. Elle mentionne aussi YouPray, une autre app de prière francophone, comme un complément. Chaque référence biblique est cliquable et ouvre le chapitre sur AELF.

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
| `scripts/` | Génération de la version web, des données du widget et téléchargement des images |


## Licences

- **Code** : MIT (voir [LICENSE](LICENSE)).
- **Textes originaux** (méditations, neuvaines rédigées pour l'app) : CC BY-SA 4.0.
- **Bible** : traduction catholique d'Augustin Crampon, édition de 1923 (domaine public), où « Yahweh » est rendu par « le Seigneur », comme le demande l'Église pour la prière. **Prières traditionnelles** (*Notre Père*, *Je vous salue Marie*, *Souvenez-vous*, Angélus, acte de contrition, prière de Léon XIII à saint Joseph…) : domaine public.
- **Polices** : Cinzel, EB Garamond et Jost, sous licence SIL Open Font License.
- **Sons et musiques de fond** (cloche, gong, orgue, nappes) : créés pour l'app par synthèse, placés dans le domaine public (CC0). Aucun chant de louange n'est intégré : l'app ouvre seulement une recherche dans l'application de musique choisie par l'utilisateur.

## Auteur et contact

Manete est créée bénévolement par **Malo B.**

- Une idée, une erreur dans un texte, un saint du jour à corriger : **manete.app@gmail.com**, ou une *issue* sur ce dépôt.
- Dans l'app : Réglages › À propos › « Écrire à l'auteur ».

## Contribuer

Les corrections (textes, calendrier liturgique, traductions) sont les bienvenues par *issue* ou *pull request*.
