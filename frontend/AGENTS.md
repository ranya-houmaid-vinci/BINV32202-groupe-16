# Instructions pour les agents

## Structure du projet

- Le dépôt est un monorepo npm avec deux workspaces : `backend/` et `frontend/`.
- Le backend est une API Express en TypeScript avec SQLite et `better-sqlite3`.
- Le frontend est une application React/Vite en TypeScript.
- La description détaillée des couches et des flux se trouve dans [docs/architecture.md](docs/architecture.md).
- Les routes et formats JSON sont documentés dans [backend/API.md](backend/API.md).
- Le cahier des charges métier est dans [docs/cdc_gesta_developpement.md](docs/cdc_gesta_developpement.md).
- Les données fictives et identifiants de test sont décrits dans [docs/seed.md](docs/seed.md).

## Commandes

Lancer les commandes depuis la racine du dépôt :

```bash
npm ci
npm run setup
npm run dev
```

Avant de terminer une modification de code, utiliser de préférence :

```bash
npm run check
```

Cette commande exécute le lint, le typecheck, tous les tests et le build. Les commandes
ciblées sont `npm run lint`, `npm run typecheck`, `npm test` et `npm run build`.

Node.js 22.14 ou plus récent est requis. Le serveur API écoute sur le port 3000 par défaut
et le frontend sur le port 5173. Le port backend se règle avec `API_PORT`, pas `PORT`.

## Frontend et backend

- Le frontend appelle l'API avec le préfixe `/api`; le proxy Vite retire ce préfixe avant de transmettre la requête au backend.
- Les pages assemblent les hooks et composants ; les hooks appellent les services HTTP ; les services valident les JSON avec les type guards de `frontend/src/utils/guards.ts`.
- `useAuth` doit rester appelé une seule fois dans `frontend/src/App.tsx`. Le token et la déconnexion sont transmis aux pages par props.
- Les routes backend suivent `controllers -> services -> repositories -> SQLite`.
- Les contrôleurs gèrent HTTP et validation d'entrée ; les services portent les règles métier ; les repositories contiennent le SQL.
- Utiliser les mappers pour séparer les lignes SQL, modèles métier et DTO publics. Ne pas exposer directement les DBO par l'API.
- Les erreurs API doivent utiliser `HttpError` et conserver le format `{ "error": { "code", "message" } }`.
- Le token est envoyé tel quel dans `Authorization`, sans préfixe `Bearer`.

## Base de données

- Les migrations sont des fichiers SQL dans `backend/src/db/migrations/`, appliqués une seule fois dans l'ordre de leur nom. Ajouter une nouvelle migration plutôt que modifier une migration déjà appliquée.
- La base locale est `backend/data/gesta.db` et n'est pas la base des tests.
- Les tests backend utilisent SQLite en mémoire, avec migrations et seed via `backend/tests/helpers/testDatabase.ts`.
- Les données de démonstration sont dans `backend/src/db/seed/`. Utiliser les constantes de `seedIds.ts` dans les tests au lieu de nombres magiques.
- `npm run db:reset` supprime puis recrée la base locale. Sous Windows, arrêter d'abord `npm run dev` pour libérer le fichier SQLite.

## Authentification et mode démo

- Le mode démo est réservé au développement local ; il ne doit pas être activé avec `NODE_ENV=production`.
- Le token ne contient que `kind` et `id`. Les rôles, le statut du compte et les entreprises sont relus en base à chaque requête.
- Une session invalide renvoie 401 ; un utilisateur authentifié sans permission renvoie 403.
- Ne jamais traiter le mode démo comme une authentification réelle.

## Tests

- Backend : Vitest + Supertest, avec application Express et base SQLite en mémoire.
- Frontend : Vitest + Testing Library, avec `fetch` simulé par `frontend/tests/helpers/fetchMock.ts`.
- Lors d'un changement d'API, mettre à jour les tests backend et frontend concernés ainsi que [backend/API.md](backend/API.md).
- Lors d'un changement de schéma, ajouter ou adapter les tests de migrations, contraintes ou seed concernés.

## Limites actuelles

L'application implémente surtout la connexion démo, la navigation par profil, la consultation des
entreprises et la lecture des offres. Les écritures métier comme la création d'offres, les candidatures,
la gestion des stages et les exports ne sont pas encore disponibles ; ne pas les documenter comme
fonctionnelles sans implémentation correspondante.