import { Component, computed, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';
import { Dialog, DialogType } from '../../shared';
import { UnpicImageDirective } from '@unpic/angular';
import { AuthService } from '../../services';

@Component({
  selector: 'app-menu',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
    RouterModule,
    MatDialogModule,
    UnpicImageDirective,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  open = output<void>();
  isLoggedIn = computed(() => this.authService.currentUserSignal());

  constructor(
    public readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {}

  get currentUser() {
    return this.authService.currentUserSignal();
  }

  openDialog(dialog: DialogType): void {
    if (dialog === Dialog.SignUp) {
      this.dialog.open(SignupComponent, { width: '500px' });
    } else {
      this.dialog.open(LoginComponent, { width: '500px' });
    }
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
