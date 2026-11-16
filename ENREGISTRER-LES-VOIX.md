# Enregistrer les voix des prières

Dans chaque prière, le bouton **▶ Écouter** lit le texte avec la voix de synthèse du téléphone. Si une vraie voix est enregistrée pour une prière, l'app la joue à la place, et garde la synthèse pour le reste (titres, méditations).

On peut mettre **plusieurs voix** (un homme, une femme, un enfant…). Dès qu'une voix existe, un choix « Voix des prières » apparaît dans Réglages › Sons, avec aussi « Voix du téléphone ».

## 1. Où mettre les fichiers

```
www/sounds/prieres/voix.json
www/sounds/prieres/<voix>/<prière>.mp3
```

Exemple avec deux voix, « malo » et « claire » :

```
www/sounds/prieres/malo/ave.mp3
www/sounds/prieres/malo/pater.mp3
www/sounds/prieres/claire/ave.mp3
```

Le nom du dossier de la voix : lettres minuscules sans accent, chiffres ou tirets (`malo`, `claire`, `enfant-1`).

## 2. Déclarer les voix dans `voix.json`

```json
{
  "voix": [
    { "id": "malo", "nom": "Malo", "prieres": ["ave", "pater", "gloria", "credo", "fatima", "salve"] },
    { "id": "claire", "nom": "Claire", "prieres": ["ave", "pater", "gloria"] }
  ]
}
```

- `id` : le nom du dossier.
- `nom` : ce qui s'affiche dans les réglages.
- `prieres` : uniquement les fichiers qui existent vraiment. Une prière absente est lue par la voix du téléphone.
- La première voix de la liste est celle utilisée par défaut.

Ensuite : `npm.cmd run sync`, puis reconstruire l'APK. Pour le site, `node scripts/build-web.mjs` copie aussi les voix dans `docs/`.

## 3. Conseils d'enregistrement

- Une pièce calme, sans écho (une chambre avec rideaux et lit est idéale), téléphone à 20 cm de la bouche, légèrement de côté.
- Lire **lentement et posément**, comme on prie à voix haute à l'église. Une seconde de silence au début et à la fin, pas plus.
- Lire **exactement le texte ci-dessous** : l'app reconnaît la prière affichée à l'écran et joue le fichier correspondant.
- Format : **MP3, mono, 64 à 96 kbit/s**. Audacity (gratuit) suffit : couper les silences, *Effets › Normaliser* à −1 dB, *Fichier › Exporter en MP3*.
- Un fichier par prière, avec exactement le nom indiqué (`ave.mp3`, `complies-kyrie.mp3`…).
- Pour commencer : `ave`, `pater`, `gloria` couvrent déjà presque tout le chapelet. Puis `credo`, `fatima`, `salve`.

## 4. Accord des personnes et licence

- Chaque personne enregistrée donne son accord écrit (un message suffit) pour que sa voix soit publiée dans une app libre. Pour un enfant : l'accord des parents.
- Les enregistrements sont publiés avec l'app, sous licence **CC BY-SA 4.0** (ou CC0 si la personne préfère). L'indiquer dans le README, rubrique crédits.

## 5. Les textes à lire

### `pater.mp3` · Notre Père
*Utilisé : chapelet, prière guidée.*

>Notre Père, qui es aux cieux,  
>que ton nom soit sanctifié,  
>que ton règne vienne,  
>que ta volonté soit faite  
>sur la terre comme au ciel.  
>Donne-nous aujourd'hui notre pain de ce jour.  
>Pardonne-nous nos offenses,  
>comme nous pardonnons aussi  
>à ceux qui nous ont offensés.  
>Et ne nous laisse pas entrer en tentation,  
>mais délivre-nous du Mal.  
>Amen.

### `ave.mp3` · Je vous salue Marie
*Utilisé : chapelet (le plus important : 53 fois par chapelet).*

>Je vous salue, Marie, pleine de grâce,  
>le Seigneur est avec vous.  
>Vous êtes bénie entre toutes les femmes,  
>et Jésus, le fruit de vos entrailles, est béni.  
>Sainte Marie, Mère de Dieu,  
>priez pour nous, pauvres pécheurs,  
>maintenant et à l'heure de notre mort.  
>Amen.

### `gloria.mp3` · Gloire au Père
*Utilisé : chapelet, complies, psaumes.*

>Gloire au Père, et au Fils, et au Saint-Esprit,  
>comme il était au commencement,  
>maintenant et toujours,  
>pour les siècles des siècles.  
>Amen.

### `credo.mp3` · Je crois en Dieu
*Utilisé : début du chapelet.*

