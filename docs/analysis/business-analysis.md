# 📊 Business Analysis - Smart Café

> **Phase 1 de la BMad Method**: Analysis (Exploration & Découverte)
> **Date**: 20 janvier 2026
> **Auteur**: Équipe Smart Café Mobile

---

## 🎯 Contexte du Projet

### Description du Besoin
Smart Café est un **café-restaurant haut de gamme** qui souhaite moderniser l'expérience client en proposant une **application mobile** permettant de:
- Consulter le menu en temps réel
- Passer des commandes à l'avance
- Effectuer le paiement en ligne
- Suivre l'état de préparation de sa commande

### Problématiques Identifiées

#### Pour les clients:
1. **Temps d'attente** : Files d'attente aux heures de pointe (pause déjeuner 12h-14h)
2. **Visibilité du menu** : Menu physique difficile à lire, manque de photos
3. **Paiement** : Uniquement en caisse, pas de paiement mobile
4. **Manque d'information** : Pas de visibilité sur le temps de préparation
5. **Personnalisation** : Difficile de customiser sa commande (options, allergènes)

#### Pour le café:
1. **Gestion des commandes** : Pic d'affluence difficile à gérer
2. **Erreurs de commande** : Mauvaise compréhension des demandes clients
3. **Perte de temps** : Clients qui hésitent devant le comptoir
4. **Fidélisation** : Pas de données clients pour programmes de fidélité

---

## 🔍 Étude de Marché

### Applications Concurrentes Analysées

| Application | Points Forts | Points Faibles | Note |
|-------------|--------------|----------------|------|
| **Starbucks** | Commande à l'avance, Paiement mobile, Programme fidélité | Complexe, Lent au lancement | 4/5 |
| **McDonald's** | Interface simple, Promotions, Click & Collect | Manque de personnalisation | 3.5/5 |
| **Uber Eats** | Large choix, Suivi temps réel | Commission élevée, Pas adapté aux cafés | 4/5 |
| **Joe & The Juice** | Design moderne, Photos appétissantes | Fonctionnalités limitées | 3/5 |

### Insights Clés
- Les utilisateurs privilégient la **simplicité** et la **rapidité**
- Les **photos de produits** augmentent les conversions de 30%
- Le **suivi en temps réel** réduit l'anxiété client
- Le **paiement mobile** est devenu un standard attendu

---

## 👥 Utilisateurs Cibles

### Segmentation Principale

#### 1. Professionnels Pressés (40%)
- **Âge**: 25-45 ans
- **Comportement**: Commande rapide avant/pendant le travail
- **Besoin**: Gagner du temps, éviter la file d'attente
- **Fréquence**: 3-5 fois/semaine

#### 2. Étudiants Connectés (30%)
- **Âge**: 18-25 ans
- **Comportement**: Sensibles au prix, utilisent leur smartphone
- **Besoin**: Menu visible, options végétariennes/vegan
- **Fréquence**: 2-3 fois/semaine

#### 3. Clientèle Loisir (20%)
- **Âge**: 30-60 ans
- **Comportement**: Commande sur place, prend le temps
- **Besoin**: Confort, qualité, recommandations
- **Fréquence**: 1-2 fois/semaine

#### 4. Livreurs/Takeaway (10%)
- **Âge**: Tous âges
- **Comportement**: Commande à emporter
- **Besoin**: Notification quand c'est prêt
- **Fréquence**: Variable

---

## 🎯 Objectifs Business

### Objectifs Primaires (6 mois)
1. **Adoption**: 60% des clients réguliers utilisent l'app
2. **Commandes**: 40% des commandes passées via l'app
3. **Satisfaction**: Note moyenne ≥ 4.5/5 sur les stores
4. **Temps d'attente**: Réduction de 30% du temps moyen

### Objectifs Secondaires
- Augmenter le panier moyen de 15% (upselling via l'app)
- Collecter des données clients pour la fidélisation
- Réduire les erreurs de commande de 50%

---

## 💡 Opportunités Identifiées

### Fonctionnalités Différenciantes
1. **Mode Hors Ligne**: Cache du menu pour consultation sans connexion
2. **Personnalisation Avancée**: Allergènes, préférences, notes spéciales
3. **Gamification**: Badges, récompenses pour clients fidèles (phase 2)
4. **Commande Vocale**: "Siri, commande mon café habituel" (futur)

### Partenariats Possibles
- **Stripe**: Paiement sécurisé
- **Apple Pay / Google Pay**: Paiement express
- **Firebase**: Notifications push temps réel

---

## ⚠️ Risques & Contraintes

### Risques Techniques
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Synchronisation temps réel défaillante | Élevé | Moyen | Polling + WebSocket fallback |
| Paiement échoué | Élevé | Faible | Retry logic + Support Stripe |
| Crash app aux heures de pointe | Élevé | Moyen | Tests de charge + Monitoring |
| Données hors ligne désynchronisées | Moyen | Élevé | Stratégie de cache claire |

### Contraintes Métier
- **Délai court**: 3 jours pour le prototype MVP
- **Budget limité**: Pas de backend custom au départ (peut utiliser Firebase/Supabase)
- **Équipe réduite**: 4 personnes (mobile, backend, design, PM)

### Contraintes Techniques
- **Plateforme**: React Native (iOS et Android)
- **Performance**: Lancement en < 3s
- **Offline-first**: Menu consultable sans connexion

---

## 📈 KPIs de Succès

### KPIs Produit
- **Taux de conversion**: % visiteurs → commandes
- **Panier moyen**: Montant moyen par commande
- **Taux de rétention**: % utilisateurs actifs après 30 jours
- **NPS (Net Promoter Score)**: Score de recommandation

### KPIs Techniques
- **Crash-free rate**: > 99.5%
- **Temps de chargement**: < 3s au lancement
- **Couverture de tests**: ≥ 70%
- **Temps de réponse API**: < 500ms (P95)

---

## 🎨 Premières Hypothèses UX

### Parcours Utilisateur Principal
```
1. Lancement app → Écran d'accueil (Menu ou Auth)
2. Consultation menu → Catégories (Boissons, Food, Desserts)
3. Sélection produit → Détails + Options + Ajout panier
4. Validation panier → Récapitulatif + Paiement
5. Confirmation → Suivi temps réel + Notification
6. Récupération → Scan QR Code ou numéro commande
```

### Écrans Clés (Wireframes à créer en Phase 2)
1. Splash Screen + Onboarding
2. Authentification (Login/Register)
3. Menu (Liste par catégorie)
4. Détail Produit (Photo, Description, Options)
5. Panier (Recap, Modification quantité)
6. Checkout (Paiement Stripe)
7. Suivi Commande (Statut temps réel)
8. Historique Commandes

---

## ✅ Conclusion de l'Analysis

### Décision: GO / NO-GO
**✅ GO** - Le projet présente un ROI potentiel élevé avec des risques maîtrisables.

### Prochaines Étapes (Phase 2: Planning)
1. Créer les personas détaillés
2. Rédiger les user stories (format BDD)
3. Créer les wireframes/maquettes Figma
4. Définir le backlog MVP (MoSCoW)
5. Estimer les charges de développement

### Hypothèses à Valider
- [ ] Le backend API sera disponible pour le 21 janvier
- [ ] Les credentials Stripe test seront fournis
- [ ] Les assets design (logo, couleurs) seront disponibles
- [ ] Firebase est approuvé pour les notifications push

---

**📅 Date de validation**: 20 janvier 2026
**✍️ Validé par**: Product Owner / Équipe technique
