# 🏗️ Architecture Technique - Smart Café Mobile

> **Phase 3 de la BMad Method**: Solutioning
> **Pattern**: Clean Architecture (Uncle Bob)
> **Date**: 20 janvier 2026

---

## 📐 Vue d'Ensemble de l'Architecture

### Philosophie: Clean Architecture

L'application suit les principes de **Clean Architecture** pour garantir:
- **Indépendance des frameworks**: Le domain ne dépend pas de React Native
- **Testabilité**: Les use cases sont testables sans UI ni API
- **Indépendance de l'UI**: Changement d'UI sans affecter la logique métier
- **Indépendance de la base de données**: Changement de stockage facilité
- **Indépendance des services externes**: Stripe, Firebase remplaçables

### Principes SOLID Appliqués

- **S** (Single Responsibility): Une classe = une responsabilité
- **O** (Open/Closed): Extensible via interfaces, fermé à la modification
- **L** (Liskov Substitution): Implémentations interchangeables
- **I** (Interface Segregation): Interfaces spécifiques et minimales
- **D** (Dependency Inversion): Dépendre des abstractions (interfaces)

---

## 🎯 Diagramme de Dépendances (Layers)

```
┌─────────────────────────────────────────────────────┐
│          PRESENTATION LAYER (UI + State)            │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Screens    │  │Components│  │ Redux Store  │  │
│  └─────────────┘  └──────────┘  └──────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ depends on ↓
┌──────────────────┴──────────────────────────────────┐
│               DOMAIN LAYER (Business)               │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Entities   │  │Use Cases │  │ Repositories │  │
│  │  (models)   │  │ (logic)  │  │ (interfaces) │  │
│  └─────────────┘  └──────────┘  └──────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ implemented by ↓
┌──────────────────┴──────────────────────────────────┐
│               DATA LAYER (Infrastructure)           │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Repositories │  │DataSources│ │   Mappers    │  │
│  │   (impl)    │  │ API/Local │  │  DTO → Entity│  │
│  └─────────────┘  └──────────┘  └──────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ uses ↓
┌──────────────────┴──────────────────────────────────┐
│          INFRASTRUCTURE (External Services)         │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ ApiClient   │  │  Storage │  │Notifications │  │
│  │  (Axios)    │  │AsyncStor.│  │   (FCM)      │  │
│  └─────────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Règle d'Or**: Les dépendances pointent **vers l'intérieur** (vers le domain)

---

## 📁 Structure des Dossiers

```
smart-cafe-mobile/
├── src/
│   ├── core/                           # 🟦 DOMAIN LAYER
│   │   ├── entities/                   # Modèles métier (agnostiques)
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── CartItem.ts
│   │   │   └── OrderStatus.ts
│   │   │
│   │   ├── usecases/                   # Logique métier (cas d'usage)
│   │   │   ├── auth/
│   │   │   │   ├── LoginUseCase.ts
│   │   │   │   ├── RegisterUseCase.ts
│   │   │   │   └── LogoutUseCase.ts
│   │   │   ├── menu/
│   │   │   │   ├── GetMenuUseCase.ts
│   │   │   │   ├── GetProductDetailsUseCase.ts
│   │   │   │   └── SearchProductsUseCase.ts
│   │   │   ├── cart/
│   │   │   │   ├── AddToCartUseCase.ts
│   │   │   │   ├── RemoveFromCartUseCase.ts
│   │   │   │   └── ClearCartUseCase.ts
│   │   │   └── order/
│   │   │       ├── CreateOrderUseCase.ts
│   │   │       ├── GetOrderStatusUseCase.ts
│   │   │       └── CancelOrderUseCase.ts
│   │   │
│   │   └── repositories/               # Interfaces (contrats)
│   │       ├── IAuthRepository.ts
│   │       ├── IProductRepository.ts
│   │       ├── IOrderRepository.ts
│   │       └── ICartRepository.ts
│   │
│   ├── data/                           # 🟩 DATA LAYER
│   │   ├── repositories/               # Implémentations des repos
│   │   │   ├── AuthRepository.ts
│   │   │   ├── ProductRepository.ts
│   │   │   ├── OrderRepository.ts
│   │   │   └── CartRepository.ts
│   │   │
│   │   ├── datasources/                # Sources de données
│   │   │   ├── remote/
│   │   │   │   ├── api/
│   │   │   │   │   ├── ApiClient.ts
│   │   │   │   │   ├── interceptors.ts
│   │   │   │   │   └── endpoints.ts
│   │   │   │   ├── AuthRemoteDataSource.ts
│   │   │   │   ├── ProductRemoteDataSource.ts
│   │   │   │   └── OrderRemoteDataSource.ts
│   │   │   │
│   │   │   └── local/
│   │   │       ├── CartLocalDataSource.ts
│   │   │       ├── AuthLocalDataSource.ts (tokens)
│   │   │       └── ProductCacheDataSource.ts
│   │   │
│   │   └── models/                     # DTOs (Data Transfer Objects)
│   │       ├── UserDTO.ts
│   │       ├── ProductDTO.ts
│   │       ├── OrderDTO.ts
│   │       └── mappers/
│   │           ├── UserMapper.ts
│   │           ├── ProductMapper.ts
│   │           └── OrderMapper.ts
│   │
│   ├── presentation/                   # 🟨 PRESENTATION LAYER
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx       # Switch Auth/Main
│   │   │   ├── AuthNavigator.tsx       # Stack Login/Register
│   │   │   └── MainNavigator.tsx       # Tabs Menu/Orders/Profile
│   │   │
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   └── ForgotPasswordScreen.tsx
│   │   │   ├── menu/
│   │   │   │   ├── MenuScreen.tsx
│   │   │   │   └── ProductDetailScreen.tsx
│   │   │   ├── cart/
│   │   │   │   └── CartScreen.tsx
│   │   │   ├── order/
│   │   │   │   ├── CheckoutScreen.tsx
│   │   │   │   ├── OrderConfirmationScreen.tsx
│   │   │   │   ├── OrderTrackingScreen.tsx
│   │   │   │   └── OrderHistoryScreen.tsx
│   │   │   └── profile/
│   │   │       ├── ProfileScreen.tsx
│   │   │       └── SettingsScreen.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   └── ErrorMessage.tsx
│   │   │   ├── menu/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── CategoryTabs.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   └── order/
│   │   │       ├── OrderStatusBadge.tsx
│   │   │       └── OrderCard.tsx
│   │   │
│   │   ├── hooks/                      # Custom Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   └── useOrders.ts
│   │   │
│   │   ├── state/                      # Redux Toolkit
│   │   │   ├── store.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── cartSlice.ts
│   │   │       ├── menuSlice.ts
│   │   │       └── orderSlice.ts
│   │   │
│   │   └── styles/
│   │       ├── theme.ts                # Colors, spacing, typography
│   │       └── globalStyles.ts
│   │
│   ├── infrastructure/                 # 🟧 INFRASTRUCTURE
│   │   ├── config/
│   │   │   ├── env.ts                  # Environment variables
│   │   │   └── constants.ts
│   │   │
│   │   ├── services/
│   │   │   ├── StorageService.ts       # AsyncStorage wrapper
│   │   │   ├── NotificationService.ts  # FCM wrapper
│   │   │   └── StripeService.ts        # Stripe SDK wrapper
│   │   │
│   │   └── utils/
│   │       ├── validation.ts           # Input validation
│   │       ├── formatters.ts           # Date, price formatters
│   │       └── logger.ts               # Logging (Sentry optionnel)
│   │
│   └── App.tsx                         # Entry point
│
├── __tests__/                          # Tests
│   ├── unit/
│   │   ├── entities/
│   │   ├── usecases/
│   │   └── utils/
│   ├── integration/
│   │   ├── repositories/
│   │   └── api/
│   └── components/
│       └── screens/
│
├── android/                            # Android native
├── ios/                                # iOS native
│
├── .env                                # Environment variables
├── .eslintrc.js
├── .prettierrc.js
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## 🔄 Flux de Données (Data Flow)

