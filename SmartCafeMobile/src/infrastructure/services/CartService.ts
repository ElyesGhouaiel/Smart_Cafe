import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cart, CartItem} from '../../entities/CartItem';
import {Product} from '../../entities/Product';

const CART_KEY = '@smart_cafe_cart';

export class CartService {
  static async getCart(): Promise<Cart> {
    try {
      const cartJson = await AsyncStorage.getItem(CART_KEY);
      if (!cartJson) {
        return {
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          itemsCount: 0,
        };
      }
      return JSON.parse(cartJson);
    } catch (error) {
      console.error('[CartService] Get cart failed:', error);
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        itemsCount: 0,
      };
    }
  }

  private static calculateTotals(items: CartItem[]): Pick<Cart, 'subtotal' | 'tax' | 'total' | 'itemsCount'> {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.2; // 20% TVA
    const total = subtotal + tax;
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {subtotal, tax, total, itemsCount};
  }

  private static async saveCart(cart: Cart): Promise<void> {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('[CartService] Save cart failed:', error);
      throw error;
    }
  }

  static async addItem(product: Product, quantity: number = 1): Promise<Cart> {
    try {
      const cart = await this.getCart();

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.id === product.id,
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].totalPrice =
          cart.items[existingItemIndex].product.price *
          cart.items[existingItemIndex].quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          totalPrice: product.price * quantity,
          selectedOptions: [],
        };
        cart.items.push(newItem);
      }

      // Recalculate totals
      const totals = this.calculateTotals(cart.items);
      const updatedCart: Cart = {...cart, ...totals};

      await this.saveCart(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error('[CartService] Add item failed:', error);
      throw error;
    }
  }

  static async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    try {
      const cart = await this.getCart();

      const itemIndex = cart.items.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].totalPrice =
        cart.items[itemIndex].product.price * quantity;

      // Recalculate totals
      const totals = this.calculateTotals(cart.items);
      const updatedCart: Cart = {...cart, ...totals};

      await this.saveCart(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error('[CartService] Update quantity failed:', error);
      throw error;
    }
  }

  static async removeItem(itemId: string): Promise<Cart> {
    try {
      const cart = await this.getCart();

      cart.items = cart.items.filter(item => item.id !== itemId);

      // Recalculate totals
      const totals = this.calculateTotals(cart.items);
      const updatedCart: Cart = {...cart, ...totals};

      await this.saveCart(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error('[CartService] Remove item failed:', error);
      throw error;
    }
  }

  static async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_KEY);
      console.log('[CartService] Cart cleared');
    } catch (error) {
      console.error('[CartService] Clear cart failed:', error);
      throw error;
    }
  }
}
