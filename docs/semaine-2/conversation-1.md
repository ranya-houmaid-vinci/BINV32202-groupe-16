# Conversation — semaine 2


## 1. Analyse et planification

**Moi**

> Examine le code et le schéma existant. Propose ses 3 étapes en indiquant les fichiers
> concernés, les vérifications et les tests envisagés et de signaler les décisions métier
> à clarifier :
>
> EF-32 : un étudiant candidate à une offre publiée, avec un message facultatif. Il peut
> retirer sa candidature tant qu’elle n’a pas été traitée.
>
> EF-33 : l’étudiant consulte ses candidatures et leur statut : « En cours », « Retenue »,
> « Non retenue » ou « Retirée ».
>
> Utilise la liste des offres et les connexions de démonstration existantes. Le bouton
> « Candidater » peut être placé dans cette liste.
>
> Il n'est pas possible de candidater plusieurs fois pour la même offre, par contre il est
> possible de candidater à nouveau après un retrait.

**Assistant**

Le code existant contient déjà :

- la table `applications` et les quatre statuts attendus ;
- les offres publiées visibles par les étudiants ;
- les utilisateurs et candidatures de démonstration ;
- la liste frontend des offres et les connexions de démonstration.

Les routes, services, écrans et tests de candidature n'étaient cependant pas encore
implémentés.

Le plan proposé comportait trois étapes :

1. **Backend/API**
   - ajouter une migration garantissant une seule candidature active par étudiant et par
     offre ;
   - ajouter modèles, mapper, repository, service, contrôleur et tests ;
   - exposer `GET /applications`, `POST /applications` et `DELETE /applications/:id` ;
   - documenter l'API et les exemples REST.

2. **Frontend**
   - ajouter modèles, services, hook et gardes ;
   - placer « Candidater » dans la liste des offres ;
   - ajouter la saisie du message facultatif ;
   - ajouter la page « Mes candidatures » ;
   - afficher les quatre statuts et permettre le retrait.

3. **Validation**
   - vérifier les données de démonstration ;
   - mettre à jour la documentation ;
   - exécuter les tests ciblés puis `npm run check`.

Les décisions métier clarifiées ont été les suivantes :

- message trimé, limité à 1000 caractères, vide traité comme absent ;
- candidature possible uniquement sur une offre `PUBLISHED` ;
- retrait possible uniquement pour une candidature `IN_PROGRESS` ;
- candidatures retirées conservées dans l'historique ;
- nouvelle ligne créée après un retrait ;
- toutes les candidatures restent visibles ;
- offre, message, date et statut restent visibles après traitement ;
- bouton directement dans la liste des offres.

## 2. Implémentation du backend

**Moi**

> Commence avec l'implémentation de l'étape 1 (backend).

**Assistant**

L'étape backend a été implémentée avec :

- [002_application_active_unique.sql](../../backend/src/db/migrations/002_application_active_unique.sql) ;
- les modèles et mapper de candidature ;
- le repository des candidatures ;
- le service métier des candidatures ;
- le contrôleur Express ;
- l'intégration dans `app.ts` ;
- la recherche d'offre par identifiant ;
- la documentation de [API.md](../../backend/API.md) ;
- les scénarios REST dans [applications.http](../../backend/http/applications.http) ;
- les tests API et les tests de contraintes/migrations.

Les règles côté serveur sont :

- seuls les étudiants peuvent gérer des candidatures ;
- une offre doit être publiée ;
- le message est facultatif et limité à 1000 caractères ;
- une candidature active en double est refusée ;
- une candidature traitée ne peut pas être retirée ;
- une candidature retirée permet une nouvelle candidature.

Vérifications réalisées :

- 124 tests backend passés ;
- lint backend passé ;
- typecheck backend passé ;
- build backend passé.

## 3. Implémentation du frontend

**Moi**

> Tu peux passer à l'étape 2.

**Assistant**

L'étape frontend a été implémentée avec :

- [application.ts](../../frontend/src/models/application.ts) ;
- [applications.service.ts](../../frontend/src/services/applications.service.ts) ;
- [useApplications.ts](../../frontend/src/hooks/useApplications.ts) ;
- [ApplicationsPage.tsx](../../frontend/src/pages/ApplicationsPage.tsx) ;
- l'intégration du bouton et du formulaire dans [OfferTable.tsx](../../frontend/src/components/OfferTable.tsx) ;
- la route `/candidatures` dans `App.tsx` ;
- la navigation étudiant ;
- les libellés français et les permissions d'affichage ;
- les styles et les tests frontend.

