# 📅 Timeline & Planning - Smart Café Mobile

> **Phase 2 de la BMad Method**: Planning
> **Période**: 20-23 janvier 2026 (4 jours)
> **Méthodologie**: BMad Method (4 phases)

---

## 📊 Vue d'Ensemble

```
├── Jour 1 (20 jan) : Analysis + Planning + Solutioning
├── Jour 2 (21 jan) : Implementation (Setup + Auth + Menu + Cart)
├── Jour 3 (22 jan) : Implementation (Order + Payment + Tracking) + Tests
└── Jour 4 (23 jan) : Tests + Documentation + Démo + Livraison
```

**Durée totale**: 4 jours (96 heures)
**Équipe**: 4 personnes
**Effort total**: 384 heures-personne

---

## 🗓️ JOUR 1 - Lundi 20 Janvier 2026

### 🌅 Matin (9h-12h) - Phase 1 & 2: Analysis + Planning

| Horaire | Activité | Responsable | Livrable | Durée |
|---------|----------|-------------|----------|-------|
| **09:00-09:30** | Kickoff meeting - Présentation projet | Toute l'équipe | - | 30min |
| **09:30-10:30** | Phase 1: Business Analysis | Product Owner | `docs/analysis/business-analysis.md` | 1h |
| **10:30-11:00** | Phase 1: Personas | Product Owner + UX | `docs/analysis/personas.md` | 30min |
| **11:00-12:00** | Phase 2: PRD (Product Requirements Document) | Product Owner | `docs/planning/prd.md` | 1h |

**Livrables Matin**:
- ✅ Business Analysis
- ✅ Personas utilisateurs
- ✅ PRD complet

---

### 🌞 Après-midi (13h-18h) - Phase 2 & 3: Planning + Solutioning

| Horaire | Activité | Responsable | Livrable | Durée |
|---------|----------|-------------|----------|-------|
| **13:00-14:00** | Phase 2: Backlog MoSCoW + Timeline | Product Owner | `docs/planning/backlog.md`, `timeline.md` | 1h |
| **14:00-15:00** | Phase 3: Architecture technique | Tech Lead | `docs/solutioning/architecture.md` | 1h |
| **15:00-16:00** | Phase 3: ADR (Architecture Decision Records) | Tech Lead | `docs/solutioning/adr/*.md` | 1h |
| **16:00-17:00** | Phase 3: Modèle de données + API Spec | Backend Dev | `database-model.md`, `api-spec.yaml` | 1h |
| **17:00-18:00** | **COORDINATION**: BESOINS_API_MOBILE.md | Mobile Dev | `docs/team/BESOINS_API_MOBILE.md` | 1h |

**Livrables Après-midi**:
- ✅ Backlog priorisé (MoSCoW)
- ✅ Timeline planning
- ✅ Architecture Clean Architecture
- ✅ 3+ ADR
- ✅ Modèle de données
- ✅ API Specification (OpenAPI)
- ✅ Document coordination équipe

**🎯 Jalon J1**: Documentation complète (Analysis + Planning + Solutioning) ✅

---

## 🗓️ JOUR 2 - Mardi 21 Janvier 2026

### 🌅 Matin (9h-12h) - Setup + Auth

| Horaire | Activité | Responsable | Stories | Durée |
|---------|----------|-------------|---------|-------|
| **09:00-09:15** | Daily stand-up | Toute l'équipe | - | 15min |
| **09:15-10:00** | Setup projet React Native + Clean Architecture | Mobile Dev | US-6.1 | 45min |
| **10:00-10:30** | Installation dépendances (Navigation, Redux, Axios) | Mobile Dev | US-6.1 | 30min |
| **10:30-11:30** | Authentification UI (Login/Register screens) | Mobile Dev | US-1.1, US-1.2 | 1h |
| **11:30-12:00** | Intégration API Auth (JWT) | Mobile Dev | US-1.2, US-1.4 | 30min |

**Livrables Matin**:
- ✅ Projet React Native initialisé
- ✅ Structure Clean Architecture
- ✅ Écrans Login/Register fonctionnels
- ✅ Authentification JWT

---

### 🌞 Après-midi (13h-18h) - Menu + Panier

| Horaire | Activité | Responsable | Stories | Durée |
|---------|----------|-------------|---------|-------|
| **13:00-14:00** | Écran Menu (liste produits par catégorie) | Mobile Dev | US-2.1 | 1h |
| **14:00-14:30** | Recherche produits | Mobile Dev | US-2.2 | 30min |
| **14:30-15:30** | Écran Détails Produit (avec options) | Mobile Dev | US-2.3, US-2.4 | 1h |
| **15:30-16:30** | Panier (ajout, modification, suppression) | Mobile Dev | US-3.1, US-3.3, US-3.4 | 1h |
| **16:30-17:30** | Redux Cart Slice + Persistance AsyncStorage | Mobile Dev | US-3.5, US-3.6 | 1h |
| **17:30-18:00** | Tests manuels + Corrections bugs | Mobile Dev | - | 30min |

