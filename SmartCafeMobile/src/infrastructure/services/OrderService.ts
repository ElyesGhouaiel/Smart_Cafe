import {HttpService} from './HttpService';
import {API_ENDPOINTS} from '../config/api';
import {AuthService} from './AuthService';
import {Cart} from '../../entities/CartItem';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  tableId: number;
  items: OrderItem[];
  notes?: string;
}

// API response format (snake_case from backend)
interface ApiOrder {
  id: number;
  order_number: string;
  table_id: number;
  user_id: number;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Domain format (camelCase for mobile app)
export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  userId: number;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class OrderService {
  private static mapApiOrderToDomain(apiOrder: ApiOrder): Order {
    return {
      id: apiOrder.id,
      orderNumber: apiOrder.order_number,
      tableId: apiOrder.table_id,
      userId: apiOrder.user_id,
      status: apiOrder.status,
      totalAmount: apiOrder.total_amount || 0,
      notes: apiOrder.notes || undefined,
      createdAt: apiOrder.created_at,
      updatedAt: apiOrder.updated_at,
    };
  }

  static async createOrder(cart: Cart, tableId: number, notes?: string): Promise<Order> {
    try {
      console.log('[OrderService] Creating order...');

      // Check authentication
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Vous devez être connecté pour passer une commande');
      }

      // Convert CartItems to OrderItems (Domain → API)
      const items: OrderItem[] = cart.items.map(cartItem => ({
        productId: Number(cartItem.product.id), // Convert string to number
        quantity: cartItem.quantity,
      }));

      // Create order request
      const orderRequest: CreateOrderRequest = {
        tableId,
        items,
        notes,
      };

      // Send to backend with authentication
      const apiOrder = await HttpService.post<ApiOrder>(
        API_ENDPOINTS.ORDERS.CREATE,
        orderRequest,
        {
          headers: HttpService.getAuthHeaders(token),
        },
      );

      // Map API response to Domain model
      const order = this.mapApiOrderToDomain(apiOrder);

      console.log('[OrderService] Order created:', order.orderNumber);

      return order;
    } catch (error: any) {
      console.error('[OrderService] Create order failed:', error);
      throw error;
    }
  }

  static async getOrders(): Promise<Order[]> {
    try {
      console.log('[OrderService] Fetching orders...');

      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Vous devez être connecté');
      }

      const apiOrders = await HttpService.get<ApiOrder[]>(
        API_ENDPOINTS.ORDERS.LIST,
        {
          headers: HttpService.getAuthHeaders(token),
        },
      );

      // Map all API orders to Domain orders
      const orders = apiOrders.map(this.mapApiOrderToDomain);

      console.log('[OrderService] Orders fetched:', orders.length);

      return orders;
    } catch (error) {
      console.error('[OrderService] Get orders failed:', error);
      throw error;
    }
  }

  static async getOrder(id: number): Promise<Order> {
    try {
      console.log('[OrderService] Fetching order:', id);

      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Vous devez être connecté');
      }

      const endpoint = API_ENDPOINTS.ORDERS.DETAIL.replace(':id', String(id));
      const apiOrder = await HttpService.get<ApiOrder>(endpoint, {
        headers: HttpService.getAuthHeaders(token),
      });

      // Map API response to Domain model
      const order = this.mapApiOrderToDomain(apiOrder);

      console.log('[OrderService] Order fetched:', order.orderNumber);

      return order;
    } catch (error) {
      console.error('[OrderService] Get order failed:', error);
      throw error;
    }
  }
}