### Exemple: Ajouter un Produit au Panier

```
1. User clicks "Add to Cart" (UI)
   ↓
2. ProductDetailScreen.tsx
   → dispatch(addToCart(product, options, quantity))
   ↓
3. Redux cartSlice.ts
   → calls AddToCartUseCase.execute()
   ↓
4. AddToCartUseCase.ts (Domain)
   → validates business rules
   → calls ICartRepository.addItem()
   ↓
5. CartRepository.ts (Data)
   → uses CartLocalDataSource.save()
   ↓
6. CartLocalDataSource.ts (Data)
   → saves to AsyncStorage
   ↓
7. Success/Error bubbles up
   ↓
8. Redux updates state
   ↓
9. UI re-renders (cart badge updates)
```

**Principe**: L'UI n'appelle JAMAIS directement une API ou un service. Elle passe toujours par:
- **Redux** (state management)
- **Use Case** (business logic)
- **Repository** (abstraction)
- **DataSource** (implementation)

---

## 🧩 Composants Clés (Detailed Design)

### 1. Domain Layer (core/)

#### Entities (Modèles Métier)

```typescript
// core/entities/Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  available: boolean;
  preparationTime: number; // minutes
  allergens: string[];
  options: ProductOption[];
}

export enum ProductCategory {
  BEVERAGE = 'beverage',
  FOOD = 'food',
  DESSERT = 'dessert',
}

export interface ProductOption {
  id: string;
  name: string;
  choices: ProductOptionChoice[];
}

export interface ProductOptionChoice {
  id: string;
  name: string;
  priceModifier: number;
}
```

