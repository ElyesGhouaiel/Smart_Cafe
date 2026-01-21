# 📋 Product Requirements Document (PRD) - Smart Café Mobile

> **Phase 2 de la BMad Method**: Planning
> **Version**: 1.0
> **Date**: 20 janvier 2026
> **Statut**: ✅ Validé

---

## 📌 Executive Summary

### Vision Produit
Smart Café Mobile est une **application mobile native (iOS/Android)** permettant aux clients d'un café haut de gamme de **commander, payer et suivre leurs commandes** de manière fluide et rapide, en réduisant le temps d'attente et en améliorant l'expérience client.

### Objectifs Business
- **Réduire** le temps d'attente moyen de 30%
- **Augmenter** le panier moyen de 15% via l'upselling
- **Atteindre** 60% d'adoption par les clients réguliers en 6 mois
- **Améliorer** la satisfaction client (NPS ≥ 60)

### Cible
- **Persona primaire**: Professionnels pressés (25-45 ans)
- **Persona secondaire**: Étudiants connectés (18-25 ans)
- **Marché**: Clients du café Smart Café (estimation: 500-1000 clients/mois)

---

## 🎯 Périmètre du MVP (Minimum Viable Product)

### Ce qui EST dans le MVP (Must Have)

#### 1. Authentification & Profil
- Inscription par email/password
- Connexion email/password
- Mot de passe oublié (email reset)
- Profil utilisateur basique (nom, email, téléphone)

#### 2. Catalogue Produits
- Affichage menu par catégories (Boissons, Food, Desserts)
- Recherche de produits
- Détails produit (photo, description, prix, allergènes, temps préparation)
- Options de personnalisation (taille, lait, extras)
- Indisponibilité produits en temps réel

#### 3. Panier
- Ajout/suppression produits
- Modification quantité
- Calcul total (subtotal, taxes, frais livraison)
- Persistance panier (même après fermeture app)

#### 4. Commande & Paiement
- Validation panier
- Choix type commande (sur place / à emporter / livraison)
- Paiement sécurisé Stripe (carte bancaire)
- Confirmation commande (numéro unique)

#### 5. Suivi Commande
- Statut temps réel (En attente → Préparation → Prête → Complétée)
- Notification push lors changement statut
- Historique commandes (liste + détails)
- Annulation commande (si statut = "En attente")

### Ce qui N'EST PAS dans le MVP (Future Versions)

#### Phase 2 (Should Have)
- 🔸 Favoris / Commandes récurrentes
- 🔸 Programme fidélité
- 🔸 Paiement Apple Pay / Google Pay
- 🔸 Mode hors ligne avancé
- 🔸 Scan QR Code pour paiement rapide

#### Phase 3 (Could Have)
- 💡 Réservation de table
- 💡 Chat avec le staff
- 💡 Partage social
- 💡 Commande vocale (Siri/Google Assistant)
- 💡 AR menu (visualisation 3D produits)

#### Won't Have (cette version)
- ❌ Multi-langues
- ❌ Multi-devises
- ❌ Marketplace (autres cafés)
- ❌ Commande groupée

---

## 📱 User Stories (Format BDD)

### Epic 1: Authentification

#### US-1.1: Inscription Utilisateur
```gherkin
En tant que nouveau client
Je veux créer un compte avec mon email
Afin de pouvoir passer des commandes

Critères d'acceptation:
- GIVEN je suis sur l'écran d'inscription
- WHEN je remplis email, password, nom, prénom
- AND je clique sur "S'inscrire"
- THEN un compte est créé
- AND je reçois un email de confirmation
- AND je suis connecté automatiquement
- AND je suis redirigé vers le menu

Règles métier:
- Email valide (format email)
- Password min 8 caractères (1 majuscule, 1 chiffre, 1 caractère spécial)
- Tous les champs obligatoires
- Email unique (pas de doublon)
```

#### US-1.2: Connexion Utilisateur
```gherkin
En tant qu'utilisateur existant
Je veux me connecter avec mes identifiants
Afin d'accéder à mon compte

Critères d'acceptation:
- GIVEN je suis sur l'écran de connexion
- WHEN je saisis email + password valides
- AND je clique sur "Se connecter"
- THEN je suis authentifié
- AND je suis redirigé vers le menu
- AND mon token JWT est stocké localement

Erreurs:
- Email/password incorrect → Message "Identifiants invalides"
- Compte non vérifié → Message "Veuillez vérifier votre email"
```

