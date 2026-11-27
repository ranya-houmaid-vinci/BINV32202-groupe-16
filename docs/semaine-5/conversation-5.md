# Conversation du 27 novembre 2026

## Analyse de la recherche d'offres EF-30

**Utilisateur**

> Analyse le projet et retrouve l'implémentation de la recherche d'offres (EF-30).
>
> Explique :
> - quelle page frontend permet d'effectuer la recherche
> - quels champs sont utilisés pour rechercher
> - quelles sont les règles métier appliquées
> - quelles données d'exemple existent déjà dans le projet
>
> Ensuite propose deux scénarios E2E conformes aux consignes :
> - scénario 1 : cas nominal avec résultat
> - scénario 2 : cas limite sans résultat
>
> Pour chaque scénario indique :
> - état initial
> - rôle utilisateur
> - données nécessaires
> - actions dans l'interface
> - résultat attendu observable

**Assistant**

### Implémentation actuelle

La recherche se fait dans `OffersPage.tsx`. Elle propose :

- un champ « Recherche par titre » ;
- un filtre « Période » : toutes, P1, P2 ou Autre.

Le mot-clé est envoyé au backend comme paramètre `q`. Le repository cherche une
correspondance partielle, sans distinction de casse, uniquement dans le titre. Le filtre
de période est combiné à cette recherche. Côté étudiant, le serveur ne retourne que les
offres publiées.

Écart relevé avec EF-30 : l'exigence demande également un filtre par entreprise et localité
et limite le catalogue à l'année académique en cours. Ces filtres ne sont pas présents dans
l'interface actuelle, et le backend n'applique pas explicitement le filtre d'année courante.
L'implémentation couvre donc la recherche par titre et la période, mais pas entièrement
EF-30.

### Données d'exemple

Le seed contient quatre offres publiées pour l'année 2026-2027 visibles par un étudiant :

- « Application React de gestion de flotte » — Lumen Digital, P2 ;
- « API REST de facturation » — Orbis, P2 ;
- « Tableau de bord de qualité des données » — Lumen Data, P2 ;
- « Assistant conversationnel interne » — Nexalis, P2.

Les entreprises ont aussi une localité en base, par exemple Orbis à Liège et Lumen Digital
à Louvain-la-Neuve, mais la recherche actuelle ne l'utilise pas.

### Scénario E2E 1 — recherche avec résultat

- **État initial :** application démarrée avec les données de démonstration ; l'offre
  « API REST de facturation » est publiée.
- **Rôle utilisateur :** étudiant, par exemple Lucas Dupont.
- **Données nécessaires :** offre publiée « API REST de facturation », période P2,
  année 2026-2027.
- **Actions :** se connecter comme Lucas, ouvrir Offres, saisir `api rest` dans
  « Recherche par titre ».
- **Résultat attendu :** une offre s'affiche, « API REST de facturation », Orbis, période
  P2, statut « Publiée ».

### Scénario E2E 2 — recherche sans résultat

- **État initial :** mêmes données de démonstration ; aucun titre ne contient le texte
  saisi.
- **Rôle utilisateur :** étudiant, par exemple Lucas Dupont.
- **Données nécessaires :** aucune donnée supplémentaire.
- **Actions :** se connecter comme Lucas, ouvrir Offres, saisir
  `stage en photographie sous-marine` dans « Recherche par titre ».
- **Résultat attendu :** aucun résultat et le message
  « Aucune offre ne correspond à votre recherche. »

Ces scénarios couvrent le comportement actuellement implémenté. Des scénarios pour les
filtres entreprise/localité nécessiteraient leur ajout conformément à EF-30.

## Vérification de l'application avec Playwright MCP

**Utilisateur**

> Utilise le serveur MCP Playwright configuré.
>
> Vérifie que l'application est accessible localement.
> Détermine automatiquement l'URL du frontend.
> Ouvre la page d'accueil et indique si Playwright MCP fonctionne correctement.

**Assistant**