#### Use Cases (Logique Métier)

```typescript
// core/usecases/cart/AddToCartUseCase.ts
import { ICartRepository } from '../../repositories/ICartRepository';
import { Product } from '../../entities/Product';
import { CartItem } from '../../entities/CartItem';

export class AddToCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(
    product: Product,
    options: SelectedOption[],
    quantity: number
  ): Promise<void> {
    // Business rules validation
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    if (!product.available) {
      throw new Error('Product is not available');
    }

    const cartItem: CartItem = {
      id: generateId(),
      product,
      options,
      quantity,
      totalPrice: this.calculatePrice(product, options, quantity),
    };

    await this.cartRepository.addItem(cartItem);
  }

  private calculatePrice(
    product: Product,
    options: SelectedOption[],
    quantity: number
  ): number {
    let price = product.price;
    options.forEach(opt => {
      price += opt.priceModifier;
    });
    return price * quantity;
  }
}
```

#### Repositories (Interfaces)

```typescript
// core/repositories/ICartRepository.ts
import { CartItem } from '../entities/CartItem';

export interface ICartRepository {
  addItem(item: CartItem): Promise<void>;
  removeItem(itemId: string): Promise<void>;
  updateQuantity(itemId: string, quantity: number): Promise<void>;
  getItems(): Promise<CartItem[]>;
  clear(): Promise<void>;
  getTotal(): Promise<number>;
}
```

---

### 2. Data Layer (data/)

#### Repository Implementation

```typescript
// data/repositories/CartRepository.ts
import { ICartRepository } from '../../core/repositories/ICartRepository';
import { CartItem } from '../../core/entities/CartItem';
import { CartLocalDataSource } from '../datasources/local/CartLocalDataSource';

export class CartRepository implements ICartRepository {
  constructor(private localDataSource: CartLocalDataSource) {}

  async addItem(item: CartItem): Promise<void> {
    const items = await this.localDataSource.getItems();
    items.push(item);
    await this.localDataSource.saveItems(items);
  }

  async removeItem(itemId: string): Promise<void> {
    let items = await this.localDataSource.getItems();
    items = items.filter(item => item.id !== itemId);
    await this.localDataSource.saveItems(items);
  }

  async getItems(): Promise<CartItem[]> {
    return await this.localDataSource.getItems();
  }

  async clear(): Promise<void> {
    await this.localDataSource.clear();
  }

  async getTotal(): Promise<number> {
    const items = await this.localDataSource.getItems();
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}
```

#### DataSource

```typescript
// data/datasources/local/CartLocalDataSource.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../../../core/entities/CartItem';

const CART_STORAGE_KEY = '@smart_cafe_cart';

export class CartLocalDataSource {
  async saveItems(items: CartItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      throw new Error('Failed to save cart to storage');
    }
  }

  async getItems(): Promise<CartItem[]> {
    try {
      const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      throw new Error('Failed to load cart from storage');
    }
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  }
}
```

---

### 3. Presentation Layer (presentation/)

#### Redux Slice

```typescript
// presentation/state/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../../core/entities/CartItem';
import { AddToCartUseCase } from '../../../core/usecases/cart/AddToCartUseCase';

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
    const useCase = extra.useCases.addToCart; // Dependency injection
    await useCase.execute(product, options, quantity);
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addToCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Reload items from repository
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      });
  },
});

export default cartSlice.reducer;
```

#### Screen Component

