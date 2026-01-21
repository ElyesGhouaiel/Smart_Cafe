/**
 * Order Entity
 *
 * Represents a customer order (Domain Model)
 */

import {CartItem} from './CartItem';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  instructions?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  options: Array<{
    optionId: string;
    choiceId: string;
    name: string;
    choiceName: string;
    priceModifier: number;
  }>;
  subtotal: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
  orderType: OrderType;
  deliveryAddress?: DeliveryAddress;
  paymentId?: string; // Stripe Payment Intent ID
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletionTime?: Date;
  completedAt?: Date;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  estimatedCompletionTime?: Date;
  itemsCount: number;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    options: Array<{
      optionId: string;
      choiceId: string;
    }>;
    notes?: string;
  }>;
  orderType: OrderType;
  scheduledFor?: Date;
  deliveryAddress?: DeliveryAddress;
  paymentMethodId: string; // Stripe Payment Method ID
}
