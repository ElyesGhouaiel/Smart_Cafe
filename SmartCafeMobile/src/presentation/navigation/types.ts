/**
 * Navigation Types
 *
 * Type definitions for React Navigation
 */

import {Product} from '../../entities/Product';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Menu: undefined;
  ProductDetail: {product: Product};
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: {orderId: string};
};
