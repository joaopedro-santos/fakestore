import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public setItem<T>(key: string, value: T): void {
    // Placeholder for future persistence logic.
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem<T>(key: string): T | null {
    // Placeholder for future retrieval logic.
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  public removeItem(key: string): void {
    // Placeholder for future removal logic.
    localStorage.removeItem(key);
  }
}
