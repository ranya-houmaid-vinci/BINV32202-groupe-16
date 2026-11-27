# Recherche d'offres (EF-30)

## 1. Scénarios

### Fichier

Les scénarios sont décrits dans :

```text
e2e/recherche-offres/scenarios.md
```

### Justification des cas choisis

Deux scénarios complémentaires ont été définis :

**Scénario 1 : recherche avec résultat**

Ce scénario vérifie le fonctionnement normal de la fonctionnalité. Il teste :
- la recherche par titre ;
- la combinaison avec le filtre de période ;
- la gestion des différences de casse (`ReAcT`) ;
- la gestion des espaces superflus dans la recherche.

Il permet de vérifier qu'une offre correspondant aux critères est correctement affichée.

**Scénario 2 : recherche sans résultat**

Ce scénario vérifie le comportement lorsque la recherche ne retourne aucun résultat. Il permet de s'assurer que :
- aucune offre n'est affichée ;
- un message explicite informe l'utilisateur qu'aucune offre ne correspond à sa recherche.

---

## 2. Utilisation du MCP Playwright

### Scénario exécuté

Le scénario n°1 a été exécuté à l'aide du serveur MCP Playwright intégré à VS Code.

### Outils observés

#### Appel 1

Lecture de la page dans le navigateur :

```text
Read Browser
```

Résultat :
- affichage de la page d'accueil ;
- présence du bouton de connexion de démonstration.

#### Appel 2

Clic dans l'interface :

```text
Clicked Connexion démo de Dmytro Kovalenko
```

Résultat :
- connexion de l'utilisateur étudiant Dmytro Kovalenko.

#### Appel 3

Exécution d'actions Playwright :

```javascript
await page.getByLabel('Période').selectOption('P2');
await page.getByLabel('Recherche par titre').fill('  ReAcT  ');
```

Résultat :
- filtre P2 appliqué ;
- recherche effectuée ;
- offre « Application React de gestion de flotte » affichée ;
- aucun message d'absence de résultat affiché.

### Résultat obtenu

Le scénario a été exécuté avec succès. L'offre attendue est apparue dans la liste des résultats.

---

## 3. Playwright Test

### Fichiers créés

```text
e2e/recherche-offres/scenarios.md
e2e/recherche-offres/recherche-offres.spec.ts
```

### Principales assertions

Scénario 1 :

```ts
await expect(
  page.getByText("Application React de gestion de flotte")
).toBeVisible();

await expect(
  page.getByText("Aucune offre ne correspond à votre recherche.")
).toBeHidden();
```

Scénario 2 :

```ts
await expect(
  page.locator(".data-table tbody tr")
).toHaveCount(0);

await expect(
  page.getByText("Aucune offre ne correspond à votre recherche.")
).toBeVisible();
```

### Résultat des deux exécutions

#### Première exécution

La première exécution a échoué à cause d'une erreur dans le fichier généré automatiquement. L'URL utilisée dans `page.goto()` était incorrecte.

Résultat :

```text
2 tests échoués
```

#### Deuxième exécution

Après correction du fichier de test :

```text
2 tests réussis
```

### Résultat de npm run check

La commande :

```bash
npm run check
```

s'est terminée avec succès.

Les vérifications exécutées sont :
- linting ;
- vérification de typage TypeScript ;
- tests backend ;
- tests frontend ;
- build backend ;
- build frontend.

Résultats :

```text
Backend : 127 tests réussis
Frontend : 53 tests réussis
Build : réussi
```

### Vérification de l'intégration des tests E2E

Après analyse du script :

```bash
npm run check
```

les tests E2E Playwright ne sont pas inclus dans les contrôles existants. Ils ont donc été exécutés explicitement avec :

```bash
npx playwright test
```

---

## 4. Vérification

### Défaut temporaire introduit

Afin de vérifier la capacité des tests à détecter une anomalie, un défaut a été observé dans le fichier de test généré : l'URL utilisée dans `page.goto()` était incorrecte.

### Échec constaté

Lors de l'exécution :

```text
page.goto(...)
ERR_CONNECTION_REFUSED
```

Les deux tests ont échoué.

### Restauration

Après correction de l'URL et du contenu du test, les scénarios ont été relancés.

### Résultat final

Les deux tests Playwright se sont exécutés avec succès.

---

## 5. Comparaison

### 1. Que permet Playwright MCP dans la conversation avec l'agent ? Quelle action précise avez-vous vu passer par un outil MCP ?

Playwright MCP permet à l'agent d'interagir directement avec l'application via un navigateur réel depuis la conversation. L'agent peut lire le contenu des pages, cliquer sur des éléments, remplir des formulaires et vérifier les résultats obtenus.

Une action observée pendant l'exécution a été :

```text
Clicked Connexion démo de Dmytro Kovalenko in Browser
```

Cette action a permis de connecter automatiquement l'utilisateur de démonstration. Nous avons également observé l'exécution d'actions Playwright telles que :

```javascript
await page.getByLabel('Période').selectOption('P2');
await page.getByLabel('Recherche par titre').fill('  ReAcT  ');
```

qui ont permis d'exécuter le scénario directement dans l'application.

### 2. Qu’apportent les scripts Playwright Test que le compte rendu d’un test par MCP n’apporte pas ?

Le compte rendu MCP montre qu'un scénario a fonctionné à un instant donné lors d'une exécution manuelle guidée par l'agent.

Les scripts Playwright Test apportent plusieurs avantages supplémentaires :

- ils sont réutilisables et peuvent être exécutés autant de fois que nécessaire ;
- ils permettent de vérifier automatiquement les régressions après une modification du code ;
- ils peuvent être intégrés dans une chaîne d'intégration continue (CI/CD) ;
- ils produisent des résultats reproductibles sans intervention humaine ;
- ils utilisent des assertions formelles (`expect`) qui valident automatiquement le comportement attendu.

Ainsi, MCP est surtout utile pour l'exploration et la validation d'un scénario, tandis que Playwright Test permet son automatisation durable.

### 3. Dans quel cas préféreriez-vous une exploration interactive avec MCP ? Dans quel cas préféreriez-vous un test automatisé ?

Je privilégierais MCP lors de la découverte d'une fonctionnalité ou de la préparation d'un nouveau scénario de test. L'exploration interactive permet de comprendre rapidement le comportement de l'application, d'identifier les sélecteurs et de vérifier manuellement le déroulement d'un cas d'utilisation.

Je privilégierais Playwright Test lorsqu'un scénario est stabilisé et doit être rejoué régulièrement. Les tests automatisés sont particulièrement adaptés aux vérifications de non-régression, aux tests exécutés avant chaque livraison et aux contrôles intégrés dans un pipeline d'intégration continue.

En pratique, les deux approches sont complémentaires : MCP facilite l'exploration et la création des scénarios, tandis que Playwright Test permet de les automatiser et de les maintenir dans le temps.