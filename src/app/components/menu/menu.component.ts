import {
  Component,
  computed,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';
import { GlobalStore, Dialog, DialogType } from '../../shared';
import { UnpicImageDirective } from '@unpic/angular';
import { UserSidenavComponent } from '../user-sidenav/user-sidenav.component';

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
  @ViewChild('profileMenu') profileMenu!: UserSidenavComponent;

  @Output() openProfileDrawer = new EventEmitter<void>();
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

  openProfileMenu(): void {
    this.openProfileDrawer.emit();
  }
}