>Je crois en Dieu, le Père tout-puissant, créateur du ciel et de la terre.  
>Et en Jésus-Christ, son Fils unique, notre Seigneur, qui a été conçu du Saint-Esprit, est né de la Vierge Marie, a souffert sous Ponce Pilate, a été crucifié, est mort et a été enseveli, est descendu aux enfers, le troisième jour est ressuscité des morts, est monté aux cieux, est assis à la droite de Dieu le Père tout-puissant, d'où il viendra juger les vivants et les morts.  
>Je crois en l'Esprit Saint, à la sainte Église catholique, à la communion des saints, à la rémission des péchés, à la résurrection de la chair, à la vie éternelle. Amen.

### `fatima.mp3` · Prière de Fatima
*Utilisé : après chaque dizaine.*

>Ô mon Jésus, pardonnez-nous nos péchés, préservez-nous du feu de l'enfer, et conduisez au ciel toutes les âmes, surtout celles qui ont le plus besoin de votre miséricorde.

### `salve.mp3` · Salve Regina
*Utilisé : fin du chapelet, complies hors temps pascal.*

>Salut, ô Reine, Mère de miséricorde, notre vie, notre douceur, notre espérance, salut !  
>Enfants d'Ève, exilés, nous crions vers vous ; vers vous nous soupirons, gémissant et pleurant dans cette vallée de larmes.  
>Ô vous, notre avocate, tournez vers nous vos regards miséricordieux. Et, après cet exil, montrez-nous Jésus, le fruit béni de vos entrailles.  
>Ô clémente, ô miséricordieuse, ô douce Vierge Marie.

### `regina.mp3` · Regina Caeli
*Utilisé : complies au temps pascal.*

>Reine du ciel, réjouis-toi, alléluia !  
>Car celui que tu as mérité de porter, alléluia,  
>est ressuscité comme il l'avait dit, alléluia !  
>Prie Dieu pour nous, alléluia !  
>
>℣. Sois heureuse et réjouis-toi, Vierge Marie, alléluia !  
>℟. Car le Seigneur est vraiment ressuscité, alléluia !  
>
>Prions. Dieu qui as réjoui le monde par la résurrection de ton Fils, notre Seigneur Jésus-Christ, accorde-nous, par l'intercession de la Vierge Marie, sa Mère, de goûter les joies de la vie éternelle. Par le Christ, notre Seigneur. Amen.

### `ps4.mp3` · Psaume 4
*Utilisé : complies.*

>Quand je crie, réponds-moi, Dieu de ma justice !  
>Quand je suis dans la détresse, sauve-moi !  
>Aie pitié de moi, écoute ma prière !  
>Tremblez, et ne péchez point ;  
>parlez en vos cœurs sur votre couche, puis taisez-vous.  
>Plusieurs disent : Qui nous fera voir le bonheur ?  
>Fais lever sur nous la lumière de ta face, Seigneur !  
>Tu mets dans mon cœur plus de joie  
>qu'ils n'en ont quand abondent leur froment et leur moût.  
>Je me couche et je m'endors en paix,  
>car toi seul, Seigneur, tu me donnes la sécurité dans ma demeure. (Ps 4, extraits)

### `ps134.mp3` · Psaume 134
*Utilisé : complies.*

>Voici, bénissez le Seigneur, vous tous, serviteurs du Seigneur,  
>qui vous tenez dans la maison du Seigneur pendant les nuits !  
>Élevez vos mains vers le sanctuaire, et bénissez le Seigneur !  
>Que le Seigneur te bénisse de Sion,  
>lui qui a fait les cieux et la terre ! (Ps 134)

### `nunc.mp3` · Cantique de Syméon
*Utilisé : complies.*

>Maintenant, ô Maître, vous laissez partir votre serviteur  
>en paix, selon votre parole ;  
>puisque mes yeux ont vu votre salut,  
>que vous avez préparé à la face de tous les peuples :  
>lumière qui doit dissiper les ténèbres des nations  
>et gloire d'Israël, votre peuple. (Lc 2,29-32)

### `complies-ouverture.mp3` · Ouverture des complies
*Utilisé : complies, étape 1 (avec le Gloire au Père).*

>Dieu, viens à mon aide.  
>Seigneur, à notre secours.  
>
>Gloire au Père, et au Fils, et au Saint-Esprit,  
>comme il était au commencement,  
>maintenant et toujours,  
>pour les siècles des siècles.  
>Amen.

### `complies-kyrie.mp3` · Seigneur, prends pitié
*Utilisé : complies, étape 2.*

>Seigneur, prends pitié.  
>Ô Christ, prends pitié.  
>Seigneur, prends pitié.

### `complies-repons.mp3` · Répons
*Utilisé : complies, étape 4 (dire aussi « Psaume 31, verset 6 » ou s'arrêter avant).*

>Entre tes mains je remets mon esprit ;  
>tu me délivreras, Seigneur, Dieu de vérité !  
>(Ps 31,6)

### `complies-benediction.mp3` · Bénédiction
*Utilisé : complies, étape 6.*

>Que le Seigneur tout-puissant  
>nous accorde une nuit tranquille  
>et une fin parfaite. Amen.

