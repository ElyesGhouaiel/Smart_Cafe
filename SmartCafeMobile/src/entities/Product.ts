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
  preparationTime: number;
  allergens: string[];
  tags?: string[];
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
