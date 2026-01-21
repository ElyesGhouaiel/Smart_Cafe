import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {CartItemCard} from '../components/CartItemCard';
import {Cart, CartItem} from '../../entities/CartItem';
import {COLORS, SPACING} from '../../infrastructure/config/constants';
import {formatPrice} from '../../infrastructure/utils/formatters';
import {CartService} from '../../infrastructure/services/CartService';
import {OrderService} from '../../infrastructure/services/OrderService';
import {styles} from './CartScreen.styles';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    itemsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
    // Set interval to refresh cart every 2 seconds (will catch updates from MenuScreen)
    const interval = setInterval(() => {
      loadCart();
    }, 2000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const loadCart = async () => {
    try {
      const loadedCart = await CartService.getCart();
      setCart(loadedCart);
    } catch (error) {
      console.error('[CartScreen] Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item: CartItem) => {
    try {
      const newQuantity = item.quantity + 1;
      const updatedCart = await CartService.updateQuantity(item.id, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la quantité');
    }
  };

  const handleDecrease = async (item: CartItem) => {
    try {
      const newQuantity = item.quantity - 1;
      if (newQuantity <= 0) {
        // Confirm removal
        Alert.alert(
          'Supprimer',
          `Voulez-vous retirer ${item.product.name} du panier ?`,
          [
            {text: 'Annuler', style: 'cancel'},
            {
              text: 'Supprimer',
              style: 'destructive',
              onPress: () => handleRemove(item),
            },
          ],
        );
        return;
      }
      const updatedCart = await CartService.updateQuantity(item.id, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la quantité');
    }
  };

  const handleRemove = async (item: CartItem) => {
    try {
      const updatedCart = await CartService.removeItem(item.id);
      setCart(updatedCart);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer le produit');
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des produits avant de commander');
      return;
    }

    // Show table selection modal
    setShowTableModal(true);
  };

  const confirmOrderWithTable = async () => {
    if (!selectedTable) {
      Alert.alert('Table requise', 'Veuillez sélectionner un numéro de table');
      return;
    }

    setShowTableModal(false);
    setCheckoutLoading(true);

    try {
      // Create order via API with selected table
      const order = await OrderService.createOrder(cart, selectedTable);

      // Clear cart after successful order
      await CartService.clearCart();
      setCart({
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        itemsCount: 0,
      });
      setSelectedTable(null);

      // Show success message
      Alert.alert(
        '✓ Commande validée',
        `Votre commande #${order.orderNumber} a été enregistrée pour la table ${selectedTable}.\n\nTotal : ${formatPrice(cart.total)}\n\nVous pouvez suivre votre commande dans l'historique.`,
        [{text: 'OK'}],
      );
    } catch (error: any) {
      console.error('[CartScreen] Checkout failed:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de passer la commande',
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.emptyContainer, {paddingTop: insets.top}]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.emptySubtitle}>Chargement du panier...</Text>
      </View>
    );
  }

  if (cart.items.length === 0) {
    return (
      <View style={[styles.emptyContainer, {paddingTop: insets.top}]}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Votre panier est vide</Text>
        <Text style={styles.emptySubtitle}>
          Ajoutez des produits depuis le menu
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + SPACING.sm}]}>
        <Text style={styles.title}>🛒 Panier</Text>
        <Text style={styles.subtitle}>{cart.itemsCount} article(s)</Text>
      </View>

      {/* Table Selection Modal */}
      <Modal
        visible={showTableModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTableModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez votre table</Text>
            <Text style={styles.modalSubtitle}>Choisissez le numéro de table où vous êtes assis</Text>

            <View style={styles.tablesGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tableNum => (
                <TouchableOpacity
                  key={tableNum}
                  style={[
                    styles.tableButton,
                    selectedTable === tableNum && styles.tableButtonSelected,
                  ]}
                  onPress={() => setSelectedTable(tableNum)}>
                  <Text style={[
                    styles.tableButtonText,
                    selectedTable === tableNum && styles.tableButtonTextSelected,
                  ]}>
                    {tableNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Annuler"
                onPress={() => {
                  setShowTableModal(false);
                  setSelectedTable(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Valider"
                onPress={confirmOrderWithTable}
                style={styles.modalButton}
                disabled={!selectedTable}
              />
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={cart.items}
        renderItem={({item}) => (
          <CartItemCard
            item={item}
            onIncrease={() => handleIncrease(item)}
            onDecrease={() => handleDecrease(item)}
            onRemove={() => handleRemove(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{formatPrice(cart.subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TVA (20%)</Text>
          <Text style={styles.summaryValue}>{formatPrice(cart.tax)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(cart.total)}</Text>
        </View>

        <Button
          title={`Commander ${formatPrice(cart.total)}`}
          onPress={handleCheckout}
          loading={checkoutLoading}
        />
      </View>
    </View>
  );
};
