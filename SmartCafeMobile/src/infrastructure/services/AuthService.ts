import AsyncStorage from '@react-native-async-storage/async-storage';
import {HttpService} from './HttpService';
import {API_ENDPOINTS} from '../config/api';

const TOKEN_KEY = '@smart_cafe_token';
const USER_KEY = '@smart_cafe_user';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('[AuthService] Login attempt:', credentials.email);

      const response = await HttpService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );

      // Save token and user
      await this.saveToken(response.token);
      await this.saveUser(response.user);

      console.log('[AuthService] Login successful:', response.user.email);

      return response.user;
    } catch (error) {
      console.error('[AuthService] Login failed:', error);
      throw error;
    }
  }

  static async register(data: RegisterData): Promise<User> {
    try {
      console.log('[AuthService] Register attempt:', data.email);

      const response = await HttpService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
      );

      // Save token and user
      await this.saveToken(response.token);
      await this.saveUser(response.user);

      console.log('[AuthService] Registration successful:', response.user.email);

      return response.user;
    } catch (error) {
      console.error('[AuthService] Registration failed:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      console.log('[AuthService] Logout successful');
    } catch (error) {
      console.error('[AuthService] Logout failed:', error);
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (!userJson) {
        return null;
      }
      return JSON.parse(userJson);
    } catch (error) {
      console.error('[AuthService] Get user failed:', error);
      return null;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('[AuthService] Get token failed:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  private static async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  private static async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
