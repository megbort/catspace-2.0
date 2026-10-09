import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UnpicImageDirective } from '@unpic/angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Dialog, DialogType } from '../../shared';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../../services';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe, MatDialogModule, RouterModule, UnpicImageDirective],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isLoggedIn = computed(() => this.authService.currentUserSignal());
  version = environment.version;

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
    this.authService.logout();
  }
}
