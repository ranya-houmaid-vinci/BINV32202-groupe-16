# Conversation — semaine 3

## 10 novembre 2026

**Utilisateur**

> Mets le plan dans le dossier semaine-2.

**Assistant**

Le plan EF-32 / EF-33 a été ajouté dans `docs/semaine-2/plan.md`, avec les liens
adaptés à son nouvel emplacement.

**Utilisateur**

> Prends connaissance du fichier AGENTS.md pour les prochaines modifications qu'on va faire.

**Assistant**

Le fichier `frontend/AGENTS.md` a été lu et ses règles seront suivies pour les prochaines
modifications, notamment :

- utiliser `npm run check` avant de terminer une modification ;
- conserver l'architecture `controllers → services → repositories → SQLite` ;
- valider les réponses API avec les type guards frontend ;
- utiliser `HttpError` et le format d'erreur documenté ;
- ajouter une migration plutôt que modifier une migration existante ;
- mettre à jour les tests et la documentation lors des changements d'API ou de schéma ;
- utiliser les identifiants de `seedIds.ts` dans les tests ;
- ne jamais considérer le mode démo comme une authentification réelle.

## 12 novembre 2026

**Utilisateur**

> Quels sont les guides (feedforward) inférentiels donc interprétés par une IA de ce projet ?

**Assistant**

Les principaux guides inférentiels sont :

- `.github/copilot-instructions.md` ;
- `frontend/AGENTS.md` ;
- `docs/architecture.md` ;
- `backend/API.md` ;
- `docs/cdc_gesta_developpement.md` ;
- `docs/seed.md` ;
- `.github/pull_request_template.md` pour les pull requests.

Ces documents orientent l'interprétation des besoins, l'architecture, les conventions,
les règles métier, les API et les pratiques de test.

**Utilisateur**

> Quels sont les senseurs (feedback) inférentiels ? Ex. : revue de code par une IA ?

**Assistant**

Les principaux senseurs inférentiels sont :

- revue de code par une IA ;
- analyse des changements ;
- recherche de bugs et d'incohérences ;
- vérification de la cohérence avec les exigences métier ;
- vérification du respect des conventions et de l'architecture.

**Utilisateur**

> Quels sont les guides (feedforward) computationnels ? Ex. : générateur de code.

**Assistant**

Les principaux guides computationnels sont :

- GitHub Copilot dans VS Code comme générateur de code ;
- TypeScript et les interfaces du projet ;
- les scripts npm ;
- l'architecture existante ;
- les migrations SQL ;
- les exemples de code, hooks, services, repositories et tests déjà présents ;
- la documentation métier et technique utilisée pour guider l'implémentation.

**Utilisateur**

> Et les senseurs (feedback) computationnels ? Ex. : tests, compilateur, linter.

**Assistant**

Les principaux senseurs computationnels sont :

- les tests backend Vitest et Supertest ;
- les tests frontend Vitest et Testing Library ;
- le compilateur TypeScript ;
- le linter Oxlint ;
- les builds backend et frontend ;
- la commande globale `npm run check` ;
- les contraintes SQLite ;
- les scénarios REST Client ;
- les vérifications Git comme `git diff --check`.

**Utilisateur**

> Peux-tu créer une matrice 2x2 avec ce que tu viens de me dire dans le fichier semaine-3.md, en prenant les plus importants à chaque fois ?

**Assistant**

Une matrice 2×2 a été créée dans `docs/semaine-3/semaine-3.md`, avec les catégories
suivantes :

- guide — feedforward ;
- senseur — feedback ;
- inférentiel ;
- computationnel.

**Utilisateur**

> Quelque chose de ce style-là.

Une capture d'écran a été fournie comme modèle visuel, avec une matrice présentant les
colonnes « Guide — feedforward » et « Senseur — feedback », et les lignes
« Inférentiel » et « Computationnel ».

**Assistant**

La matrice a été reformattée pour suivre ce modèle.

**Utilisateur**

> Mais remplis avec les informations que tu m'as données, pas celles dans la capture d'écran.

**Assistant**

La matrice de `docs/semaine-3/semaine-3.md` a été remplie avec les informations du
projet :

- `.github/copilot-instructions.md`, `AGENTS.md`, le cahier des charges et
  la documentation d'architecture comme guides inférentiels ;
- GitHub Copilot, TypeScript, les scripts npm et l'architecture existante comme guides
  computationnels ;
- la revue de code par une IA comme senseur inférentiel ;
- `npm run check`, les tests, TypeScript, Oxlint et les builds comme senseurs
  computationnels.