**Livrables Après-midi**:
- ✅ Menu avec catégories + recherche
- ✅ Détails produit + options
- ✅ Panier fonctionnel
- ✅ Persistance panier locale

**🎯 Jalon J2**: App navigable (Auth + Menu + Cart) ✅

---

## 🗓️ JOUR 3 - Mercredi 22 Janvier 2026

### 🌅 Matin (9h-12h) - Commande + Paiement

| Horaire | Activité | Responsable | Stories | Durée |
|---------|----------|-------------|---------|-------|
| **09:00-09:15** | Daily stand-up | Toute l'équipe | - | 15min |
| **09:15-10:00** | Écran Checkout (récapitulatif) | Mobile Dev | US-4.1, US-4.2 | 45min |
| **10:00-11:30** | Intégration Stripe Payment | Mobile Dev | US-4.4 | 1h30 |
| **11:30-12:00** | Confirmation commande + Email | Mobile Dev | US-4.5, US-4.6 | 30min |

**Livrables Matin**:
- ✅ Écran Checkout
- ✅ Paiement Stripe fonctionnel
- ✅ Confirmation commande

---

### 🌞 Après-midi (13h-18h) - Suivi Commande + Notifications

| Horaire | Activité | Responsable | Stories | Durée |
|---------|----------|-------------|---------|-------|
| **13:00-14:00** | Écran Suivi Commande (statut temps réel) | Mobile Dev | US-5.1 | 1h |
| **14:00-15:30** | Firebase FCM (Notifications push) | Mobile Dev | US-5.2 | 1h30 |
| **15:30-16:30** | Historique Commandes | Mobile Dev | US-5.3, US-5.4 | 1h |
| **16:30-17:00** | Annulation Commande | Mobile Dev | US-5.5 | 30min |
| **17:00-18:00** | Tests end-to-end manuels (parcours complet) | Toute l'équipe | - | 1h |

**Livrables Après-midi**:
- ✅ Suivi commande temps réel
- ✅ Notifications push
- ✅ Historique
- ✅ Annulation

**🎯 Jalon J3**: MVP fonctionnel end-to-end ✅

---

## 🗓️ JOUR 4 - Jeudi 23 Janvier 2026

### 🌅 Matin (9h-12h) - Tests Automatisés

| Horaire | Activité | Responsable | Stories | Durée |
|---------|----------|-------------|---------|-------|
| **09:00-09:15** | Daily stand-up | Toute l'équipe | - | 15min |
| **09:15-10:30** | Tests unitaires (Entities, Use Cases, Utils) | Mobile Dev | US-6.4 | 1h15 |
| **10:30-11:30** | Tests composants (React Native Testing Library) | Mobile Dev | US-6.4 | 1h |
| **11:30-12:00** | Vérification couverture ≥70% | Mobile Dev | US-6.4 | 30min |

**Livrables Matin**:
- ✅ Tests unitaires
- ✅ Tests composants
- ✅ Couverture ≥70%

---

### 🌞 Après-midi (13h-17h) - Documentation + Démo

| Horaire | Activité | Responsable | Livrable | Durée |
|---------|----------|-------------|----------|-------|
| **13:00-14:00** | README.md principal | Mobile Dev | `README.md` | 1h |
| **14:00-14:30** | ARCHITECTURE.md détaillé | Tech Lead | `ARCHITECTURE.md` | 30min |
| **14:30-15:00** | Changelog + Documentation API | Backend Dev | `docs/implementation/changelog.md` | 30min |
| **15:00-16:00** | Enregistrement démo vidéo (screencast) | Product Owner | `docs/demo/video.mp4` | 1h |
| **16:00-16:30** | Préparation présentation finale | Toute l'équipe | Slides PPT | 30min |
| **16:30-17:00** | Revue finale + Tests dernière minute | Toute l'équipe | - | 30min |

**Livrables Après-midi**:
- ✅ Documentation technique complète
- ✅ Vidéo démo
- ✅ Présentation finale

**🎯 Jalon J4**: Livraison finale (Code + Docs + Démo) ✅

---

## 📊 Allocation des Ressources

### Répartition Équipe

| Rôle | Responsabilités | Charge |
|------|----------------|--------|
| **Mobile Dev (Lead)** | React Native, Clean Architecture, Tests | 100% |
| **Backend Dev** | API REST, Base de données, Stripe webhook | 100% |
| **Fullstack Dev** | Support Mobile + Backend, Intégrations | 100% |
| **Designer/QA** | Maquettes Figma, Tests manuels, Documentation | 100% |

---

### Charge de Travail par Jour