Le frontend était accessible sur `http://localhost:5173` et répondait avec HTTP 200.
La page d'accueil affichait le titre Gesta, l'écran « Connexion de démonstration » et les
utilisateurs de démonstration. Playwright MCP a ouvert la page et lu son contenu :
il fonctionnait correctement.

## Scénario E2E avec résultat

**Utilisateur**

> Utilise Playwright MCP pour exécuter le scénario E2E suivant :
>
> 1. Ouvrir l'application.
> 2. Se connecter comme étudiant Dmytro Kovalenko.
> 3. Ouvrir la page Offres.
> 4. Sélectionner la période P2.
> 5. Rechercher "ReAcT" avec des espaces avant et après.
> 6. Vérifier que l'offre "Application React de gestion de flotte" est affichée.
> 7. Vérifier qu'aucun message "Aucune offre ne correspond à votre recherche" n'est visible.
>
> Décris toutes les actions réalisées et les sélecteurs utilisés.

**Assistant**

Scénario exécuté avec Playwright MCP sur `http://localhost:5173` — réussi.

Sélecteurs et actions :

1. Connexion avec `getByRole('button', { name: 'Dmytro Kovalenko' })`.
2. Navigation avec `getByRole('link', { name: 'Offres' })`.
3. Sélection P2 avec `getByLabel('Période').selectOption('P2')`.
4. Recherche avec
   `getByLabel('Recherche par titre').fill('  ReAcT  ')`.
5. Vérification du résultat avec
   `getByText('Application React de gestion de flotte', { exact: true })`.
6. Vérification de l'absence du message de non-résultat avec
   `getByText('Aucune offre ne correspond à votre recherche.', { exact: true })`.

Résultat : une offre affichée et aucun message d'absence de résultat.

## Création du premier test Playwright

**Utilisateur**

> Génère un test Playwright TypeScript pour le scénario E2E validé.
>
> Contexte :
> - URL frontend : http://localhost:5173
> - Utiliser les sélecteurs découverts pendant l'exécution MCP.
> - Utiliser les bonnes pratiques Playwright.
> - Utiliser expect() pour toutes les vérifications.
>
> Scénario :
> 1. Connexion avec Dmytro Kovalenko.
> 2. Ouvrir Offres.
> 3. Sélectionner la période P2.
> 4. Saisir "  ReAcT  ".
> 5. Vérifier que "Application React de gestion de flotte" est visible.
> 6. Vérifier que "Aucune offre ne correspond à votre recherche." n'est pas visible.
>
> Créer un fichier complet recherche-offres.spec.ts prêt à être exécuté.

**Assistant**

Un premier fichier `recherche-offres.spec.ts` a été créé avec le test suivant :

```typescript
import { expect, test } from "@playwright/test";

test("un étudiant trouve une offre publiée en recherchant par titre et période", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("button", { name: "Dmytro Kovalenko" }).click();
  await page.getByRole("link", { name: "Offres" }).click();
  await expect(page).toHaveURL(/\/offres$/);

  await page.getByLabel("Période").selectOption("P2");
  await page.getByLabel("Recherche par titre").fill("  ReAcT  ");

  await expect(
    page.getByText("Application React de gestion de flotte", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Aucune offre ne correspond à votre recherche.", { exact: true }),
  ).toBeHidden();
});
```

Le dépôt ne contenait alors pas la dépendance `@playwright/test`. Le test était écrit au
format Playwright Test, mais il fallait installer ce runner pour l'exécuter avec
`npx playwright test`.

## Scénario E2E sans résultat avec Playwright MCP

**Utilisateur**

> Utilise Playwright MCP pour exécuter le scénario suivant :
>
> 1. Connexion avec Dmytro Kovalenko.
> 2. Ouvrir Offres.
> 3. Saisir "e2e-aucun-resultat-9x7".
> 4. Vérifier qu'aucune offre n'est affichée.
> 5. Vérifier que le message "Aucune offre ne correspond à votre recherche." est visible.
>
> Indique les sélecteurs réellement utilisés.

**Assistant**

