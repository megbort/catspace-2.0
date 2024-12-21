import { Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';
import { GlobalStore } from '../../shared';

@Component({
  selector: 'app-menu',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  isLoggedIn = computed(() => this.globalStore.authorized());

  constructor(
    private readonly dialog: MatDialog,
    public globalStore: GlobalStore
  ) {}

  openDialog(dialogType: 'signup' | 'login'): void {
    this.dialog.open(
      dialogType === 'signup' ? SignupComponent : LoginComponent,
      { width: '500px' }
    );
  }

  logout(): void {
    this.globalStore.logout(null, false);
  }
}