| Jour | Phase | Charge Estimée | Équipe |
|------|-------|----------------|--------|
| **J1** | Analysis + Planning + Solutioning | 8h × 4 = 32h | Toute l'équipe |
| **J2** | Implementation (Auth + Menu + Cart) | 8h × 4 = 32h | Toute l'équipe |
| **J3** | Implementation (Order + Tracking) | 8h × 4 = 32h | Toute l'équipe |
| **J4** | Tests + Documentation + Démo | 8h × 4 = 32h | Toute l'équipe |

**Total**: **128 heures-personne**

---

## 🎯 Jalons Clés (Milestones)

| Date | Heure | Jalon | Critère de Succès |
|------|-------|-------|-------------------|
| **20 jan** | 18:00 | 📚 Documentation complète | Tous les docs Analysis + Planning + Solutioning validés |
| **21 jan** | 12:00 | 🔐 Authentification fonctionnelle | Login/Register + JWT working |
| **21 jan** | 18:00 | 📋 Menu + Panier opérationnels | Parcours complet jusqu'au panier |
| **22 jan** | 12:00 | 💳 Paiement intégré | Stripe payment fonctionnel |
| **22 jan** | 18:00 | 📦 MVP end-to-end | Parcours complet commande → suivi |
| **23 jan** | 12:00 | ✅ Tests ≥70% | Coverage validée |
| **23 jan** | 17:00 | 🚀 Livraison finale | Code + Docs + Démo prêts |

---

## ⚠️ Risques & Mitigation

### Risques Planifiés

| Risque | Impact | Probabilité | Mitigation | Temps Buffer |
|--------|--------|-------------|------------|--------------|
| Backend API en retard | Critique | Élevée | Mock API (JSON Server) | 4h |
| Blocage Stripe | Élevé | Moyenne | Documentation + Support Stripe | 2h |
| Bugs critiques J3 | Élevé | Moyenne | Tests continus + Buffer J4 | 4h |
| Dépassement J2 | Moyen | Élevée | Descope Should Have | 2h |

### Buffer Time Inclus
- **J2 soir**: 1h buffer pour retards
- **J3 soir**: 1h buffer pour bugs
- **J4 matin**: 2h buffer tests/corrections

**Total buffer**: **4 heures**

---

## 📈 Suivi de Progression

### Daily Stand-up (15 min à 9h)
**Format**:
1. Ce que j'ai fait hier
2. Ce que je fais aujourd'hui
3. Blocages / Aide nécessaire

### Métriques à Tracker
- **Vélocité**: Story Points complétés/jour (target: 40-50 SP/jour)
- **Burndown Chart**: SP restants vs jours restants
- **Bugs critiques**: Nombre de bugs bloquants (target: 0)
- **Couverture tests**: % coverage (target: ≥70%)

---

## 🎓 Livrables Finaux (23 janvier 17:00)

### Code Source
- [x] Application React Native (iOS + Android)
- [x] Backend API (Node.js + Express ou équivalent)
- [x] Base de données (PostgreSQL/MongoDB)
- [x] Tests automatisés (≥70% coverage)

### Documentation
- [x] `docs/analysis/` (Business Analysis + Personas)
- [x] `docs/planning/` (PRD + Backlog + Timeline)
- [x] `docs/solutioning/` (Architecture + ADR + Diagrams + API Spec)
- [x] `docs/team/` (BESOINS_API_MOBILE.md)
- [x] `README.md` principal
- [x] `ARCHITECTURE.md`

### Démo
- [x] Vidéo screencast (3-5 min)
- [x] Présentation PowerPoint/Keynote (10 slides max)

---

## ✅ Checklist Finale de Livraison

### Code & Build
- [ ] Code source versionné (Git + commits conventionnels)
- [ ] Pas de warnings TypeScript
- [ ] Build iOS réussi
- [ ] Build Android réussi
- [ ] ESLint + Prettier configurés

### Tests
- [ ] Tests unitaires (Entities, Use Cases)
- [ ] Tests composants (Screens, Components)
- [ ] Couverture ≥ 70%
- [ ] `npm test` passe sans erreur

### Documentation
- [ ] README avec installation + lancement
- [ ] ARCHITECTURE.md détaillé
- [ ] API Spec (OpenAPI/Swagger)
- [ ] Documentation BMad Method (4 phases)

### Fonctionnalités MVP
- [ ] Authentification (Login/Register)
- [ ] Menu + Recherche + Détails Produit
- [ ] Panier (CRUD)
- [ ] Commande + Paiement Stripe
- [ ] Suivi temps réel + Notifications push
- [ ] Historique commandes

### Qualité
- [ ] Pas de crash au lancement
- [ ] Gestion erreurs robuste
- [ ] Loading states sur tous les écrans
- [ ] Messages d'erreur clairs pour l'utilisateur

---

**📅 Date de création**: 20 janvier 2026
**🔄 Suivi quotidien**: Daily stand-up à 9h
**✍️ Responsable Planning**: Product Owner + Scrum Master
