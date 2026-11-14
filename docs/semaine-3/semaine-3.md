
## Inventaire

| Type | Mécanisme | Fichier / outil | Rôle | Exemple concret | Vérifié pendant la séance |
|------|-----------|-----------------|------|-----------------|---------------------------|
| Guide (feedforward) inférentiel | AGENTS.md | AGENTS.md | Définit les conventions et l'architecture du projet | Architecture controllers -> services -> repositories -> SQLite | Oui |
| Guide (feedforward) inférentiel | Documentation projet | docs/architecture.md, backend/API.md, docs/cdc_gesta_developpement.md, docs/seed.md | Décrit l'architecture, les API et les règles métier | EF-32 et EF-33 concernant les candidatures | Oui |
| Guide (feedforward) computationnel | GitHub Copilot | VS Code / GitHub Copilot | Génère du code à partir du contexte du projet | Proposition automatique d'un contrôleur ou d'un test | Oui |
| Guide (feedforward) computationnel | TypeScript et scripts npm | TypeScript, package.json | Guident l'implémentation par les types et les commandes disponibles | Vérification des types et commandes de validation | Oui |
| Senseur (feedback) inférentiel | Revue de code par IA | GitHub Copilot Chat | Analyse le code et signale des incohérences | Vérification du respect du cahier des charges | Oui |
| Senseur (feedback) computationnel | npm run check | Vitest, Supertest, Testing Library, Oxlint, TypeScript, build | Vérifie automatiquement la qualité du projet | Détection d'erreurs de tests, de typage ou de compilation | Oui |


## Couverture des exigences EF-32 et EF-33 :

| Exigence | Cas à vérifier | Test existant (fichier et nom) | Assertions utiles | Couverture |
|----------|----------------|--------------------------------|-------------------|------------|
| EF-32 | Un étudiant peut candidater à une offre publiée avec un message | applications.test.ts - "crée une candidature sur une offre publiée et normalise le message" | Status 201, offre créée, message normalisé, statut IN_PROGRESS | Couvert |
| EF-32 | Un étudiant peut candidater sans message | applications.test.ts - "accepte une candidature sans message" | Status 201, message = null | Couvert |
| EF-32 | Une deuxième candidature active pour la même offre est refusée | applications.test.ts - "refuse une deuxième candidature active pour la même offre" | Status 409, erreur APPLICATION_EXISTS | Couvert |
| EF-32 | Une offre non publiée ne peut pas accepter de candidature | applications.test.ts - "refuse une offre non publiée" | Status 409, erreur OFFER_NOT_PUBLISHED | Couvert |
| EF-32 | Le corps de la requête est validé | applications.test.ts - "valide le message et l'identifiant de l'offre" | Status 400, erreur INVALID_BODY | Couvert |
| EF-32 | Un étudiant peut retirer une candidature en cours | applications.test.ts - "retire une candidature en cours" | Status 204, statut devenu WITHDRAWN après consultation | Couvert |
| EF-32 | Un étudiant peut candidater à nouveau après un retrait | applications.test.ts - "permet de candidater à nouveau après un retrait" | Retrait puis nouvelle candidature acceptée (201) | Couvert |
| EF-32 | Une candidature déjà traitée ne peut plus être retirée | applications.test.ts - "refuse le retrait d'une candidature déjà traitée" | Status 409, erreur APPLICATION_ALREADY_PROCESSED | Couvert |
| EF-32 | Plusieurs candidatures retirées sont autorisées mais une seule candidature active existe par étudiant et par offre | database.test.ts - "autorise plusieurs candidatures historiques retirées mais pas deux candidatures actives" | Vérification de la contrainte UNIQUE | Couvert |
| EF-32 | Un administrateur ne peut pas candidater | Aucun test trouvé | Aucun | Absent |
| EF-32 | Un contact d'entreprise ne peut pas candidater | Aucun test trouvé | Aucun | Absent |
| EF-32 | Un étudiant ne peut pas retirer la candidature d'un autre étudiant | Aucun test trouvé | Aucun | Absent |
| EF-32 | Une candidature vers une offre inexistante est refusée | Aucun test trouvé | Aucun | Absent |
| EF-33 | Un étudiant peut consulter ses candidatures | applications.test.ts - "liste toutes les candidatures de l'étudiant avec les statuts stockés" | Status 200, liste retournée, statut vérifié | Couvert |
| EF-33 | Les statuts des candidatures sont correctement renvoyés | applications.test.ts - "liste toutes les candidatures de l'étudiant avec les statuts stockés" | Vérification du statut IN_PROGRESS | Couvert |
| EF-33 | Les informations de l'offre associée sont visibles | applications.test.ts - "liste toutes les candidatures de l'étudiant avec les statuts stockés" | Vérification de l'identifiant, du titre et de l'entreprise | Couvert |
| EF-33 | Un administrateur ne peut pas consulter les candidatures d'un étudiant | applications.test.ts - "refuse l'accès à un administrateur" | Status 403 | Couvert |
| EF-33 | Un étudiant ne voit que ses propres candidatures | Aucun test explicite trouvé | Aucun | Partiel |
| EF-33 | Les candidatures de deux étudiants différents sont séparées | Aucun test explicite trouvé | Aucun | Partiel |


