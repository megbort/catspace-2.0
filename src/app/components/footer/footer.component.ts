import { Component, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GlobalStore, Dialog, DialogType } from '../../shared';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, MatDialogModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isLoggedIn = computed(() => this.globalStore.authorized());

  constructor(
    private readonly dialog: MatDialog,
    public globalStore: GlobalStore
  ) {}

  openDialog(dialog: DialogType): void {
    if (dialog === Dialog.SignUp) {
      this.dialog.open(SignupComponent, { width: '500px' });
    } else {
      this.dialog.open(LoginComponent, { width: '500px' });
    }
  }

  logout(): void {
    this.globalStore.logout(null, false);
  }
}
