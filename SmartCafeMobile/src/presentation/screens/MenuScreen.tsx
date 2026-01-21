/**
 * Menu Screen
 *
 * Display available products with search and filters
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProductCard} from '../components/ProductCard';
import {Product} from '../../entities/Product';
import {COLORS, SPACING, FONT_SIZES} from '../../infrastructure/config/constants';
import {CartService} from '../../infrastructure/services/CartService';
import {ProductService} from '../../infrastructure/services/ProductService';

export const MenuScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Fetch products from backend API
      const fetchedProducts = await ProductService.getProducts();
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error('[MenuScreen] Load products failed:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de charger les produits',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    // TODO: Navigate to ProductDetail (for later)
    Alert.alert(product.name, product.description);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await CartService.addItem(product, 1);

      // Show feedback
      if (Platform.OS === 'android') {
        ToastAndroid.show(`${product.name} ajouté au panier`, ToastAndroid.SHORT);
      } else {
        Alert.alert('✓ Ajouté', `${product.name} a été ajouté au panier`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le produit au panier');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement du menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + SPACING.sm}]}>
        <Text style={styles.title}>☕ Menu</Text>
        <Text style={styles.subtitle}>{products.length} produits disponibles</Text>
      </View>

      <FlatList
        data={products}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            onAddToCart={() => handleAddToCart(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: '700',
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.background,
    opacity: 0.8,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
});
