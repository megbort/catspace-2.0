import { Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Dialog, DialogType } from '../../shared';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../../services';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, MatDialogModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isLoggedIn = computed(() => this.authService.currentUserSignal());

  defaultDialogProperties = {
    width: '500px',
    autoFocus: false,
  };

  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  openDialog(dialog: DialogType): void {
    if (dialog === Dialog.SignUp) {
      this.dialog.open(SignupComponent, this.defaultDialogProperties);
    } else {
      this.dialog.open(LoginComponent, this.defaultDialogProperties);
    }
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
