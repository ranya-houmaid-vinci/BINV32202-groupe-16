

**Choix** :

J'ai opté pour la possibilité de candidater à nouveau après un retrait. Parcontre, il n'est pas possible de candidater plusieurs fois pour la même offre.

**Résultat** : 

Tout fonctionne comme je le souhaitais.

**Modifications** :

Après lecture du plan j'ai décidé de demander à l'assistant Copilot de procéder à l'implémentation étape par étape pour m'assurer que chaque étape fonctionne correctement.

Les fichiers de code ajoutés pour EF-32/EF-33 sont :

Backend : 

- `application.ts`
- `application.mapper.ts`
- `applications.repository.ts`
- `applications.service.ts`
- `applications.controller.ts`
- `002_application_active_unique.sql`
- `applications.test.ts`
- `applications.http`

Frontend

- `application.ts`
- `applications.service.ts`
- `useApplications.ts`
- `ApplicationsPage.tsx`
- `ApplicationsPage.test.tsx`

Des fichiers existants ont également été modifiés, notamment `App.tsx`, `OfferTable.tsx`, `OffersPage.tsx` et `NavBar.tsx`.


**Validation fonctionelle** :

Les cas testés ainsi que leurs résultats :

1. Connexion de Lucas — connexion réussie avec un token étudiant.

2. Connexion d’Inès — connexion réussie avec un token étudiant.

3. Connexion de Mateusz — connexion réussie avec un token étudiant.

4. Connexion de Marc, contact déposant — connexion réussie avec un token contact.

5. Lucas candidate avec un message à l’offre publiée 5 — `201 Created`, candidature créée avec le statut `IN_PROGRESS`.

6. Lucas candidate sans message à l’offre publiée 7 — `201 Created`, candidature créée avec un message `null`.

7. Lucas recharge ses candidatures — ses deux candidatures et leurs statuts sont retournés.

8. Lucas retire sa candidature en cours — `204 No Content`.

9. Lucas recharge après le retrait — la candidature reste visible avec le statut `WITHDRAWN`.

10. Mateusz tente de retirer une candidature déjà traitée — `409 Conflict`, retrait refusé.

11. Inès candidate à la même offre que Lucas — `201 Created`, candidature indépendante.

12. Inès consulte ses candidatures — elle ne voit que ses propres candidatures.

13. Lucas consulte ses candidatures — il ne voit que ses propres candidatures.

14. Marc, contact déposant, tente de candidater — `403 Forbidden`, rôle insuffisant.

15. Lucas tente de candidater à l’offre non publiée 2 — `409 Conflict`, offre non publiée.

**Tests ajoutés** :

- `backend/tests/applications.test.ts` : tests des routes de consultation, de création et de retrait des candidatures.
- `backend/tests/db/constraints.test.ts` : vérification de l'unicité des candidatures actives et de la possibilité de recandidater après un retrait.
- `backend/tests/db/migrations.test.ts` : vérification de l'application de la migration `002_application_active_unique.sql`.
- `frontend/tests/ApplicationsPage.test.tsx` : affichage des quatre statuts et retrait d'une candidature.
- `frontend/tests/OffersPage.test.tsx` : candidature depuis la liste des offres avec un message.

**Commandes exécutées et résultats** :

- `npm.cmd run lint -w backend` — réussi.
- `npm.cmd run typecheck -w backend` — réussi.
- `npm.cmd run test -w backend -- tests/applications.test.ts tests/db/constraints.test.ts tests/db/migrations.test.ts` — réussi : 3 fichiers de test, 35 tests passés.
- `npm.cmd test -w backend` — réussi : 10 fichiers de test, 124 tests passés.
- `npm.cmd run build -w backend` — réussi.
- `npm.cmd run lint -w frontend` — réussi.
- `npm.cmd run typecheck -w frontend` — réussi.
- `npm.cmd test -w frontend` — réussi : 8 fichiers de test, 51 tests passés.
- `npm.cmd run build -w frontend` — réussi.
- `npm.cmd run check` — réussi : lint, vérification TypeScript, 124 tests backend, 51 tests frontend et builds backend/frontend.
- `git diff --check` — réussi, aucune erreur d'espacement détectée.

**Exemple de comportement couvert par un test** :

Le test « permet de candidater à nouveau après un retrait » crée d'abord une candidature
pour Lucas, la retire avec `DELETE /applications/1`, puis crée une nouvelle candidature
pour la même offre. La nouvelle requête retourne `201 Created`, ce qui vérifie que les
candidatures retirées sont conservées dans l'historique tout en permettant une nouvelle
candidature active.


**Qualité** : 

Les problèmes repérés dans le code :

Je trouve que l'IA complique beaucoup trop l'implémentation des méthodes. Je comprends quand je lis mais ce n'est pas comme ça que je suis habituée à travailler. Donc je dirai que ça me dépasse un petit peu. Cela mériterait une simplification.

**Test et commandes**

Tests ajoutés :

- `backend/tests/applications.test.ts` : tests des routes de consultation, de création et de retrait des candidatures.
- `backend/tests/db/constraints.test.ts` : vérification de l’unicité des candidatures actives et de la possibilité de recandidater après un retrait.
- `backend/tests/db/migrations.test.ts` : vérification de l’application de la migration `002_application_active_unique.sql`.
- `frontend/tests/ApplicationsPage.test.tsx` : affichage des quatre statuts et retrait d’une candidature.
- `frontend/tests/OffersPage.test.tsx` : candidature depuis la liste des offres avec un message.

Commandes exécutées et résultats :

- `npm.cmd run lint -w backend` — réussi.
- `npm.cmd run typecheck -w backend` — réussi.
- `npm.cmd run test -w backend -- tests/applications.test.ts tests/db/constraints.test.ts tests/db/migrations.test.ts` — réussi : 3 fichiers de test, 35 tests passés.
- `npm.cmd test -w backend` — réussi : 10 fichiers de test, 124 tests passés.
- `npm.cmd run build -w backend` — réussi.
- `npm.cmd run lint -w frontend` — réussi.
- `npm.cmd run typecheck -w frontend` — réussi.
- `npm.cmd test -w frontend` — réussi : 8 fichiers de test, 51 tests passés.
- `npm.cmd run build -w frontend` — réussi.
- `npm.cmd run check` — réussi : lint, TypeScript, 124 tests backend, 51 tests frontend et builds backend/frontend.
- `git diff --check` — réussi, aucune erreur d’espacement détectée.

Exemple de comportement couvert par un test :

Le test vérifie qu’un étudiant peut recandidater après avoir retiré sa candidature :

1. Lucas crée une candidature pour une offre publiée.
2. Il retire cette candidature avec `DELETE /applications/1`.
3. Il candidate à nouveau à la même offre.
4. La nouvelle requête retourne `201 Created`.

Cela confirme que l’ancienne candidature reste dans l’historique avec le statut `WITHDRAWN`, tout en permettant une nouvelle candidature active.
