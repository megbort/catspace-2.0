import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <div class="flex flex-col p-4">
      <div class="flex justify-end">
        <button
          mat-icon-button
          (click)="close()"
          [attr.aria-label]="'buttons.close' | translate"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      @if(title()){
      <div class="text-center pb-4">
        <h2>{{ title() }}</h2>
      </div>
      }

      <div class="p-2 grow">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CustomDialogComponent {
  title = input<string>();

  constructor(
    private readonly dialogRef: MatDialogRef<CustomDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
