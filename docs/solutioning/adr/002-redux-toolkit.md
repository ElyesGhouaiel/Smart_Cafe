# ADR-002: Redux Toolkit pour la Gestion d'État

**Date**: 20 janvier 2026
**Statut**: ✅ Accepté
**Décideurs**: Tech Lead, Équipe Mobile
**Tags**: state-management, redux, react-native

---

## Contexte

L'application Smart Café nécessite une gestion d'état globale pour:
- **Authentification**: User connecté, token JWT
- **Panier**: Items, total, persistance
- **Commandes**: Liste, statut en temps réel
- **Menu**: Produits, catégories, cache

Nous devons choisir une solution de state management qui soit:
- Scalable (supportera des features futures)
- Testable (≥70% coverage requis)
- Performante (re-renders minimaux)
- Connue de l'équipe (délai court)

---

## Décision

Nous adoptons **Redux Toolkit** comme solution de state management global.

**Redux Toolkit** est la version moderne et officielle de Redux, avec:
- API simplifiée (slices, createAsyncThunk)
- Immer intégré (mutations immutables)
- DevTools pré-configurés
- Best practices par défaut

---

## Alternatives Considérées

### Alternative 1: Context API (React Built-in)
**Avantages**:
- ✅ Natif React (pas de dépendance externe)
- ✅ Simplicité pour des états simples
- ✅ Courbe d'apprentissage nulle

**Inconvénients**:
- ❌ Re-renders excessifs (tous les consommateurs du contexte)
- ❌ Pas de middleware (pas de side-effects propres)
- ❌ DevTools limités
- ❌ Difficile à tester (doit wrapper avec Provider)
- ❌ Ne scale pas pour des apps complexes

**Verdict**: ❌ Rejeté - Insuffisant pour notre cas d'usage

---

### Alternative 2: MobX
**Avantages**:
- ✅ Moins de boilerplate que Redux
- ✅ Réactivité automatique (observable)
- ✅ Performance (re-renders fins)

**Inconvénients**:
- ❌ Moins populaire que Redux (support communauté)
- ❌ Debugging plus difficile (mutations directes)
- ❌ Courbe d'apprentissage (decorators, observables)
- ❌ Moins standard en entreprise

**Verdict**: ⚠️ Acceptable mais Redux plus safe

---

### Alternative 3: Zustand
**Avantages**:
- ✅ Très simple et léger (< 1kb)
- ✅ API minimale
- ✅ Pas de Provider wrapper
- ✅ Performance excellente

**Inconvénients**:
- ❌ Moins de middleware/plugins (pas de Redux DevTools natif)
- ❌ Moins connu des évaluateurs
- ❌ Communauté plus petite
- ❌ Pas de time-travel debugging

**Verdict**: ❌ Rejeté - Trop récent pour un projet académique

---

### Alternative 4: Recoil
**Avantages**:
- ✅ Conçu par Facebook pour React
- ✅ Atomic state (granularité fine)
- ✅ Async natif

**Inconvénients**:
- ❌ Encore expérimental (v0.x)
- ❌ API complexe (atoms, selectors)
- ❌ Moins mature que Redux

**Verdict**: ❌ Rejeté - Pas assez stable

---

## Justification de la Décision

### Pourquoi Redux Toolkit ?

#### ✅ 1. Standard de l'Industrie
- **Utilisé par 60%+ des apps React/React Native** (State of JS 2023)
- **Documentation exhaustive** (officielle Redux)
- **Reconnu par les recruteurs** (atout CV pour projet académique)

#### ✅ 2. DevTools Puissants
```typescript
// Time-travel debugging gratuit
// Inspection de toutes les actions
// Persistance de l'état entre rechargements
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { auth, cart, menu, order },
  devTools: __DEV__, // Auto-activé en dev
});
```

**Bénéfice**: Debugging 3x plus rapide.

#### ✅ 3. Testabilité Exceptionnelle
```typescript
// Test d'un reducer (pure function)
describe('cartSlice', () => {
  it('should add item to cart', () => {
    const initialState = { items: [], total: 0 };
    const action = addToCart({ product, quantity: 2 });
    const newState = cartReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.total).toBe(20);
  });
});
```

**Résultat**: Tests unitaires simples → couverture ≥70% facilement.

#### ✅ 4. Intégration Clean Architecture
```typescript
// Redux comme couche Presentation
// Use Cases injectés via middleware
export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ product, qty }, { extra }) => {
    const { addToCartUseCase } = extra.useCases;
    await addToCartUseCase.execute(product, qty);
  }
);
```

