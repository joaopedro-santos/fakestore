import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageService = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  private readonly currentTheme = signal<ThemeMode>('light');
  private initialized = false;

  public readonly theme = this.currentTheme.asReadonly();

  public initialize(): void {
    if (this.initialized) {
      return;
    }

    const storedTheme = this.storageService.getItem<ThemeMode>(STORAGE_KEYS.THEME);
    const initialTheme = this.isThemeMode(storedTheme) ? storedTheme : this.getSystemTheme();

    this.applyTheme(initialTheme);
    this.currentTheme.set(initialTheme);
    this.storageService.setItem(STORAGE_KEYS.THEME, initialTheme);
    this.initialized = true;
  }

  public setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    this.storageService.setItem(STORAGE_KEYS.THEME, theme);
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);

    if (this.document.body) {
      this.document.body.setAttribute('data-theme', theme);
    }
  }

  private getSystemTheme(): ThemeMode {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private isThemeMode(value: unknown): value is ThemeMode {
    return value === 'light' || value === 'dark';
  }
}
