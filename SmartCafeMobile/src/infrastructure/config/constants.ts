/**
 * Application Constants
 *
 * Centralizes all magic numbers and constant values
 */

export const COLORS = {
  // Primary Colors
  primary: '#1E3A8A', // Deep blue (café premium)
  secondary: '#F59E0B', // Amber (CTA buttons)

  // Semantic Colors
  success: '#10B981', // Green
  error: '#EF4444', // Red
  warning: '#F59E0B', // Orange
  info: '#3B82F6', // Blue

  // Neutral Colors
  background: '#F9FAFB', // Light gray
  surface: '#FFFFFF', // White
  text: '#111827', // Almost black
  textSecondary: '#6B7280', // Gray
  border: '#E5E7EB', // Light gray
  disabled: '#9CA3AF', // Gray for disabled elements
  placeholder: '#9CA3AF', // Gray for placeholders

  // Status Colors
  pending: '#F59E0B',
  preparing: '#3B82F6',
  ready: '#10B981',
  completed: '#6B7280',
  cancelled: '#EF4444',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  // Aliases for compatibility
  small: 14,
  medium: 16,
  large: 18,
  h1: 32,
  h2: 24,
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const PRODUCT_CATEGORIES = {
  BEVERAGE: 'beverage',
  FOOD: 'food',
  DESSERT: 'dessert',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_TYPE = {
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  VALIDATION_ERROR: 'Données invalides. Veuillez vérifier vos informations.',
  PRODUCT_UNAVAILABLE: 'Ce produit n\'est plus disponible.',
  CANNOT_CANCEL_ORDER: 'Cette commande ne peut plus être annulée.',
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
};
