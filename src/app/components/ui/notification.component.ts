import { Component, inject, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Component({
  selector: 'app-notification',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div
      class="flex items-center justify-between gap-4 p-2 min-w-[320px] rounded shadow-md"
      [class]="data.type"
    >
      <div class="flex gap-2 grow">
        @switch (data.type) { @case ('success') {
        <mat-icon>check_circle</mat-icon>
        } @case ('error') {
        <mat-icon>error</mat-icon>
        } @case ('warning') {
        <mat-icon>warning</mat-icon>
        } }
        <p class="text-body-1 medium">{{ data.message }}</p>
      </div>

      <button
        mat-icon-button
        (click)="dismiss()"
        aria-label="Close notification"
      >
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .success {
        @apply bg-green-100 text-green-800 border-l-4 border-green-500;
        & button {
          @apply text-green-800;
        }
      }

      .error {
        @apply bg-red-100 text-red-800 border-l-4 border-red-500;
        & button {
          @apply text-red-800;
        }
      }

      .warning {
        @apply bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500;
        & button {
          @apply text-yellow-800;
        }
      }
    `,
  ],
})
export class NotificationComponent {
  data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef);

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
