# Plan EF-32 / EF-33 — candidatures étudiantes

## Problème et approche

Le schéma contient déjà `applications` et les statuts attendus, ainsi que des données de démonstration couvrant les cas « en cours », « retenue », « non retenue » et « retirée ». En revanche, aucun service, route ou écran ne permet encore à l'étudiant de créer, retirer ou consulter ses candidatures.

L'implémentation proposée conserve les offres publiées comme point d'entrée de la candidature et ajoute une page dédiée aux candidatures de l'étudiant. Les règles métier restent contrôlées côté backend, avec une contrainte d'intégrité adaptée pour empêcher deux candidatures actives pour un même couple étudiant/offre tout en autorisant une nouvelle candidature après retrait.

## Trois étapes

### 1. Modèle de données, règles métier et API backend

- Ajouter une migration numérotée pour garantir l'unicité d'une candidature non retirée par étudiant et par offre, sans modifier `001_initial.sql`.
- Ajouter les modèles, mappers, repository et service des candidatures.
- Exposer les routes protégées pour :
  - lister les candidatures de l'étudiant connecté ;
  - candidater à une offre publiée avec message facultatif ;
  - retirer sa candidature uniquement lorsqu'elle est `IN_PROGRESS`.
- Vérifier l'authentification, le rôle étudiant, l'existence de l'offre, le statut `PUBLISHED`, les doublons actifs et les transitions de statut.
- Mettre à jour [backend/API.md](../../backend/API.md) et ajouter les exemples REST concernés dans [backend/http/](../../backend/http/).

Fichiers principalement concernés :
`backend/src/db/migrations/002_*.sql`, `backend/src/models/application.ts`, `backend/src/mappers/application.mapper.ts`, `backend/src/repositories/applications.repository.ts`, `backend/src/services/applications.service.ts`, `backend/src/controllers/applications.controller.ts`, `backend/src/app.ts`, `backend/src/services/permissions.ts`, `backend/tests/applications.test.ts`, `backend/tests/db/constraints.test.ts`, `backend/tests/db/migrations.test.ts`.

Vérifications et tests :

- réponses JSON et erreurs `{ error: { code, message } }` ;
- accès refusé aux non-étudiants ;
- candidature refusée sur offre non publiée ;
- message absent, vide ou trop long selon la décision métier ;
- double candidature refusée tant que la précédente n'est pas retirée ;
- retrait impossible après traitement et nouvelle candidature possible après retrait ;
- isolation stricte entre étudiants.

### 2. Interface étudiant et intégration à la liste des offres

- Étendre les modèles, gardes, services et hooks frontend pour les candidatures.
- Ajouter un bouton « Candidater » dans la liste des offres publiées, avec formulaire/modal pour le message facultatif et confirmation d'envoi.
- Masquer ou remplacer l'action selon l'état de la candidature connue ; ne pas considérer le contrôle frontend comme une sécurité.
- Ajouter une page « Mes candidatures » affichant l'offre, l'entreprise, la période, le message éventuel, la date et les libellés français « En cours », « Retenue », « Non retenue », « Retirée ».
- Permettre le retrait seulement pour « En cours », puis rafraîchir la liste et l'état de l'offre.
- Ajouter la navigation et la route dans [frontend/src/App.tsx](../../frontend/src/App.tsx) et [frontend/src/components/NavBar.tsx](../../frontend/src/components/NavBar.tsx).

Fichiers principalement concernés :
`frontend/src/models/application.ts`, `frontend/src/services/applications.service.ts`, `frontend/src/hooks/useApplications.ts`, `frontend/src/components/OfferTable.tsx`, `frontend/src/pages/OffersPage.tsx`, `frontend/src/pages/ApplicationsPage.tsx`, `frontend/src/utils/guards.ts`, `frontend/src/utils/labels.ts`, `frontend/src/utils/permissions.ts`, `frontend/src/App.tsx`, `frontend/src/components/NavBar.tsx`, `frontend/src/index.css`.

Vérifications et tests :

- tests de services/hooks avec fetch mock et gestion 401 ;
- test de rendu de la liste des offres et du bouton/modal ;
- test d'affichage des quatre statuts en français ;
- test du retrait et de la disparition/actualisation de l'action ;
- test de navigation étudiant et absence du lien/action pour les autres profils.

### 3. Démonstration, documentation et validation transverse

- Ajuster les fixtures de démonstration seulement si nécessaire pour rendre le parcours reproductible avec les étudiants existants : candidature en cours, candidature retirée réinscriptible et statuts traités.
- Vérifier que les connexions de démonstration utilisent bien les étudiants déjà présents et que les offres publiées de la liste restent la source de candidature.
- Mettre à jour la documentation de parcours et la traçabilité EF-32/EF-33 si le dépôt les maintient.
- Exécuter les tests backend/frontend ciblés, puis `npm run check` si les tests ciblés sont concluants.

Fichiers principalement concernés :
`backend/src/db/seed/offersData.ts`, `backend/src/db/seed/seedIds.ts`, `backend/tests/db/seed.test.ts`, `frontend/tests/OffersPage.test.tsx`, `frontend/tests/ApplicationsPage.test.tsx`, `frontend/tests/App.test.tsx`, `docs/architecture.md`, `docs/cdc_gesta_developpement.md` si une traçabilité d'implémentation est attendue.

Vérifications et tests :

- migration appliquée sur une base vide et sur la base de test ;
- seed idempotent et cohérent avec les statuts ;
- tests ciblés backend/frontend ;
- `npm run lint`, `npm run typecheck`, `npm test` et `npm run build` via `npm run check`.

## Décisions métier confirmées

1. **Message facultatif** : espaces supprimés, maximum 1000 caractères ; un message vide est traité comme absent (`null`).
2. **Offre non publiée** : une création est possible uniquement lorsque l'offre est `PUBLISHED`. Le retrait est possible uniquement lorsque la candidature est `IN_PROGRESS`.
3. **Candidature retirée** : elle reste visible dans « Mes candidatures », y compris dans l'historique ; la liste ne sera pas limitée à l'année courante.
4. **Réinscription après retrait** : on conserve la ligne retirée et on crée une nouvelle candidature. La contrainte porte donc sur les candidatures non retirées, pas sur le couple étudiant/offre au sens absolu.
5. **Candidature traitée** : l'offre, le message, la date et le statut restent visibles après traitement.
6. **Action dans la liste** : le bouton « Candidater » est placé directement dans la liste des offres et ouvre la saisie du message.
