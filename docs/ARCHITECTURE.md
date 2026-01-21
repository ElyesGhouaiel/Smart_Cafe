# 🏗️ Architecture - Smart Café Mobile

> Clean Architecture + SOLID + TypeScript

---

## 📊 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│          PRESENTATION (UI + Redux State)            │
│   Screens → Components → Navigation → Redux Store  │
└──────────────────┬──────────────────────────────────┘
                   ↓ depends on
┌──────────────────────────────────────────────────────┐
│               DOMAIN (Business Logic)                │
│      Entities ← Use Cases → IRepositories            │
└──────────────────┬──────────────────────────────────┘
                   ↓ implemented by
┌──────────────────────────────────────────────────────┐
│               DATA (Data Access)                     │
│    Repositories → DataSources (API + Local)          │
└──────────────────┬──────────────────────────────────┘
                   ↓ uses
┌──────────────────────────────────────────────────────┐
│          INFRASTRUCTURE (External Services)          │
│      ApiClient | Storage | Notifications            │
└──────────────────────────────────────────────────────┘
```

**Règle**: Les dépendances pointent **vers l'intérieur** (vers le Domain)

---

## 📁 Structure des Dossiers

```
src/
├── core/                       # 🟦 DOMAIN LAYER
│   ├── entities/               # Product, Order, User, CartItem
│   ├── usecases/              # LoginUseCase, AddToCartUseCase
│   └── repositories/          # IProductRepository, IOrderRepository
│
├── data/                       # 🟩 DATA LAYER
│   ├── repositories/           # ProductRepository (implémentation)
│   ├── datasources/
│   │   ├── remote/            # API calls (Axios)
│   │   └── local/             # AsyncStorage
│   └── models/
│       └── mappers/           # DTO ↔ Entity converters
│
├── presentation/               # 🟨 PRESENTATION LAYER
│   ├── navigation/            # RootNavigator, AuthNavigator
│   ├── screens/               # LoginScreen, MenuScreen, CartScreen
│   ├── components/            # Button, ProductCard, CartItem
│   ├── hooks/                 # useAuth, useCart
│   ├── state/
│   │   ├── store.ts           # Redux store config
│   │   └── slices/            # authSlice, cartSlice
│   └── styles/                # theme.ts, globalStyles.ts
│
└── infrastructure/            # 🟧 INFRASTRUCTURE
    ├── config/                # env.ts, constants.ts
    ├── services/              # StorageService, NotificationService
    └── utils/                 # validation.ts, formatters.ts
```

---

## 🔄 Flux de Données (Data Flow)

### Exemple: Ajouter un Produit au Panier

```
1. User clicks "Add to Cart" button
   ↓
2. ProductDetailScreen.tsx
   → dispatch(addToCart(product, options, qty))
   ↓
3. Redux cartSlice.ts (createAsyncThunk)
   → calls AddToCartUseCase.execute()
   ↓
4. AddToCartUseCase.ts (Domain)
   → validates business rules (qty > 0, product available)
   → calls ICartRepository.addItem()
   ↓
5. CartRepository.ts (Data)
   → uses CartLocalDataSource.save()
   ↓
6. CartLocalDataSource.ts (Data)
   → AsyncStorage.setItem()
   ↓
7. Success → Redux state updated
   ↓
8. UI re-renders (cart badge updates)
```

---

## 🧩 Composants Clés

### 1. Domain Layer (core/)

**Responsabilité**: Logique métier pure, indépendante de React Native

#### Entities
```typescript
// core/entities/Product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  available: boolean;
  options: ProductOption[];
}
```

#### Use Cases
```typescript
// core/usecases/cart/AddToCartUseCase.ts
export class AddToCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  async execute(product: Product, qty: number): Promise<void> {
    // Business rules validation
    if (qty <= 0) throw new Error('Quantity must be positive');
    if (!product.available) throw new Error('Product unavailable');

    const cartItem: CartItem = {
      id: generateId(),
      product,
      quantity: qty,
      totalPrice: product.price * qty,
    };

