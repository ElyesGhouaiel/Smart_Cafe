/**
 * CartItem Entity
 *
 * Represents a product in the shopping cart (Domain Model)
 */

import {Product, ProductOption} from './Product';

export interface SelectedOption {
  option: ProductOption;
  quantity: number;
}

export interface CartItem {
  id: string; // Unique identifier for this cart item
  product: Product;
  quantity: number;
  options: SelectedOption[];
  unitPrice: number; // Base price + options
  totalPrice: number; // unitPrice * quantity
  notes?: string; // Special instructions
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemsCount: number;
}
