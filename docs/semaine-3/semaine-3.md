

## Inventaire : 


                   | **Guide — feedforward**                            | **Senseur — feedback**                                    |
                   |----------------------------------------------------|-----------------------------------------------------------|
**Inférentiel**    | `.github/copilot-instructions.md`, `AGENTS.md`,    | revue de code par une IA, vérification de la cohérence
                   | cahier des charges et documentation d'architecture | avec les exigences et les conventions
-------------------------------------------------------------------------------------------------------------------------------------
**Computationnel** |  GitHub Copilot comme générateur de code, guidé    | `npm run check` : tests Vitest/Supertest/Testing Library,
                   |  par TypeScript, les scripts npm et l'architecture | compilateur TypeScript, Oxlint et builds backend/frontend
                   |  existante                                         | 


## Couverture des exigences EF-32 et EF-33 :

| Exigence | Cas à vérifier | Test existant (fichier et nom) | Assertions utiles | Couverture |
|-----------|-----------|-----------|-----------|-----------|
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