    await this.cartRepo.addItem(cartItem);
  }
}
```

#### Repositories (Interfaces)
```typescript
// core/repositories/ICartRepository.ts
export interface ICartRepository {
  addItem(item: CartItem): Promise<void>;
  removeItem(itemId: string): Promise<void>;
  getItems(): Promise<CartItem[]>;
  clear(): Promise<void>;
}
```

---

### 2. Data Layer (data/)

**Responsabilité**: Accès aux données (API + Local Storage)

#### Repository Implementation
```typescript
// data/repositories/CartRepository.ts
export class CartRepository implements ICartRepository {
  constructor(private localDataSource: CartLocalDataSource) {}

  async addItem(item: CartItem): Promise<void> {
    const items = await this.localDataSource.getItems();
    items.push(item);
    await this.localDataSource.saveItems(items);
  }

  // ... autres méthodes
}
```

#### DataSource
```typescript
// data/datasources/local/CartLocalDataSource.ts
export class CartLocalDataSource {
  async saveItems(items: CartItem[]): Promise<void> {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  async getItems(): Promise<CartItem[]> {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  }
}
```

---

### 3. Presentation Layer (presentation/)

**Responsabilité**: UI et gestion d'état global (Redux)

#### Redux Slice
```typescript
// presentation/state/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ product, qty }, { extra }) => {
    const { addToCartUseCase } = extra.useCases;
    await addToCartUseCase.execute(product, qty);
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addToCart.pending, state => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Reload cart from repository
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
```

#### Screen Component
```typescript
// presentation/screens/menu/ProductDetailScreen.tsx
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addToCart } from '../../state/slices/cartSlice';

export const ProductDetailScreen: React.FC = ({ route }) => {
  const { product } = route.params;
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  return (
    <View>
      <Image source={{ uri: product.image }} />
      <Text>{product.name}</Text>
      <Text>{product.price}€</Text>
      <Button onPress={handleAddToCart}>Add to Cart</Button>
    </View>
  );
};
```

---

### 4. Infrastructure (infrastructure/)

**Responsabilité**: Configuration et services externes

#### API Client
```typescript
// infrastructure/services/ApiClient.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/env';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors pour JWT (voir ADR-003)
apiClient.interceptors.request.use(async config => {
  const token = await AuthStorageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔐 Sécurité

### JWT Authentication
- **Access Token**: 15 min (stocké AsyncStorage)
- **Refresh Token**: 7 jours (révocable)
- **Auto-refresh**: Interceptor Axios sur 401

### Stockage Sécurisé
- Tokens en AsyncStorage (production: react-native-keychain)
- Pas de tokens dans Redux (évite exposition DevTools)
- HTTPS obligatoire

---

## 🧪 Testabilité

### Tests Unitaires (Use Cases)
```typescript
describe('AddToCartUseCase', () => {
  it('should throw error if quantity is zero', async () => {
    const mockRepo = new MockCartRepository();
    const useCase = new AddToCartUseCase(mockRepo);

    await expect(useCase.execute(product, 0)).rejects.toThrow(
      'Quantity must be positive'
    );
  });
});
```

### Tests Composants
```typescript
import { render, fireEvent } from '@testing-library/react-native';

test('ProductCard shows product name and price', () => {
  const { getByText } = render(<ProductCard product={mockProduct} />);
  expect(getByText('Espresso')).toBeTruthy();
  expect(getByText('2.50€')).toBeTruthy();
});
```

---

## 📊 Principes SOLID

| Principe | Application |
|----------|-------------|
| **S** - Single Responsibility | Un composant = une responsabilité (ProductCard affiche, n'appelle pas API) |
| **O** - Open/Closed | Extensible via interfaces (IRepository), fermé à modification |
| **L** - Liskov Substitution | CartRepository remplaçable par MockCartRepository |
| **I** - Interface Segregation | ICartRepository minimal (pas de méthodes inutiles) |
| **D** - Dependency Inversion | Use Cases dépendent d'IRepository (abstraction), pas implémentation |

---

## 🚀 Performance

### Optimisations
- **Images**: Progressive loading + caching
- **Lists**: FlatList avec virtualisation
- **Memoization**: React.memo + useMemo
- **Navigation**: Lazy loading des écrans

---

## 📚 Références

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Documentation complète**: `docs/solutioning/architecture.md`
