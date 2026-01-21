/**
 * Storage Service
 *
 * Wrapper around AsyncStorage for secure data persistence
 * In production: Use react-native-keychain for sensitive data (tokens)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  /**
   * Save a string value
   */
  async save(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[StorageService] Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  /**
   * Get a string value
   */
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`[StorageService] Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * Save an object (auto-serialized to JSON)
   */
  async saveObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`[StorageService] Error saving object ${key}:`, error);
      throw new Error(`Failed to save object ${key}`);
    }
  }

  /**
   * Get an object (auto-deserialized from JSON)
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`[StorageService] Error getting object ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove a value
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Error removing ${key}:`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  }

  /**
   * Clear all storage (use with caution!)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[StorageService] Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  /**
   * Save multiple key-value pairs
   */
  async multiSet(pairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('[StorageService] Error in multiSet:', error);
      throw new Error('Failed to save multiple items');
    }
  }

  /**
   * Remove multiple keys
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('[StorageService] Error in multiRemove:', error);
      throw new Error('Failed to remove multiple items');
    }
  }
}

export default new StorageService();
