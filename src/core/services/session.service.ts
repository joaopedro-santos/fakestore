import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public isAuthenticated(): boolean {
    // Placeholder for future auth state checks.
    return false;
  }

  public logout(): void {
    // Placeholder for future logout logic.
  }
}
