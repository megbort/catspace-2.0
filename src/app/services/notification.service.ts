import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  NotificationComponent,
  NotificationData,
} from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly snackBar: MatSnackBar) {}

  private show(data: NotificationData, config?: MatSnackBarConfig) {
    const defaultConfig: MatSnackBarConfig = {
      duration: 400000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      ...config,
    };

    return this.snackBar.openFromComponent(NotificationComponent, {
      data,
      ...defaultConfig,
    });
  }

  success(message: string, config?: MatSnackBarConfig) {
    return this.show({ message, type: 'success' }, config);
  }

  error(message: string, config?: MatSnackBarConfig) {
    return this.show({ message, type: 'error' }, config);
  }

  warning(message: string, config?: MatSnackBarConfig) {
    return this.show({ message, type: 'warning' }, config);
  }
}
