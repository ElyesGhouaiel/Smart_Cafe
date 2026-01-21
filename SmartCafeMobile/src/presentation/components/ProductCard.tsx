import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Product} from '../../entities/Product';
import {COLORS, SPACING, FONT_SIZES} from '../../infrastructure/config/constants';
import {formatPrice} from '../../infrastructure/utils/formatters';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({product, onPress, onAddToCart}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!product.available}>
        <Image source={{uri: product.image}} style={styles.image} />
        {!product.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Indisponible</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.preparationTime}>⏱️ {product.preparationTime} min</Text>
          </View>
        </View>
      </TouchableOpacity>

      {product.available && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddToCart}
          activeOpacity={0.8}>
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.border,
  },
  unavailableBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  unavailableText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
  },
  preparationTime: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    margin: SPACING.md,
    marginTop: 0,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
