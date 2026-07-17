import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public showSuccess(message: string): void {
    // Placeholder for future toast implementation.
    console.info(message);
  }

  public showError(message: string): void {
    // Placeholder for future toast implementation.
    console.error(message);
  }

  public showInfo(message: string): void {
    // Placeholder for future toast implementation.
    console.info(message);
  }
}
