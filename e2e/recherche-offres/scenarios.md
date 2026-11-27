# Scénarios E2E — Recherche d’offres

## Scénario 1 — Recherche avec résultat et filtre par période

### État initial
- La base contient les données de démonstration.
- L’utilisateur connecté est Dmytro Kovalenko, étudiant.
- L’offre « Application React de gestion de flotte » est publiée pour 2026-2027 en période P2.

### Actions dans l’interface
1. Ouvrir la page des offres.
2. Choisir la période P2.
3. Saisir ` ReAcT ` dans le champ de recherche, avec une majuscule différente et des espaces avant et après.

### Résultat attendu
- « Application React de gestion de flotte » apparaît dans les résultats.
- Les offres dont le titre ne correspond pas à la recherche ne sont pas affichées.
- Aucun message d’absence de résultat n’apparaît.

## Scénario 2 — Recherche sans résultat

### État initial
- La base contient les données de démonstration.
- L’utilisateur connecté est Dmytro Kovalenko, étudiant.
- Aucun titre d’offre ne contient `e2e-aucun-resultat-9x7`.

### Actions dans l’interface
1. Ouvrir la page des offres.
2. Saisir `e2e-aucun-resultat-9x7` dans le champ de recherche.

### Résultat attendu
- Aucune offre n’est affichée.
- Le message « Aucune offre ne correspond à votre recherche. » apparaît.