# 📋 Product Backlog - Smart Café Mobile

> **Phase 2 de la BMad Method**: Planning
> **Méthodologie de priorisation**: MoSCoW (Must / Should / Could / Won't)
> **Date**: 20 janvier 2026

---

## 🎯 Méthode MoSCoW

| Priorité | Signification | Allocation | MVP |
|----------|---------------|------------|-----|
| **Must Have** | Fonctionnalités critiques sans lesquelles l'app n'a pas de valeur | 60% | ✅ OUI |
| **Should Have** | Fonctionnalités importantes mais pas bloquantes | 20% | ⚠️ Si temps |
| **Could Have** | Fonctionnalités "nice-to-have" améliorant l'UX | 15% | ❌ Phase 2 |
| **Won't Have** | Fonctionnalités hors scope pour cette version | 5% | ❌ Future |

---

## ✅ MUST HAVE (MVP - Priorité P0)

### Epic 1: Authentification & Sécurité
| ID | User Story | Story Points | Dépendances | Statut |
|----|-----------|--------------|-------------|--------|
| **US-1.1** | En tant que nouveau client, je veux créer un compte avec mon email afin de pouvoir passer des commandes | 5 | Backend /auth/register | 📝 TODO |
| **US-1.2** | En tant qu'utilisateur existant, je veux me connecter avec mes identifiants | 3 | Backend /auth/login | 📝 TODO |
| **US-1.3** | En tant qu'utilisateur, je veux demander une réinitialisation de mot de passe | 3 | Backend /auth/forgot-password | 📝 TODO |
| **US-1.4** | En tant qu'utilisateur connecté, je veux que mon token soit automatiquement rafraîchi | 2 | Backend /auth/refresh | 📝 TODO |

**Total Epic 1**: 13 points

---

### Epic 2: Catalogue Produits
| ID | User Story | Story Points | Dépendances | Statut |
|----|-----------|--------------|-------------|--------|
| **US-2.1** | En tant que client, je veux consulter le menu par catégorie | 5 | Backend /products | 📝 TODO |
| **US-2.2** | En tant que client, je veux rechercher un produit par nom | 3 | US-2.1 | 📝 TODO |
| **US-2.3** | En tant que client, je veux voir les détails d'un produit (photo, description, prix, allergènes) | 5 | Backend /products/:id | 📝 TODO |
| **US-2.4** | En tant que client, je veux voir les options de personnalisation (taille, lait, extras) | 3 | US-2.3 | 📝 TODO |
| **US-2.5** | En tant que client, je veux voir si un produit est indisponible | 2 | Backend (field available) | 📝 TODO |

**Total Epic 2**: 18 points

---

### Epic 3: Panier
| ID | User Story | Story Points | Dépendances | Statut |
|----|-----------|--------------|-------------|--------|
| **US-3.1** | En tant que client, je veux ajouter un produit à mon panier avec options | 5 | US-2.4 | 📝 TODO |
| **US-3.2** | En tant que client, je veux voir le contenu de mon panier | 3 | US-3.1 | 📝 TODO |
| **US-3.3** | En tant que client, je veux modifier la quantité d'un produit dans le panier | 3 | US-3.2 | 📝 TODO |
| **US-3.4** | En tant que client, je veux supprimer un produit du panier | 2 | US-3.2 | 📝 TODO |
| **US-3.5** | En tant que client, je veux que mon panier soit persisté localement | 3 | - | 📝 TODO |
| **US-3.6** | En tant que client, je veux voir le calcul du total (subtotal + taxes + frais) | 3 | US-3.2 | 📝 TODO |

**Total Epic 3**: 19 points

---

### Epic 4: Commande & Paiement
| ID | User Story | Story Points | Dépendances | Statut |
|----|-----------|--------------|-------------|--------|
| **US-4.1** | En tant que client, je veux valider mon panier pour passer commande | 3 | US-3.6 | 📝 TODO |
| **US-4.2** | En tant que client, je veux choisir le type de commande (sur place / à emporter / livraison) | 3 | US-4.1 | 📝 TODO |
| **US-4.3** | En tant que client, je veux saisir une adresse de livraison si applicable | 3 | US-4.2 | 📝 TODO |
| **US-4.4** | En tant que client, je veux payer ma commande par carte bancaire (Stripe) | 8 | Backend /orders, Stripe SDK | 📝 TODO |
| **US-4.5** | En tant que client, je veux recevoir une confirmation de commande avec numéro unique | 3 | US-4.4 | 📝 TODO |
| **US-4.6** | En tant que client, je veux recevoir un email de confirmation | 2 | Backend (email service) | 📝 TODO |

**Total Epic 4**: 22 points

---

### Epic 5: Suivi Commande
| ID | User Story | Story Points | Dépendances | Statut |
|----|-----------|--------------|-------------|--------|
| **US-5.1** | En tant que client, je veux voir le statut de ma commande en temps réel | 5 | Backend /orders/:id | 📝 TODO |
| **US-5.2** | En tant que client, je veux recevoir des notifications push lors des changements de statut | 8 | Firebase FCM | 📝 TODO |
| **US-5.3** | En tant que client, je veux consulter l'historique de mes commandes | 3 | Backend /orders | 📝 TODO |
| **US-5.4** | En tant que client, je veux voir les détails d'une commande passée | 3 | Backend /orders/:id | 📝 TODO |
| **US-5.5** | En tant que client, je veux annuler une commande non commencée | 5 | Backend PATCH /orders/:id/cancel | 📝 TODO |

**Total Epic 5**: 24 points

---

### Epic 6: Infrastructure & Quality
| ID | User Story | Story Points | Dépendances | Statut |
|----|-----------|--------------|-------------|--------|
| **US-6.1** | En tant que développeur, je veux une architecture Clean Architecture | 8 | - | 📝 TODO |
| **US-6.2** | En tant que développeur, je veux gérer les erreurs de manière robuste | 5 | - | 📝 TODO |
| **US-6.3** | En tant que développeur, je veux logger les erreurs (Sentry optionnel) | 3 | - | 📝 TODO |
| **US-6.4** | En tant que développeur, je veux une couverture de tests ≥ 70% | 13 | - | 📝 TODO |
| **US-6.5** | En tant que développeur, je veux un loading state pour chaque écran | 3 | - | 📝 TODO |
| **US-6.6** | En tant que développeur, je veux une gestion offline du panier | 3 | - | 📝 TODO |

**Total Epic 6**: 35 points

---

**🎯 Total MUST HAVE**: **131 Story Points** (env. 3-4 jours pour 4 personnes)

---

## ⚠️ SHOULD HAVE (Priorité P1 - Si temps disponible)

| ID | User Story | Story Points | Valeur Business | Statut |
|----|-----------|--------------|-----------------|--------|
| **US-7.1** | En tant que client, je veux filtrer les produits par régime (vegan, sans gluten) | 5 | Moyen | 📝 BACKLOG |
| **US-7.2** | En tant que client, je veux ajouter des produits aux favoris | 3 | Faible | 📝 BACKLOG |
| **US-7.3** | En tant que client, je veux réutiliser une commande précédente | 5 | Élevé | 📝 BACKLOG |
| **US-7.4** | En tant que client, je veux consulter le menu en mode hors ligne | 5 | Moyen | 📝 BACKLOG |
| **US-7.5** | En tant que client, je veux éditer mon profil (nom, email, téléphone) | 3 | Faible | 📝 BACKLOG |
| **US-7.6** | En tant que client, je veux sauvegarder des adresses de livraison | 3 | Moyen | 📝 BACKLOG |
| **US-7.7** | En tant que client, je veux voir le temps estimé de préparation | 2 | Élevé | 📝 BACKLOG |

**Total SHOULD HAVE**: **26 Story Points**

---

## 💡 COULD HAVE (Priorité P2 - Phase 2)

| ID | User Story | Story Points | Valeur Business | Statut |
|----|-----------|--------------|-----------------|--------|
| **US-8.1** | En tant que client, je veux un écran d'onboarding à la première ouverture | 3 | Faible | 📝 FUTURE |
| **US-8.2** | En tant que client, je veux payer avec Apple Pay / Google Pay | 5 | Moyen | 📝 FUTURE |
| **US-8.3** | En tant que client, je veux voir des recommandations de produits | 5 | Moyen | 📝 FUTURE |
| **US-8.4** | En tant que client, je veux scanner un QR code pour payer rapidement | 5 | Élevé | 📝 FUTURE |
| **US-8.5** | En tant que client, je veux un mode sombre (dark mode) | 3 | Faible | 📝 FUTURE |
| **US-8.6** | En tant que client, je veux partager un produit sur les réseaux sociaux | 2 | Très faible | 📝 FUTURE |
| **US-8.7** | En tant que client, je veux utiliser la géolocalisation pour commander en route | 5 | Moyen | 📝 FUTURE |

**Total COULD HAVE**: **28 Story Points**

---

## ❌ WON'T HAVE (Hors scope v1.0)

| ID | Fonctionnalité | Raison | Future Version |
|----|---------------|--------|----------------|
| **US-9.1** | Chat en direct avec le staff | Complexe, pas critique pour MVP | v2.0 |
| **US-9.2** | Réservation de table | Scope différent | v2.0 |
| **US-9.3** | Programme fidélité / points | Backend complexe | v2.0 |
| **US-9.4** | Commande vocale (Siri/Google) | Complexité technique élevée | v3.0 |
| **US-9.5** | AR menu (visualisation 3D produits) | Innovation, pas de ROI immédiat | v3.0 |
| **US-9.6** | Multi-langues | Café local mono-langue | Jamais |
| **US-9.7** | Commande groupée (split bill) | Edge case | v2.0 |

---

## 📊 Répartition du Backlog

```
Total estimé: 185 Story Points

Must Have (MVP):     131 SP (71%) ✅ PRIORITÉ
Should Have:          26 SP (14%) ⚠️ Si temps
Could Have:           28 SP (15%) 💡 Phase 2
Won't Have:            - SP  (0%) ❌ Hors scope
```

---

## 🏃 Sprint Planning (3 jours)

### Sprint 1 - Jour 1 (20 janvier)
**Objectif**: Documentation & Architecture
- Phase 1: Analysis (Business Analysis + Personas)
- Phase 2: Planning (PRD + Backlog + Timeline)
- Phase 3: Solutioning (Architecture + ADR + API Spec)
- **Livrable**: Documentation complète

---

### Sprint 2 - Jour 2 (21 janvier)
**Objectif**: Setup + Auth + Menu + Cart
- US-6.1: Setup Clean Architecture
- US-1.1, US-1.2, US-1.3: Authentification complète
- US-2.1, US-2.3, US-2.4: Menu + Détails produit
- US-3.1 → US-3.6: Panier complet
- **Livrable**: App navigable avec Auth, Menu, Panier

---

### Sprint 3 - Jour 2-3 (21-22 janvier)
**Objectif**: Commande + Paiement + Suivi
- US-4.1 → US-4.6: Commande & Paiement Stripe
- US-5.1 → US-5.5: Suivi temps réel + Notifications
- US-6.2, US-6.5: Gestion erreurs + Loading states
- **Livrable**: MVP fonctionnel end-to-end

---

### Sprint 4 - Jour 3 (22-23 janvier)
**Objectif**: Tests + Documentation + Démo
- US-6.4: Tests unitaires + intégration (≥70% coverage)
- Documentation technique (README, ARCHITECTURE.md)
- Démo vidéo
- Bug fixes critiques
- **Livrable**: Livraison finale

---

## 🎯 Définition de "Ready"

Une User Story est **prête à être développée** si:
- [ ] Titre clair (format BDD: En tant que... Je veux... Afin de...)
- [ ] Critères d'acceptation définis (GIVEN/WHEN/THEN)
- [ ] Estimation en Story Points validée
- [ ] Dépendances techniques identifiées
- [ ] Mockups/wireframes disponibles (si UI)
- [ ] API endpoints documentés (si backend)

---

## 🎯 Définition de "Done"

Une User Story est **terminée** si:
- [ ] Code développé et conforme aux critères d'acceptation
- [ ] Tests unitaires écrits (coverage ≥70% de la story)
- [ ] Tests manuels passés (happy path + edge cases)
- [ ] Code review effectuée
- [ ] Documentation inline (JSDoc)
- [ ] Pas de régression (autres tests passent)
- [ ] Build iOS + Android réussi
- [ ] Démo fonctionnelle

---

## 📈 Vélocité de l'Équipe

### Hypothèses
- **Équipe**: 4 personnes (1 mobile, 1 backend, 1 fullstack, 1 design/QA)
- **Vélocité estimée**: 40-50 SP/jour (équipe junior)
- **Capacité totale**: 120-150 SP sur 3 jours
- **MVP**: 131 SP → **Faisable mais serré**

### Plan de Mitigation
- Si retard > 10%, descope les Should Have (US-7.x)
- Si bloqué backend, utiliser Mock API (JSON Server)
- Daily stand-up à 9h pour ajuster le planning

---

## 🔄 Processus de Priorisation Continue

### Critères de Priorisation
1. **Valeur business** (impact revenue / satisfaction client)
2. **Complexité technique** (effort de développement)
3. **Dépendances** (bloquant pour autres stories)
4. **Risque** (incertitude technique)

### Formule de Score
```
Score = (Valeur Business × 10) / (Complexité + Risque)
```

Exemple:
- US-4.4 (Paiement Stripe): (10 × 10) / (8 + 3) = **9.1** → Critique
- US-8.6 (Partage social): (2 × 10) / (2 + 1) = **6.7** → Peut attendre

---

**📅 Date de création**: 20 janvier 2026
**🔄 Dernière mise à jour**: 20 janvier 2026
**✍️ Auteur**: Product Owner + Équipe Dev