#### US-1.3: Mot de Passe Oublié
```gherkin
En tant qu'utilisateur ayant oublié son mot de passe
Je veux demander une réinitialisation
Afin de retrouver l'accès à mon compte

Critères d'acceptation:
- GIVEN je clique sur "Mot de passe oublié"
- WHEN je saisis mon email
- THEN je reçois un email avec un lien de reset
- AND le lien expire après 1 heure
```

---

### Epic 2: Menu & Produits

#### US-2.1: Consultation Menu
```gherkin
En tant que client
Je veux consulter le menu par catégorie
Afin de découvrir les produits disponibles

Critères d'acceptation:
- GIVEN je suis sur l'écran menu
- WHEN la page charge
- THEN je vois les catégories (Boissons, Food, Desserts)
- AND chaque produit affiche: photo, nom, prix
- AND les produits indisponibles sont grisés
- AND je peux faire défiler verticalement
```

#### US-2.2: Recherche Produits
```gherkin
En tant que client
Je veux rechercher un produit par nom
Afin de trouver rapidement ce que je veux

Critères d'acceptation:
- GIVEN je suis sur l'écran menu
- WHEN je tape "cappuccino" dans la barre de recherche
- THEN la liste filtre en temps réel
- AND affiche uniquement les produits contenant "cappuccino"
- AND si aucun résultat, affiche "Aucun produit trouvé"
```

#### US-2.3: Détails Produit
```gherkin
En tant que client
Je veux voir les détails d'un produit
Afin de prendre une décision éclairée

Critères d'acceptation:
- GIVEN je clique sur un produit
- THEN j'arrive sur la page détails
- AND je vois: photo HD, nom, description, prix, allergènes, temps préparation
- AND je peux sélectionner des options (taille, lait, extras)
- AND le prix se met à jour dynamiquement
- AND je peux ajouter au panier
```

---

### Epic 3: Panier

#### US-3.1: Ajout au Panier
```gherkin
En tant que client
Je veux ajouter un produit à mon panier
Afin de préparer ma commande

Critères d'acceptation:
- GIVEN je suis sur la page produit
- WHEN je sélectionne une quantité et des options
- AND je clique sur "Ajouter au panier"
- THEN le produit est ajouté
- AND un badge s'affiche sur l'icône panier (nombre d'items)
- AND un toast confirme l'ajout
```

#### US-3.2: Modification Panier
```gherkin
En tant que client
Je veux modifier la quantité d'un produit dans le panier
Afin d'ajuster ma commande

Critères d'acceptation:
- GIVEN je suis dans le panier
- WHEN je clique sur +/-
- THEN la quantité est mise à jour
- AND le prix total recalcule automatiquement
- AND si quantité = 0, le produit est supprimé
```

#### US-3.3: Persistance Panier
```gherkin
En tant que client
Je veux que mon panier soit sauvegardé
Afin de ne pas perdre ma sélection si je ferme l'app

Critères d'acceptation:
- GIVEN j'ai des produits dans le panier
- WHEN je ferme et rouvre l'app
- THEN mon panier contient toujours les mêmes produits
- AND les prix sont actualisés (en cas de changement)
```

---

### Epic 4: Commande & Paiement

#### US-4.1: Validation Commande
```gherkin
En tant que client
Je veux valider ma commande
Afin de procéder au paiement

Critères d'acceptation:
- GIVEN mon panier contient des produits
- WHEN je clique sur "Commander"
- THEN je vois un récapitulatif (produits, subtotal, taxes, total)
- AND je choisis le type (sur place / à emporter / livraison)
- AND si livraison, je saisis l'adresse
- AND je passe au paiement
```

#### US-4.2: Paiement Stripe
```gherkin
En tant que client
Je veux payer ma commande par carte bancaire
Afin de finaliser l'achat

Critères d'acceptation:
- GIVEN je suis sur l'écran paiement
- WHEN je saisis mes informations de carte
- AND je clique sur "Payer X€"
- THEN Stripe valide le paiement
- AND la commande est créée côté backend
- AND je reçois une confirmation (numéro commande)
- AND je suis redirigé vers le suivi

Erreurs:
- Paiement refusé → Message "Paiement échoué, veuillez réessayer"
- Timeout → Retry automatique
```

