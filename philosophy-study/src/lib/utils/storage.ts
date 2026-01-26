export interface StorageProvider {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

class LocalStorageProvider implements StorageProvider {
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }
}

class MockStorageProvider implements StorageProvider {
  private storage = new Map<string, string>();

  getItem<T>(key: string): T | null {
    const item = this.storage.get(key);
    return item ? JSON.parse(item) : null;
  }

  setItem<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

// Create storage provider based on environment
const createStorageProvider = (): StorageProvider => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return new LocalStorageProvider();
  }
  return new MockStorageProvider();
};

export const storage = createStorageProvider();

// Convenience functions for specific data types
export const userProgressStorage = {
  get: () => storage.getItem<Record<string, unknown>>('user_progress'),
  set: (data: Record<string, unknown>) => storage.setItem('user_progress', data),
  clear: () => storage.removeItem('user_progress')
};

export const userSettingsStorage = {
  get: () => storage.getItem<Record<string, unknown>>('user_settings'),
  set: (data: Record<string, unknown>) => storage.setItem('user_settings', data),
  clear: () => storage.removeItem('user_settings')
};

export const offlineDataStorage = {
  get: () => storage.getItem<Record<string, unknown>>('offline_data'),
  set: (data: Record<string, unknown>) => storage.setItem('offline_data', data),
  clear: () => storage.removeItem('offline_data')
};
