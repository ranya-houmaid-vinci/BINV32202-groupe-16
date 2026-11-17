# Bilan — Semaine 4 : skills, tests et hooks

## Inventaire

| Type | Mécanisme | Fichier / outil | Rôle | Exemple concret | Vérifié pendant la séance |
|---|---|---|---|---|---|
| Guide (feedforward) | Skill Test Gap Audit | `.github/skills/test-gap-audit/SKILL.md`, `scripts/coverage_map.py` | Aide à repérer les cas de test manquants ou les assertions faibles sans modifier les fichiers | Audit des tests de candidatures EF-32 et EF-33 | Oui |
| Guide (feedforward) | Skill Test-Driven Development | `.github/skills/test-driven-development/SKILL.md` | Demande de proposer et exécuter des tests avant de modifier le code, puis d’attendre une validation | Recherche de mots-clés EF-30 | Oui |
| Guide (feedforward) | Instructions du dépôt | `.github/copilot-instructions.md` | Demande à Copilot d’appliquer le skill TDD pour les fonctionnalités et corrections | Déclenchement du processus tests d’abord | Oui |
| Hook (contrôle avant outil) | Tool Guardian | `.github/hooks/tool-guardian.json`, `guard-tool.cjs` | Intercepte certains appels d’outils avant leur exécution | Refus de suppression de `demo-protected.txt` | Oui |
| Senseur (feedback) | Tests et contrôle du projet | Vitest, `npm run check` | Vérifie les comportements, le typage, le lint et les builds | Tests de recherche d’offres | Tests réussis selon mon retour; résultat de `npm run check` à préciser ci-dessous |

## Couverture des exigences EF-32 et EF-33

| Cas à vérifier | Test existant et assertion utile | Manque confirmé ou constat écarté |
|---|---|---|
| Deux candidatures actives pour la même offre | `applications.test.ts` vérifie `409 APPLICATION_EXISTS`; retrait puis nouvelle candidature acceptée en `201`; `database.test.ts` couvre l’unicité | Constat écarté : le comportement et la contrainte sont testés |
| Candidature à une offre non publiée | `applications.test.ts` vérifie `409 OFFER_NOT_PUBLISHED` | Constat écarté pour l’offre non publiée |
| Candidature à une offre inexistante | Aucun test explicite trouvé dans l’audit | Manque confirmé dans l’audit : test proposé pour vérifier `404 NOT_FOUND` |
| Administrateur ou contact qui dépose une candidature | Le test existant couvre le refus d’accès d’un administrateur à la consultation (`403`), mais pas ces rôles sur toutes les opérations | Manque confirmé dans l’audit : préciser les rôles/opérations effectivement vérifiés et le test ajouté, le cas échéant |
| Un étudiant consulte ou retire la candidature d’un autre étudiant | L’audit indique que le dépôt filtre par `studentId`, mais aucun test explicite d’isolation entre deux étudiants n’a été trouvé | Manque confirmé dans l’audit : préciser le test ajouté ou amélioré, le cas échéant |

**Test ajouté ou amélioré à la suite de l’audit :** [indiquer le fichier, le scénario et le résultat; si aucun test d’audit n’a été ajouté, le préciser et expliquer pourquoi].

## Modifications et vérification

L’audit a porté sur les tests EF-32 et EF-33, et non sur une revue générale du code. J’ai conservé les constats dans le tableau ci-dessus.

Pour la recherche EF-30, les tests ont été présentés avant l’implémentation. Avant le changement, les nouveaux tests échouaient parce que la recherche n’était pas encore implémentée : 3 échecs backend sur 19 tests et 2 échecs frontend sur 9. Aucun fichier de production n’avait alors été modifié. J’ai validé le lot de tests, puis Copilot a implémenté la recherche. **Mon avis sur les tests proposés :** ils couvraient [à préciser : casse, espaces, filtre de période, visibilité, absence de résultat, etc.] et les échecs initiaux correspondaient à la fonctionnalité manquante.

**Résultats après implémentation :** tous les tests ont réussi, selon mon retour. `npm run check` : [indiquer le résultat exact et confirmer que cette commande a bien été lancée après l’implémentation].

**Essais manuels dans le navigateur :** [indiquer les cas réellement essayés : recherche avec casse différente, espaces en début/fin, champ vide, aucun résultat, combinaison avec la période, visibilité étudiant].

**Problèmes restants :** [aucun / préciser]. La recherche approximative et le traitement particulier des accents étaient hors périmètre.

## Audit des guides et contrôles

| Attente de la fiche | Guide ou mécanisme examiné | Correspondance observée | Limite ou remarque |
|---|---|---|---|
| Auditer les tests sans modifier les fichiers | `test-gap-audit` | Le skill a été installé et utilisé sur EF-32/EF-33 | Les constats devaient être vérifiés dans les tests avant de retenir un manque |
| Voir les tests échouer avant l’implémentation et attendre l’accord | Skill TDD et `.github/copilot-instructions.md` | Copilot a présenté le lot; les nouveaux tests échouaient avant le code et j’ai donné mon accord | Le cycle est à documenter avec les résultats observés avant et après |
| Bloquer un appel de suppression ciblé avant exécution | Hook Tool Guardian, événement `preToolUse` | `git status` a suivi les permissions habituelles; la suppression de `demo-protected.txt` a été refusée par Tool Guardian | Copilot a indiqué que le fichier était conservé; ajouter la confirmation par `Test-Path` si elle a été faite. Le hook ne protège pas toutes les formes possibles de suppression |

## Conversations et remise

Les conversations Copilot de la séance sont exportées en Markdown dans : [indiquer les chemins exacts]. J’ai relu les changements, puis [indiquer le résultat du commit, du push et de la Pull Request].