## Modifications et vérification

Aucun test supplémentaire n'a été ajouté pendant cette séance.

L'analyse a consisté à examiner les tests existants et à établir leur correspondance avec les exigences EF-32 et EF-33.

Les commandes exécutées :
- npm test
- npm run check

Résultats observés :
- Les tests existants sont exécutés avec succès.
- Les contrôles TypeScript, lint et build sont inclus dans la commande npm run check.

Limites :
- Certains cas de sécurité ne sont pas couverts par les tests existants, notamment l'interdiction pour un administrateur ou un contact de déposer une candidature.
- La séparation explicite des candidatures entre plusieurs étudiants n'est pas démontrée par un test dédié.


## Audit des guides

### Références Web 2 utilisées

Les points de comparaison proviennent des conventions vues en Web 2 concernant :
- l'architecture en couches ;
- la séparation des responsabilités ;
- la validation des entrées ;
- la sécurité ;
- les tests automatisés ;
- la documentation et la maintenabilité du code.

### Tableau de comparaison

| Attente ou convention de Web 2 (source) | Guide examiné (fichier et passage) | Correspondance | Écart ou ajout proposé |
|-----------------------------------------|------------------------------------|----------------|------------------------|
| Séparer les couches de l'application (présentation, métier, accès aux données) | AGENTS.md : « controllers -> services -> repositories -> SQLite » | Oui | Aucun écart constaté |
| Éviter de mélanger la logique métier et la logique HTTP | AGENTS.md : « Les contrôleurs gèrent HTTP et validation d'entrée ; les services portent les règles métier » | Oui | Aucun |
| Centraliser les règles métier dans des services dédiés | AGENTS.md : « les services portent les règles métier » | Oui | Aucun |
| Limiter l'accès direct à la base de données | AGENTS.md : « les repositories contiennent le SQL » | Oui | Aucun |
| Valider les entrées utilisateur côté serveur | AGENTS.md : « Les contrôleurs gèrent HTTP et validation d'entrée » | Oui | Le guide pourrait mentionner explicitement la validation de tous les paramètres de requête et du corps des requêtes |
| Ne jamais faire confiance aux contrôles du frontend pour la sécurité | AGENTS.md : « never rely on frontend role checks for security » | Oui | Aucun |
| Contrôler les permissions côté backend | AGENTS.md : « Enforce permissions in the backend » | Oui | Aucun |
| Utiliser un format cohérent pour les erreurs | AGENTS.md : « { error: { code, message } } » | Oui | Aucun |
| Maintenir la cohérence entre le code et la documentation de l'API | AGENTS.md : mise à jour obligatoire de API.md lors d'un changement d'API | Oui | Aucun |
| Prévoir des tests automatisés | AGENTS.md : utilisation de Vitest, Supertest et Testing Library | Oui | Aucun |
| Exécuter les vérifications avant l'intégration du code | AGENTS.md : exécution de npm run check | Oui | Aucun |
| Respecter la structure du projet et les conventions de nommage | AGENTS.md : description détaillée de l'architecture backend et frontend | Oui | Aucun |
| Prévoir des règles d'accessibilité frontend | Aucun passage identifié | Non | Ajouter des recommandations sur l'accessibilité (HTML sémantique, labels de formulaires, contraste, navigation clavier) |
| Prévoir des recommandations de sécurité applicative générales | Quelques consignes présentes sur l'authentification | Partielle | Ajouter des règles concernant la validation des données, la gestion des secrets et la protection contre les erreurs de configuration |