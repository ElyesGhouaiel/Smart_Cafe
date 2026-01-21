import {HttpService} from './HttpService';
import {API_ENDPOINTS, API_CONFIG} from '../config/api';
import {Product, ProductCategory} from '../../entities/Product';

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_name: string;
  image_url: string | null;
  is_available: number;
  preparation_time: number;
  allergens: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export class ProductService {
  private static mapApiProductToDomain(apiProduct: ApiProduct): Product {
    const categoryMap: Record<string, ProductCategory> = {
      'boissons chaudes': 'beverage',
      'boissons froides': 'beverage',
      boissons: 'beverage',
      boisson: 'beverage',
      beverage: 'beverage',
      café: 'beverage',
      coffee: 'beverage',
      pâtisseries: 'food',
      'patisseries': 'food',
      nourriture: 'food',
      food: 'food',
      salé: 'food',
      sale: 'food',
      dessert: 'dessert',
      desserts: 'dessert',
    };

    const category = apiProduct.category_name
      ? categoryMap[apiProduct.category_name.toLowerCase()] || 'food'
      : 'food';

    let allergens: string[] = [];
    if (apiProduct.allergens) {
      try {
        allergens = JSON.parse(apiProduct.allergens);
      } catch {
        allergens = [];
      }
    }

    // Build full image URL from relative path
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    const imageUrl = apiProduct.image_url
      ? `${baseUrl}${apiProduct.image_url}`
      : 'https://via.placeholder.com/300x200/1E3A8A/FFFFFF?text=Product';

    return {
      id: String(apiProduct.id),
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.price,
      category,
      image: imageUrl,
      available: apiProduct.is_available === 1,
      preparationTime: apiProduct.preparation_time || 5,
      allergens,
      tags: [],
    };
  }

  static async getProducts(): Promise<Product[]> {
    try {
      console.log('[ProductService] Fetching products...');

      const apiProducts = await HttpService.get<ApiProduct[]>(
        API_ENDPOINTS.PRODUCTS.LIST,
      );

      console.log('[ProductService] Products fetched:', apiProducts.length);

      const domainProducts = apiProducts.map(this.mapApiProductToDomain);

      return domainProducts;
    } catch (error) {
      console.error('[ProductService] Get products failed:', error);
      throw error;
    }
  }

  static async getProduct(id: number): Promise<Product> {
    try {
      console.log('[ProductService] Fetching product:', id);

      const endpoint = API_ENDPOINTS.PRODUCTS.DETAIL.replace(':id', String(id));
      const product = await HttpService.get<Product>(endpoint);

      console.log('[ProductService] Product fetched:', product.name);

      return product;
    } catch (error) {
      console.error('[ProductService] Get product failed:', error);
      throw error;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      console.log('[ProductService] Fetching categories...');

      const categories = await HttpService.get<Category[]>(
        API_ENDPOINTS.CATEGORIES.LIST,
      );

      console.log('[ProductService] Categories fetched:', categories.length);

      return categories;
    } catch (error) {
      console.error('[ProductService] Get categories failed:', error);
      throw error;
    }
  }
}
