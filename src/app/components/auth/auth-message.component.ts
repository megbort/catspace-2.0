import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Dialog, DialogType } from '../../shared';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-message',
  imports: [
    MatButtonModule,
    MatInputModule,
    TranslateModule,
    CustomDialogComponent,
  ],
  template: ` <app-custom-dialog>
    <div class="flex flex-col gap-4">
      <p class="subtitle-2 p-2">
        {{ 'auth.authMessage' | translate }}
      </p>
      <div class="flex justify-between gap-4">
        <button
          mat-stroked-button
          class="w-full"
          (click)="openDialog('signUp')"
        >
          {{ 'button.signUp' | translate }}
        </button>
        <button mat-flat-button class="w-full" (click)="openDialog('login')">
          {{ 'button.login' | translate }}
        </button>
      </div>
    </div>
  </app-custom-dialog>`,
})
export class AuthMessageComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<AuthMessageComponent>
  ) {}

  openDialog(dialog: DialogType): void {
    this.dialogRef.close();
    if (dialog === Dialog.SignUp) {
      this.dialog.open(SignupComponent, { width: '500px', autoFocus: false });
    } else {
      this.dialog.open(LoginComponent, { width: '500px', autoFocus: false });
    }
  }
}