**Principe**: Redux appelle les Use Cases du Domain (pas d'appel API direct).

#### ✅ 5. Performance avec Immer
```typescript
// Mutations "directes" mais immutables grâce à Immer
reducers: {
  incrementQuantity(state, action) {
    const item = state.items.find(i => i.id === action.payload);
    item.quantity++; // ✅ Immer gère l'immutabilité
  }
}
```

**Bénéfice**: Code lisible + performance.

#### ✅ 6. Middleware pour Side-Effects
```typescript
// Exemple: Logger toutes les actions
const loggerMiddleware = store => next => action => {
  console.log('[Redux]', action.type, action.payload);
  return next(action);
};

// Exemple: Sync panier avec AsyncStorage
const persistCartMiddleware = store => next => action => {
  const result = next(action);
  if (action.type.startsWith('cart/')) {
    const cart = store.getState().cart;
    AsyncStorage.setItem('cart', JSON.stringify(cart));
  }
  return result;
};
```

**Bénéfice**: Logique transverse centralisée.

---

## Architecture Redux dans le Projet

### Structure
```
src/presentation/state/
├── store.ts                 # Configuration store
└── slices/
    ├── authSlice.ts         # Auth state + actions
    ├── cartSlice.ts         # Cart state + actions
    ├── menuSlice.ts         # Menu state + actions
    └── orderSlice.ts        # Order state + actions
```

### Exemple: Cart Slice
```typescript
// presentation/state/slices/cartSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from '../../../core/entities/CartItem';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ product, options, quantity }, { extra }) => {
    const { addToCartUseCase } = extra.useCases;
    await addToCartUseCase.execute(product, options, quantity);
    return { product, options, quantity };
  }
);

export const loadCart = createAsyncThunk(
  'cart/load',
  async (_, { extra }) => {
    const { getCartUseCase } = extra.useCases;
    return await getCartUseCase.execute();
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Recharger le panier depuis le repository
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### Store Configuration
```typescript
// presentation/state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';

// Dependency Injection: Use Cases
import { createUseCases } from '../../core/di/useCaseFactory';

const useCases = createUseCases();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    order: orderReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { useCases },
      },
      serializableCheck: {
        // Ignore actions with functions (use cases)
        ignoredActionPaths: ['meta.arg', 'payload.useCase'],
      },
    }),
  devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Implémentation dans les Composants

### Hooks Typés
```typescript
// presentation/hooks/useAppDispatch.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../state/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Utilisation dans un Screen
```typescript
// presentation/screens/menu/ProductDetailScreen.tsx
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addToCart } from '../../state/slices/cartSlice';

export const ProductDetailScreen: React.FC = ({ route }) => {
  const { product } = route.params;
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.cart);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, options: selectedOptions, quantity }));
  };

  return (
    <View>
      {error && <ErrorMessage message={error} />}
      <Button onPress={handleAddToCart} loading={loading}>
        Add to Cart
      </Button>
    </View>
  );
};
```

---

## Compromis et Contraintes

### ⚠️ Compromis Acceptés

#### 1. Boilerplate
**Problème**: Création de slices, actions, types.
**Mitigation**: Redux Toolkit réduit déjà 70% du boilerplate classique de Redux.

#### 2. Courbe d'Apprentissage
**Problème**: Concepts Redux (actions, reducers, middleware).
**Mitigation**:
- Documentation interne (`docs/solutioning/redux-guide.md`)
- Exemples commentés
- Formation de 1h pour l'équipe

---

## Conséquences

### ✅ Avantages
1. **Prédictibilité**: Flux de données unidirectionnel clair
2. **Debugging**: Redux DevTools + time-travel
3. **Testabilité**: Reducers = pure functions
4. **Scalabilité**: Ajout de slices sans affecter les autres
5. **Compétence**: Redux = compétence valorisée sur le marché

### ⚠️ Inconvénients
1. **Complexité**: Plus lourd que Context API
2. **Performance**: Re-renders si selectors mal optimisés (solution: Reselect)

---

## Validation

### Critères de Succès
- [ ] Store configuré avec les 4 slices (auth, cart, menu, order)
- [ ] Async thunks utilisent les Use Cases (pas d'appel API direct)
- [ ] DevTools fonctionnels en dev
- [ ] Tests des reducers avec ≥80% coverage
- [ ] Pas de prop drilling (state accessible partout)

### Métriques
- **Nombre d'actions**: ~20-30 pour le MVP
- **Slices**: 4 (auth, cart, menu, order)
- **Middleware custom**: 1 (persist cart)

---

## Migration Future (si nécessaire)

Si Redux devient un bottleneck de performance:
1. **Optimiser les selectors** avec Reselect (memoization)
2. **Utiliser RTK Query** pour le cache API (évite les slices async)
3. **Migrer vers Zustand** (uniquement si vraiment nécessaire)

---

## Références

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [React Native + Redux Toolkit Guide](https://redux-toolkit.js.org/usage/usage-with-react-native)
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)

---

**Décision finale**: ✅ **ACCEPTÉE**

**Prochaines étapes**:
1. Installer Redux Toolkit (`npm install @reduxjs/toolkit react-redux`)
2. Configurer le store (J1 après-midi)
3. Créer les 4 slices de base
4. Former l'équipe (1h session)

**Auteur**: Tech Lead
**Révisé par**: Équipe Dev
**Date de révision**: 20 janvier 2026
