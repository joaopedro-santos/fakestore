import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  };

  constructor(private readonly snackBar: MatSnackBar) {}

  public success(message: string): void {
    this.snackBar.open(message, 'Fechar', { ...this.defaultConfig, panelClass: ['snack-success'] });
  }

  public error(message: string): void {
    this.snackBar.open(message, 'Fechar', { ...this.defaultConfig, panelClass: ['snack-error'] });
  }

  public warning(message: string): void {
    this.snackBar.open(message, 'Fechar', { ...this.defaultConfig, panelClass: ['snack-warning'] });
  }

  public info(message: string): void {
    this.snackBar.open(message, 'Fechar', { ...this.defaultConfig, panelClass: ['snack-info'] });
  }
}
