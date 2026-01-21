# ADR-001: Adoption de Clean Architecture pour React Native

**Date**: 20 janvier 2026
**Statut**: ✅ Accepté
**Décideurs**: Tech Lead, Équipe Mobile
**Tags**: architecture, structure, patterns

---

## Contexte

L'application Smart Café Mobile est un projet académique avec des contraintes de:
- **Qualité**: Évaluation sur l'architecture et les principes SOLID
- **Testabilité**: Couverture de tests ≥ 70% requise
- **Maintenabilité**: Code doit être lisible et extensible
- **Court terme**: 3 jours de développement

Nous devons choisir un pattern architectural qui garantit ces qualités tout en restant pragmatique.

---

## Décision

Nous adoptons **Clean Architecture** (Uncle Bob) avec 4 couches distinctes:

1. **Domain Layer** (`core/`): Entités + Use Cases + Interfaces Repositories
2. **Data Layer** (`data/`): Implémentations Repositories + DataSources + DTOs
3. **Presentation Layer** (`presentation/`): UI (Screens/Components) + State (Redux)
4. **Infrastructure** (`infrastructure/`): Services externes (API, Storage, FCM)

**Règle de dépendance**: Les couches externes dépendent des couches internes (jamais l'inverse)

---

## Alternatives Considérées

### Alternative 1: MVC Simple (Model-View-Controller)
**Avantages**:
- Simplicité et rapidité de mise en place
- Moins de code boilerplate
- Courbe d'apprentissage faible

**Inconvénients**:
- ❌ Logique métier mélangée avec l'UI
- ❌ Difficile à tester (couplage fort)
- ❌ Ne respecte pas SOLID (critère d'évaluation)
- ❌ Scalabilité limitée

**Verdict**: ❌ Rejeté - Ne répond pas aux exigences académiques

---

### Alternative 2: MVVM (Model-View-ViewModel)
**Avantages**:
- Bon pour React Native (avec Redux/MobX)
- Séparation UI et logique de présentation
- Pattern courant en mobile

**Inconvénients**:
- ❌ Pas de séparation claire du domain
- ❌ Logique métier dans les ViewModels (couplage)
- ❌ Testabilité moyenne (mocks de ViewModels nécessaires)

**Verdict**: ⚠️ Acceptable mais pas optimal pour l'évaluation

---

### Alternative 3: Feature-Sliced Design
**Avantages**:
- Très moderne (2023+)
- Organisation par features (auth, menu, cart)
- Scalable pour grosses applications

**Inconvénients**:
- ❌ Moins connu des évaluateurs académiques
- ❌ Documentation limitée
- ❌ Peut être over-engineered pour un MVP

**Verdict**: ❌ Rejeté - Trop récent et complexe pour le délai

---

## Justification de la Décision

### Pourquoi Clean Architecture ?

#### ✅ 1. Respecte les Critères d'Évaluation
- **Architecture & Méthodologie (30 pts)**: Clean Architecture est explicitement demandée
- **Principes SOLID (10 pts)**: L'architecture est conçue autour de SOLID
- **Testabilité (20 pts)**: Use cases testables en isolation (sans UI ni API)

#### ✅ 2. Indépendance des Frameworks
```typescript
// ✅ Le domain ne dépend PAS de React Native
// core/usecases/cart/AddToCartUseCase.ts
export class AddToCartUseCase {
  execute(product: Product, qty: number) {
    // Pure business logic, no React, no Redux, no API
  }
}
```

Si demain on passe à Flutter ou Vue Native → seul le layer Presentation change.

#### ✅ 3. Testabilité Maximale
```typescript
// Test d'un Use Case sans aucune dépendance externe
describe('AddToCartUseCase', () => {
  it('should calculate correct total', () => {
    const mockRepo = new MockCartRepository();
    const useCase = new AddToCartUseCase(mockRepo);
    // Test pur, rapide, isolé
  });
});
```

**Résultat**: Coverage ≥ 70% facilement atteignable.

#### ✅ 4. Séparation Claire des Responsabilités (SOLID)
| Couche | Responsabilité | Dépend de |
|--------|----------------|-----------|
| Domain | Logique métier pure | Rien (autonome) |
| Data | Accès aux données | Domain (interfaces) |
| Presentation | UI et state | Domain (use cases) |
| Infrastructure | Services externes | Domain + Data |

**Principe**: Chaque couche a **UNE** responsabilité (Single Responsibility Principle)

#### ✅ 5. Extensibilité
Exemples d'extensions futures sans casser le code existant (Open/Closed Principle):
- Ajouter un nouveau mode de paiement → Nouveau DataSource
- Changer de backend API → Nouvelle implémentation Repository
- Ajouter GraphQL → Nouvelle DataSource, même repositories

#### ✅ 6. Gestion d'Erreurs Centralisée
```typescript
// Erreurs métier dans le Domain
export class ProductNotAvailableError extends Error {}

// Interceptées et affichées dans Presentation
try {
  await useCase.execute(product);
} catch (error) {
  if (error instanceof ProductNotAvailableError) {
    showToast('Ce produit n\'est plus disponible');
  }
}
```

---

## Compromis et Contraintes

### ⚠️ Compromis Acceptés

#### 1. Plus de Code Boilerplate
**Problème**: Plus de fichiers et d'interfaces à créer.
**Mitigation**: Utilisation de templates et de générateurs de code (snippets VSCode).

#### 2. Courbe d'Apprentissage
**Problème**: L'équipe (juniors) doit apprendre Clean Architecture.
**Mitigation**:
- Documentation détaillée dans `/docs`
- Pair programming
- Code review systématique

#### 3. Temps de Setup Initial
**Problème**: Setup plus long qu'un projet MVC simple.
**Mitigation**:
- Prioriser le setup J1 (4h dédiées)
- Créer la structure de base avant de coder les features

---

## Implémentation

### Structure Générée
```
src/
├── core/               # Domain (indépendant)
├── data/               # Infrastructure data
├── presentation/       # UI + State
└── infrastructure/     # Services externes
```

### Workflow de Développement
1. **Définir l'entité** (core/entities)
2. **Créer le use case** (core/usecases)
3. **Définir l'interface repository** (core/repositories)
4. **Implémenter le repository** (data/repositories)
5. **Créer les datasources** (data/datasources)
6. **Connecter à Redux** (presentation/state)
7. **Créer l'UI** (presentation/screens)
8. **Tester** (__tests__)

---

## Conséquences

### ✅ Avantages
1. **Évaluation**: Score maximal sur "Architecture & Méthodologie" (30 pts)
2. **Testabilité**: Coverage ≥ 70% atteignable facilement
3. **Maintenabilité**: Code propre et organisé
4. **Scalabilité**: Ajout de features sans régression
5. **Compétences**: Apprentissage d'une architecture professionnelle

### ⚠️ Inconvénients
1. **Complexité initiale**: Overhead de code pour des features simples
2. **Temps de dev**: 15-20% plus lent qu'une architecture simple
3. **Over-engineering**: Possiblement excessif pour un MVP 3 jours

### 🎯 Acceptation des Risques
Nous acceptons la complexité car:
- Le projet est **académique** (évaluation sur la qualité)
- Le but est d'**apprendre les bonnes pratiques**
- Le score dépend de l'architecture (30% de la note)

---

## Validation

### Critères de Succès
- [ ] Structure 4 couches respectée
- [ ] Aucune dépendance du Domain vers l'extérieur
- [ ] Use cases testables en isolation
- [ ] Coverage ≥ 70%
- [ ] Code review valide l'architecture

### Métriques
- **Couplage**: Faible (chaque couche est indépendante)
- **Cohésion**: Élevée (responsabilités claires)
- **Testabilité**: Élevée (mocks faciles)

---

## Références

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Clean Architecture Example](https://github.com/eduardomoroni/react-native-clean-architecture)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Décision finale**: ✅ **ACCEPTÉE**

**Prochaines étapes**:
1. Créer la structure de dossiers (J1 matin)
2. Implémenter le premier flow (Auth) pour valider le pattern
3. Former l'équipe via pair programming

**Auteur**: Tech Lead
**Révisé par**: Équipe Dev
**Date de révision**: 20 janvier 2026