Scénario exécuté avec Playwright MCP — réussi.

Sélecteurs utilisés :

1. `getByRole('button', { name: 'Changer d’utilisateur' })` pour repartir de l'écran
   de connexion.
2. `getByRole('button', { name: 'Dmytro Kovalenko' })` pour la connexion démo.
3. `getByRole('link', { name: 'Offres' })` pour ouvrir les offres.
4. `getByLabel('Recherche par titre')` pour saisir
   `e2e-aucun-resultat-9x7`.
5. `locator('.data-table tbody tr')` pour vérifier qu'il y avait 0 ligne d'offre.
6. `getByText('Aucune offre ne correspond à votre recherche.', { exact: true })`
   pour vérifier le message.

Résultat : aucune offre affichée et message attendu visible.

## Ajout du deuxième test

**Utilisateur**

> Ajoute au fichier recherche-offres.spec.ts un deuxième test Playwright correspondant au
> scénario "aucun résultat".

**Assistant**

Un deuxième test autonome a été ajouté dans
`e2e/recherche-offres.spec.ts`. Il ouvre l'application, se connecte comme Dmytro, va sur
Offres, saisit `e2e-aucun-resultat-9x7`, vérifie qu'il n'y a aucune ligne avec
`.data-table tbody tr` et confirme la visibilité du message de non-résultat.

Le diff a passé `git diff --check`. Le test n'a pas été exécuté avec Playwright Test car
`@playwright/test` n'était pas installé ; le comportement E2E a toutefois été vérifié avec
Playwright MCP.

## Recherche de la configuration Playwright

**Utilisateur**

> Ouvre le fichier : playwright.config.ts

**Assistant**

Aucun fichier `playwright.config.ts` n'a été trouvé dans le dépôt ; il n'y avait donc pas
de configuration Playwright à ouvrir.

## Vérification de la syntaxe du test

**Utilisateur**

> Corrige le fichier e2e/recherche-offres/recherche-offres.spec.ts.
>
> Supprime toutes les balises HTML injectées dans :
> - page.goto(...)
> - toHaveURL(...)
>
> Les valeurs correctes sont :
> `await page.goto("http://localhost:5173");`
> `await expect(page).toHaveURL(/\/offres$/);`
>
> Ne modifie rien d'autre.

**Assistant**

La lecture du fichier montrait déjà les deux formes demandées, sans balises HTML. Aucun
changement n'a été fait.

## Exécution de `npm run check`

**Utilisateur**

> Lance la commande npm run check et colle-moi le résultat.

**Assistant**

La commande `npm run check` s'est terminée avec succès (code de sortie 0). Résultat :

```text
> check
> npm run lint && npm run typecheck && npm run test && npm run build

> lint
> npm run lint --workspaces

> lint
> oxlint --deny-warnings

> lint
> oxlint --deny-warnings

> typecheck
> npm run typecheck --workspaces

> typecheck
> tsc --noEmit

> typecheck
> tsc -b

> test
> npm run test --workspaces

> test
> vitest run

RUN  v5.0.5 C:/IA/projet_s05/BINV32202-groupe-16/backend

Test Files  10 passed (10)
Tests       127 passed (127)
Start at    18:17:00
Duration    2.80s (import 42%, transform 31%, tests 23%, setup 2%, worker 2%)

> test
> vitest run

RUN  v5.0.5 C:/IA/projet_s05/BINV32202-groupe-16/frontend

Test Files  8 passed (8)
Tests       53 passed (53)
Start at    18:17:04
Duration    7.62s (environment 66%, setup 15%, tests 10%, transform 7%, import 2%)

> build
> npm run build --workspaces

> build
> tsc -p tsconfig.build.json && node scripts/copyMigrations.js

> build
> tsc -b && vite build

vite v8.3.4 building client environment for production...
transforming...
✓ 60 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-DdKIYs0N.css    3.45 kB │ gzip:  1.10 kB
dist/assets/index-BOy3W-Z7.js   276.49 kB │ gzip: 87.09 kB

✓ built in 377ms
```