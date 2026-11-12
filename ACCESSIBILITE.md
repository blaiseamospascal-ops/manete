# Ergonomie et accessibilité de Manete

*Évaluation du 12 novembre 2026. Référentiels : WCAG 2.2 niveau AA, heuristiques de Nielsen, ISO 9241-110 (principes de dialogue) et ISO 9241-11 (utilisabilité).*

## Méthode

- **Audit automatique** avec axe-core 4.10 (règles WCAG 2.0, 2.1 et 2.2, niveaux A et AA) sur 27 écrans, dans les 7 couleurs de fond : **0 règle en échec**.
- **Tests scriptés** au clavier : focus, touche Échap, confirmations, taille des cibles, texte agrandi à 200 %.
- **Revue experte** écran par écran selon Nielsen et ISO 9241-110.

Un audit automatique ne détecte qu'une partie des problèmes. Ce document n'est pas une certification.

## WCAG 2.2 : ce qui a été vérifié ou corrigé

| Critère | État |
|---|---|
| 1.1.1 Contenu non textuel | Les dessins sont décoratifs et masqués aux lecteurs d'écran. Le sens est dans le texte voisin. Les cierges d'une neuvaine annoncent « 3 jours priés sur 9 ». |
| 1.3.1 Structure | Un titre principal par écran, champs étiquetés, interrupteurs avec leur rôle et leur état. |
| 1.4.1 Couleur | Un choix sélectionné se distingue aussi par la graisse et un contour. Une médaille non obtenue a un bord en pointillés. |
| 1.4.3 Contraste du texte | Conforme dans les 7 fonds, y compris le fond clair. |
| 1.4.4 Agrandissement | Tailles en unités relatives. Pas de défilement horizontal à 200 %. |
| 1.4.11 Contraste des contours | Champs et boutons : contour à 3:1 au moins. |
| 2.1.1 Clavier | Tout est utilisable au clavier. |
| 2.2.2 Mouvement | Réglages › Affichage › « Réduire les animations ». Le réglage du système est aussi respecté. |
| 2.4.3 et 2.4.11 Focus | Pendant une prière, le fond est inactif et le focus suit le bouton principal. Le focus n'est pas caché par la barre du bas. |
| 2.4.7 Focus visible | Contour doré sur tous les éléments. |
| 2.5.8 Taille des cibles | Toutes les cibles font au moins 24 × 24 px (32 px pour les liens courts). |
| 3.1.1 Langue | Page déclarée en français. |
| 3.3.1 à 3.3.4 Erreurs | Messages en clair. Confirmation avant de supprimer, de restaurer, de remettre à zéro ou de quitter une prière. |
| 4.1.2 et 4.1.3 Nom, rôle, messages | Les messages brefs et les étapes de prière sont annoncés. |

## Heuristiques de Nielsen et ISO 9241-110

| Heuristique (principe ISO) | Ce que fait l'app |
|---|---|
| Visibilité de l'état (caractère auto-descriptif) | Chrono, barre d'étapes, grains du chapelet, cierges, message après chaque action. |
| Langage de l'utilisateur (conformité aux attentes) | Vocabulaire de la prière. « XP » a été remplacé par « points ». |
| Contrôle et liberté (contrôlabilité) | Bouton Retour à chaque étape, sortie par ✕ ou Échap, musique coupable à tout moment. |
| Cohérence | Mêmes boutons aux mêmes endroits dans toutes les prières. |
| Prévention des erreurs (robustesse) | Confirmations. Quitter après la fin d'une prière ne la compte plus deux fois (bogue corrigé). |
| Reconnaître plutôt que se rappeler | Tuiles avec description et durée. La neuvaine indique le jour à prier. |
| Souplesse | Durée au choix, texte du chapelet masquable, points masquables, sept fonds. |
| Sobriété | Une action principale par écran de prière. |
| Messages d'erreur | Ils disent quoi corriger (« Il faut 9 jours… »). |
| Aide (apprentissage) | Réglages › « Comment ça marche ». |
| Engagement (ISO 9241-110) | Cierges, médailles et jour de grâce, sans culpabiliser. |

## Limites connues

- **Mode silence** : le texte s'assombrit volontairement (les yeux sont fermés). Un toucher ou Échap le fait réapparaître. C'est un écart assumé au critère 1.4.3.
- **Passages en latin** : seuls la devise et le nom sont marqués comme latins (critère 3.1.2). Les prières latines des bénédicités ne le sont pas encore.
- **Lecteur d'écran** : non testé avec TalkBack sur un vrai téléphone.
- **ISO 9241-11** (efficacité, efficience, satisfaction) : ces mesures demandent des tests avec de vrais utilisateurs. Le test fermé Google Play (12 testeurs) est l'occasion de les faire.
