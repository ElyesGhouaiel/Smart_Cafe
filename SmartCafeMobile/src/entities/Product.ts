/**
 * Product Entity
 *
 * Represents a product in the café menu (Domain Model)
 */

export type ProductCategory = 'beverage' | 'food' | 'dessert';

export interface ProductOption {
  id: string;
  name: string;
  choices: ProductOptionChoice[];
}

export interface ProductOptionChoice {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  available: boolean;
  preparationTime: number; // in minutes
  allergens: string[];
  tags?: string[]; // e.g., ['vegetarian', 'vegan', 'gluten-free']
  options?: ProductOption[];
}

export interface ProductDetails extends Product {
  images?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