Les tests vérifient notamment :

- l'affichage des quatre statuts ;
- le retrait d'une candidature ;
- la candidature depuis la liste des offres ;
- la gestion des réponses API.

Vérifications réalisées :

- 51 tests frontend passés ;
- lint frontend passé ;
- typecheck frontend passé ;
- build frontend passé.

## 4. Conflits frontend

**Moi**

> Pourquoi y'a-t-il des conflits dans le frontend ?

**Assistant**

Il n'y avait pas de conflit de fusion actif dans le dépôt :

- `git ls-files -u` ne retournait rien ;
- aucun marqueur `<<<<<<<`, `=======`, `>>>>>>>` n'était présent ;
- les fichiers frontend étaient simplement modifiés localement et non commités.

Les conflits pouvaient apparaître lors d'un `pull`, d'une fusion ou d'une PR, parce que
plusieurs fichiers frontend déjà présents sur la branche cible avaient été modifiés :
`OfferTable.tsx`, `OffersPage.tsx`, `App.tsx` et `NavBar.tsx`.

La cause probable était donc un chevauchement entre les modifications locales et les
changements d'une autre branche, et non une erreur TypeScript ou JSX.

## 5. Message de commit frontend

**Moi**

> Que puis-je mettre dans le message du commit pour tout le frontend que tu viens de créer ?

**Assistant**

Message proposé :

```text
feat(frontend): add student applications workflow

- add application models, services and hooks
- add candidature form to published offers
- add student applications page with status display
- support application withdrawal
- update student navigation, labels and permissions
- add frontend tests for applications
```

Version courte :

```text
feat(frontend): add student applications workflow
```

## 6. Validation transverse

**Moi**

> Parfait maintenant on passe à l'étape suivante du plan.

**Assistant**

L'étape 3 a été réalisée :

- documentation de l'architecture des candidatures dans [architecture.md](../architecture.md) ;
- mise à jour du [README.md](../../README.md) ;
- vérification de la cohérence avec les données de démonstration ;
- exécution de `npm run check`.

Résultats de `npm run check` :

- lint backend/frontend passé ;
- typecheck backend/frontend passé ;
- 124 tests backend passés ;
- 51 tests frontend passés ;
- build backend/frontend passé ;
- `git diff --check` sans erreur.

Le plan EF-32/EF-33 a alors été considéré comme terminé.

## 7. Scénarios HTTP

**Moi**

> Peux-tu créer des tests HTTP qui couvrent ces cas-là :
>
> — candidature à une offre publiée, avec et sans message ;
> — présence de la candidature et de son statut après rechargement ;
> — retrait d’une candidature encore en cours ;
> — impossibilité de retirer une candidature déjà traitée ;
> — séparation des candidatures de deux étudiants différents.
>
> Vérifiez aussi les refus : un autre rôle ne peut pas candidater et une offre non publiée
> n’accepte pas de candidature. Les contrôles doivent exister côté serveur.

**Assistant**

Le fichier [applications.http](../../backend/http/applications.http) a été enrichi avec
des scénarios REST Client séquencés :

- connexion de Lucas, Inès, Mateusz et d'un contact déposant ;
- candidature de Lucas avec message ;
- candidature de Lucas sans message ;
- rechargement de la liste de candidatures et vérification des statuts ;
- retrait d'une candidature en cours ;
- tentative de retrait d'une candidature traitée ;
- candidature d'Inès sur la même offre pour vérifier l'isolation ;
- rechargement séparé des candidatures de Lucas et d'Inès ;
- refus d'une candidature faite par un contact ;
- refus d'une candidature sur une offre non publiée.

Les contrôles restent réalisés côté serveur dans les routes et services backend.
Pour rejouer les scénarios depuis un état propre :

```bash
npm run db:reset
```

Puis les requêtes peuvent être exécutées dans REST Client dans l'ordre.

## 8. État final

Les exigences EF-32 et EF-33 sont couvertes par :

- le schéma et la migration d'unicité des candidatures actives ;
- l'API backend et ses contrôles de rôle/statut ;
- l'interface étudiant ;
- les données de démonstration ;
- les tests automatisés backend et frontend ;
- les scénarios HTTP manuels ;
- la documentation technique et utilisateur.