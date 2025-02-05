import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Dialog, DialogType } from '../../shared';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-message',
  imports: [MatButtonModule, MatInputModule, TranslateModule],
  template: ` <div class="p-8 flex flex-col gap-4 w-[310px]">
    <p class="subtitle-2">
      Please sign or create an account to use this feature.
    </p>
    <div class="flex justify-between">
      <button mat-stroked-button (click)="openDialog('signUp')">
        {{ 'button.signUp' | translate }}
      </button>
      <button mat-flat-button (click)="openDialog('login')">
        {{ 'button.login' | translate }}
      </button>
    </div>
  </div>`,
})
export class AuthMessageComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<AuthMessageComponent>
  ) {}

  openDialog(dialog: DialogType): void {
    this.dialogRef.close();
    if (dialog === Dialog.SignUp) {
      this.dialog.open(SignupComponent, { width: '500px' });
    } else {
      this.dialog.open(LoginComponent, { width: '500px' });
    }
  }
}
