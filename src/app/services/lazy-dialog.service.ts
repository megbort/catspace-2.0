import { inject, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class LazyDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private loading = false;

  async open<T>(
    load: () => Promise<ComponentType<T>>,
    config?: MatDialogConfig,
  ): Promise<MatDialogRef<T> | null> {
    if (this.loading) {
      return null;
    }

    this.loading = true;
    try {
      const component = await load();
      return this.dialog.open(component, config);
    } catch {
      this.notificationService.error(
        this.translate.instant('common.dialogLoadFailed'),
      );
      return null;
    } finally {
      this.loading = false;
    }
  }
}
