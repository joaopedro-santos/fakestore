import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { ROUTES } from '../constants/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private readonly storageService: StorageService) {}

  public login(token: string): void {
    this.storageService.setItem(STORAGE_KEYS.TOKEN, token);
  }

  public logout(): void {
    this.storageService.removeItem(STORAGE_KEYS.TOKEN);
  }

  public clearSession(): void {
    this.logout();
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  public hasValidSession(): boolean {
    return this.isAuthenticated();
  }

  public getPostLoginRoute(): string {
    return `/${ROUTES.DASHBOARD}`;
  }

  public getToken(): string | null {
    return this.storageService.getItem<string>(STORAGE_KEYS.TOKEN);
  }
}
