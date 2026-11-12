# Publier Manete sur Google Play

Ce guide va du code jusqu'à la publication. Compte environ 3 semaines, dont 14 jours de test obligatoire.

## 1. Outils (une fois)

- **Node.js 20 ou plus** : [nodejs.org](https://nodejs.org)
- **Android Studio** (gratuit) : il installe le JDK et le SDK Android. Le projet cible **Android 16 (API 36)**, le niveau exigé par Google Play depuis le 31 août 2026.
- Dans le dossier du projet : `npm install`

## 2. Compte développeur Google Play (une fois)

1. Va sur [play.google.com/console](https://play.google.com/console) et crée un compte **personnel**. Les frais d'inscription sont de **25 $**, une seule fois.
2. Google vérifie ton identité (pièce d'identité) et te demande un téléphone Android pour valider le compte. Cela prend quelques jours.
3. Ton nom et ton pays apparaîtront sur la fiche de l'app comme développeur.

## 3. Générer l'app signée

1. `npm run android` (il régénère aussi les données du widget) : Android Studio s'ouvre.
2. Menu **Build › Generate Signed App Bundle or APK › Android App Bundle**.
3. Crée une **clé d'envoi** (*upload key*, un fichier `.jks`). **Garde ce fichier et son mot de passe en lieu sûr, hors de GitHub** : sans eux, tu ne peux plus mettre l'app à jour. Le `.gitignore` les exclut déjà.
4. Choisis la variante **release**. Tu obtiens un fichier `app-release.aab`.
5. À chaque nouvelle version, augmente `versionCode` (1, 2, 3…) et `versionName` (1.0.1…) dans `android/app/build.gradle`.

## 4. Créer l'app dans la Play Console

1. **Créer une application** : nom « Manete : prière catholique » (le sous-titre aide à être trouvé), langue par défaut français, application, **gratuite**.
2. **Configurer l'application** (tableau de bord), section par section :
   - **Règles de confidentialité** : l'URL de ta page de confidentialité (voir l'étape 6).
   - **Accès à l'application** : tout est accessible sans identifiant.
   - **Annonces** : non, l'app ne contient pas de publicité.
   - **Classification du contenu** : remplis le questionnaire (catégorie « Référence, actualités ou éducation », aucun contenu sensible).
   - **Public cible** : choisis **13 ans et plus**. Si tu inclus des tranches d'âge enfant, l'app tombe sous le programme « Familles », aux règles plus lourdes. Le mode « En famille » reste utilisable par les parents avec leurs enfants.
   - **Sécurité des données** : « Aucune donnée collectée » et « Aucune donnée partagée ».
   - **Application gouvernementale, financière, santé** : non.
3. **Fiche Play Store** :
   - Nom (30 caractères max), description courte (80) et longue (4 000).
   - Icône 512 × 512 px : redimensionne `assets/icon-only.png`.
   - Image de présentation 1024 × 500 px.
   - **Au moins 2 captures d'écran** de téléphone.
   - Catégorie : **Style de vie** ou **Livres et références**.

## 5. Test fermé obligatoire (compte personnel)

Pour un compte personnel récent, Google exige un **test fermé avec au moins 12 testeurs inscrits pendant 14 jours d'affilée** avant d'autoriser la production.

1. **Tests › Test fermé › Créer un canal**, puis envoie le fichier `.aab`.
2. Ajoute les adresses Gmail de 12 personnes ou plus (famille, amis, paroisse), ou une liste Google Groups.
3. Partage-leur le lien d'inscription : elles acceptent le test, installent l'app et l'ouvrent de temps en temps pendant 14 jours.
4. Ensuite : **Demander l'accès à la production**. Google pose quelques questions sur le test, puis valide en quelques jours.

## 6. Héberger la politique de confidentialité (GitHub Pages)

1. Pousse le dépôt sur GitHub (public).
2. **Settings › Pages › Build and deployment** : source « Deploy from a branch », branche `main`, dossier `/docs`.
3. L'adresse de la politique de confidentialité est `https://<ton-compte>.github.io/<nom-du-depot>/confidentialite.html`. C'est celle à indiquer dans la Play Console. La racine du site est la version web de l'app.

## 7. Production

**Production › Créer une release**, envoie le `.aab`, choisis les pays (Belgique, France, Suisse, Canada, Luxembourg…), puis **Envoyer pour examen**. Le premier examen prend de quelques jours à une semaine.

## Après la publication

- Le lien de la fiche est `https://play.google.com/store/apps/details?id=app.manete.priere`.
- Dans `www/index.html`, passe `APP_LIVE` à `true` : les boutons « Partager » ajoutent alors le lien de la fiche. Tant que l'app n'est pas publiée, ce lien n'est pas ajouté.
- L'identifiant `app.manete.priere` (dans `capacitor.config.json`) **ne peut plus changer** après le premier envoi.
- **Marque** : avant la mise en production, vérifie que « MANETE » est libre dans les registres [EUIPO](https://euipo.europa.eu/eSearch/) et [BOIP](https://www.boip.int/fr), classes 9 et 41.