#### US-4.3: Confirmation Commande
```gherkin
En tant que client
Je veux recevoir une confirmation de commande
Afin d'avoir la preuve de mon achat

Critères d'acceptation:
- GIVEN ma commande est payée
- THEN je vois un écran de succès
- AND j'ai un numéro de commande unique (ex: ORD-2026-001)
- AND je reçois un email de confirmation
- AND je peux voir le temps estimé de préparation
```

---

### Epic 5: Suivi Commande

#### US-5.1: Suivi Temps Réel
```gherkin
En tant que client
Je veux suivre le statut de ma commande en temps réel
Afin de savoir quand venir la récupérer

Critères d'acceptation:
- GIVEN j'ai une commande en cours
- WHEN je consulte l'écran de suivi
- THEN je vois le statut actuel:
  - 🕐 En attente (paiement confirmé)
  - 👨‍🍳 En préparation
  - ✅ Prête (à récupérer)
  - ✔️ Complétée
- AND un indicateur visuel de progression
- AND le temps estimé restant
```

#### US-5.2: Notifications Push
```gherkin
En tant que client
Je veux recevoir des notifications
Afin d'être alerté des changements de statut

Critères d'acceptation:
- GIVEN j'ai activé les notifications
- WHEN le statut de ma commande change
- THEN je reçois une notification push
- AND le titre indique le nouveau statut
- AND je peux cliquer pour ouvrir le détail
```

#### US-5.3: Historique Commandes
```gherkin
En tant que client
Je veux consulter mes commandes passées
Afin de revoir mes achats précédents

Critères d'acceptation:
- GIVEN je suis sur mon profil
- WHEN je clique sur "Historique"
- THEN je vois la liste de mes commandes (triées par date DESC)
- AND chaque commande affiche: date, montant, statut
- AND je peux cliquer pour voir les détails
```

#### US-5.4: Annulation Commande
```gherkin
En tant que client
Je veux annuler une commande non commencée
Afin de modifier ma décision

Critères d'acceptation:
- GIVEN ma commande a le statut "En attente"
- WHEN je clique sur "Annuler la commande"
- THEN une popup de confirmation s'affiche
- AND si je confirme, la commande est annulée
- AND le remboursement est initié (Stripe)
- AND je reçois une confirmation d'annulation

Contraintes:
- Annulation impossible si statut ≠ "En attente"
- Remboursement sous 3-5 jours
```

---

## 🎨 Design & UX

### Principes de Design
1. **Simplicité**: Parcours en max 4 écrans pour commander
2. **Rapidité**: Temps de chargement < 3s
3. **Accessibilité**: Contraste WCAG AA, tailles de texte adaptatives
4. **Feedback**: Toasts, loaders, animations fluides

### Charte Graphique
- **Couleurs**:
  - Primary: #1E3A8A (Bleu profond café haut de gamme)
  - Secondary: #F59E0B (Amber pour CTA)
  - Success: #10B981 (Vert)
  - Error: #EF4444 (Rouge)
  - Background: #F9FAFB (Gris très clair)
- **Typo**:
  - Headings: Poppins Bold
  - Body: Inter Regular
- **Iconographie**: React Native Vector Icons (Material Design)

### Écrans Principaux (Wireframes en annexe)
1. **Splash Screen** (3s max)
2. **Onboarding** (3 slides - skippable)
3. **Auth** (Login/Register tabs)
4. **Menu** (Tabs par catégorie + Search)
5. **Produit** (Hero image, options, CTA)
6. **Panier** (List + Total sticky)
7. **Checkout** (Recap + Payment)
8. **Suivi** (Stepper visuel + Details)
9. **Profil** (Avatar, Historique, Settings)

---

## 🔧 Exigences Techniques

### Performance
- **Cold Start**: < 3s
- **Screen Transition**: < 300ms
- **API Response Time**: < 500ms (P95)
- **Image Loading**: Progressive (placeholder → low-res → HD)

### Compatibilité
- **iOS**: 14.0+ (95% des devices)
- **Android**: API 24+ (Android 7.0+, 98% des devices)
- **Tailles écrans**: iPhone SE → iPhone 15 Pro Max | 5" → 6.7"

### Sécurité
- **Authentification**: JWT (access token 15min, refresh token 7 jours)
- **Stockage local**: AsyncStorage chiffré pour tokens
- **Communication**: HTTPS uniquement
- **Validation input**: Sanitization côté client et serveur
- **Secrets**: Variables d'environnement (.env)