```typescript
// presentation/screens/menu/ProductDetailScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../state/slices/cartSlice';

export const ProductDetailScreen: React.FC = ({ route }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, options: selectedOptions, quantity }));
  };

  return (
    <View>
      <Image source={{ uri: product.image }} />
      <Text>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text>{product.price}€</Text>

      {/* Options selection UI */}

      <TouchableOpacity onPress={handleAddToCart} disabled={loading}>
        <Text>{loading ? 'Adding...' : 'Add to Cart'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 🔐 Sécurité

### Authentification JWT

```typescript
// data/datasources/remote/api/interceptors.ts
import axios from 'axios';
import { AuthLocalDataSource } from '../../local/AuthLocalDataSource';

export const setupInterceptors = (apiClient: AxiosInstance) => {
  // Request interceptor: Add JWT token
  apiClient.interceptors.request.use(
    async config => {
      const token = await AuthLocalDataSource.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor: Handle 401 (refresh token)
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AuthLocalDataSource.getRefreshToken();
          const { data } = await axios.post('/auth/refresh', { refreshToken });

          await AuthLocalDataSource.saveTokens(
            data.token,
            data.refreshToken
          );

          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed → Logout
          await AuthLocalDataSource.clearTokens();
          // Navigate to login
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
```

### Stockage Sécurisé

```typescript
// infrastructure/services/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
// For production: Use react-native-keychain for sensitive data

export class StorageService {
  async saveSecure(key: string, value: string): Promise<void> {
    // TODO: Use Keychain for tokens in production
    await AsyncStorage.setItem(key, value);
  }

  async getSecure(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async removeSecure(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}
```

---

## 📊 Gestion d'État (Redux Toolkit)

### Store Configuration

```typescript
// presentation/state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';

// Dependency Injection: Inject use cases
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
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🧪 Testabilité

### Test d'un Use Case (Unitaire)

```typescript
// __tests__/unit/usecases/AddToCartUseCase.test.ts
import { AddToCartUseCase } from '../../../src/core/usecases/cart/AddToCartUseCase';
import { ICartRepository } from '../../../src/core/repositories/ICartRepository';

// Mock du repository
class MockCartRepository implements ICartRepository {
  private items: CartItem[] = [];

  async addItem(item: CartItem): Promise<void> {
    this.items.push(item);
  }

  async getItems(): Promise<CartItem[]> {
    return this.items;
  }

  // ... autres méthodes
}

describe('AddToCartUseCase', () => {
  let useCase: AddToCartUseCase;
  let mockRepo: MockCartRepository;

  beforeEach(() => {
    mockRepo = new MockCartRepository();
    useCase = new AddToCartUseCase(mockRepo);
  });

  it('should add product to cart with correct quantity', async () => {
    const product = createMockProduct();
    await useCase.execute(product, [], 2);

    const items = await mockRepo.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should throw error if quantity is zero', async () => {
    const product = createMockProduct();
    await expect(useCase.execute(product, [], 0)).rejects.toThrow(
      'Quantity must be positive'
    );
  });
});
```

---

## 🚀 Performance

### Optimisations

1. **Images**: Progressive loading (placeholder → low-res → HD)
2. **Lists**: `FlatList` avec `keyExtractor` et `getItemLayout`
3. **Memoization**: `React.memo` pour composants, `useMemo` pour calculs
4. **Navigation**: Lazy loading des écrans
5. **API Caching**: React Query (optionnel) ou cache manuel

### Exemple: Liste Produits Optimisée

```typescript
const ProductList: React.FC = React.memo(({ products }) => {
  const renderItem = useCallback(
    ({ item }) => <ProductCard product={item} />,
    []
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
});
```

---

## 📚 Références & Patterns

### Design Patterns Utilisés

| Pattern | Où | Pourquoi |
|---------|-----|----------|
| **Repository** | data/repositories | Abstraction des sources de données |
| **Dependency Injection** | core/di | Testabilité et découplage |
| **Factory** | core/di/useCaseFactory | Création centralisée des use cases |
| **Adapter** | data/models/mappers | Conversion DTO ↔ Entity |
| **Observer** | Redux | Réactivité de l'UI |
| **Singleton** | ApiClient, Store | Instance unique |

### Anti-Patterns à Éviter

- ❌ **God Object**: Un composant qui fait tout
- ❌ **Spaghetti Code**: Logique métier dans l'UI
- ❌ **Magic Numbers**: Utiliser des constantes
- ❌ **Tight Coupling**: Dépendre d'implémentations concrètes
- ❌ **Premature Optimization**: Optimiser sans mesurer

---

**📅 Date de création**: 20 janvier 2026
**✍️ Auteur**: Tech Lead + Équipe Mobile
**🔄 Version**: 1.0
