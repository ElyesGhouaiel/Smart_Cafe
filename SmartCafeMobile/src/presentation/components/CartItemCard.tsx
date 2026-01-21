/**
 * CartItemCard Component
 *
 * Card component to display cart item with quantity controls
 */

import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {CartItem} from '../../entities/CartItem';
import {COLORS, SPACING, FONT_SIZES} from '../../infrastructure/config/constants';
import {formatPrice} from '../../infrastructure/utils/formatters';

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: item.product.image}} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.product.name}
          </Text>
          <TouchableOpacity onPress={onRemove}>
            <Text style={styles.removeButton}>❌</Text>
          </TouchableOpacity>
        </View>
        {item.options && item.options.length > 0 && (
          <Text style={styles.options} numberOfLines={1}>
            {item.options.map(opt => opt.option.name).join(', ')}
          </Text>
        )}
        <View style={styles.footer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onDecrease}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onIncrease}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>{formatPrice(item.totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.border,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  name: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  removeButton: {
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.sm,
  },
  options: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  quantity: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