### Offline
- **Menu**: Cache local (TTL 1h)
- **Panier**: Persistance locale (AsyncStorage)
- **Commandes**: Requiert connexion (pas de sync offline)

### Accessibilité (WCAG 2.1 Level AA)
- **Contraste**: Min 4.5:1 texte normal, 3:1 texte large
- **Touch Targets**: Min 44x44 pts
- **Screen Reader**: VoiceOver/TalkBack support
- **Keyboard Navigation**: Tab order logique

---

## 📊 Métriques de Succès (KPIs)

### Adoption
- **Téléchargements**: 500 dans le premier mois
- **Utilisateurs actifs**: 300 MAU (Monthly Active Users)
- **Rétention**: 40% à J+30

### Engagement
- **Fréquence**: 3 commandes/utilisateur/mois
- **Panier moyen**: 12€
- **Taux de conversion**: 60% (visiteurs → acheteurs)

### Qualité
- **Crash-free rate**: > 99.5%
- **App Store Rating**: ≥ 4.5/5
- **NPS**: ≥ 60

### Business
- **Revenue**: 5K€/mois via l'app
- **Réduction temps attente**: -30%
- **Satisfaction client**: +25%

---

## 🚧 Contraintes & Risques

### Contraintes
| Type | Description | Impact |
|------|-------------|--------|
| **Délai** | 3 jours pour le MVP | Élevé - Réduction du scope |
| **Budget** | Projet académique (0€) | Moyen - Services gratuits uniquement |
| **Équipe** | 4 personnes (juniors) | Élevé - Besoin formation/support |
| **Technologie** | React Native imposé | Faible - Équipe connaît la stack |

### Risques
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Backend pas prêt à temps | Élevée | Critique | Mock API + JSON Server |
| Dépassement délai | Moyenne | Élevé | Priorisation stricte MVP |
| Problèmes Stripe test | Faible | Moyen | Documentation + Support Stripe |
| Bugs critiques en prod | Moyenne | Élevé | Tests automatisés 70% |
| Mauvaise UX mobile | Faible | Moyen | Tests utilisateurs + Figma |

---

## 🗓️ Planning & Jalons

### Timeline (20-23 janvier 2026)

| Date | Phase | Livrables |
|------|-------|-----------|
| **20 jan** | Analysis + Planning | Docs (Analysis, PRD, User Stories, Backlog) |
| **21 jan** | Solutioning | Architecture, ADR, Diagrams, API Spec |
| **21-22 jan** | Implementation | Code MVP (Auth + Menu + Cart + Order) |
| **22 jan** | Implementation | Tests (≥70% coverage) |
| **23 jan** | Finalization | Documentation technique + Démo vidéo |

### Jalons Clés
- ✅ **J1 Matin**: Documentation complète validée
- ✅ **J1 Soir**: Architecture technique définie
- ✅ **J2 Midi**: Auth + Menu fonctionnels
- ✅ **J2 Soir**: Cart + Order + Payment intégrés
- ✅ **J3 Matin**: Tests + Corrections bugs
- ✅ **J3 Midi**: Démo vidéo enregistrée
- ✅ **J3 Soir**: Livraison finale (code + docs)

---

## 🎯 Définition de "Done"

Une User Story est considérée comme **DONE** si:
- [ ] Code développé et committé (Git)
- [ ] Tests unitaires écrits (coverage ≥70% de la story)
- [ ] Tests manuels passés (QA)
- [ ] Revue de code effectuée (pair programming ok)
- [ ] Documentation technique à jour (inline comments + README)
- [ ] Pas de regression (tests existants passent)
- [ ] Build réussit (iOS + Android)
- [ ] Démo fonctionnelle (happy path validé)

---

## 📎 Annexes

### Dépendances Externes
- **Backend API**: Endpoints listés dans `BESOINS_API_MOBILE.md`
- **Stripe**: Clés de test fournies par l'équipe backend
- **Firebase**: Config files (GoogleService-Info.plist, google-services.json)
- **Assets**: Logo, images produits (fournis par le design)

### Références
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Stripe React Native SDK](https://stripe.com/docs/payments/accept-a-payment?platform=react-native)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)

---

**📅 Date de validation**: 20 janvier 2026
**✍️ Validé par**: Product Owner + CTO
**🔄 Prochaine révision**: Après Phase 4 (retours utilisateurs)
