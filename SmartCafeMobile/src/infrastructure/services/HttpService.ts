import {API_CONFIG} from '../config/api';

interface HttpOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class HttpService {
  private static baseUrl = API_CONFIG.BASE_URL;
  private static timeout = API_CONFIG.TIMEOUT;

  static async get<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  static async post<T>(
    endpoint: string,
    body?: any,
    options?: HttpOptions,
  ): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  static async put<T>(
    endpoint: string,
    body?: any,
    options?: HttpOptions,
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  static async delete<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  private static async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options?: HttpOptions,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const timeout = options?.timeout || this.timeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const config: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      console.log(`[HttpService] ${method} ${url}`);

      const response = await fetch(url, config);

      clearTimeout(timeoutId);

      // Parse response
      const data: ApiResponse<T> = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      // Handle API errors
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      console.log(`[HttpService] ${method} ${url} - Success`);

      return data.data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.error(`[HttpService] ${method} ${url} - Timeout`);
        throw new Error('Request timeout');
      }

      console.error(`[HttpService] ${method} ${url} - Error:`, error);
      throw error;
    }
  }

  /**
   * Set authorization token for subsequent requests
   * Returns headers object to be passed to request
   */
  static getAuthHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
