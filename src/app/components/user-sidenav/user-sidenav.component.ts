import { Component, output, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-user-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.scss'],
})
export class UserSidenavComponent {
  close = output<void>();
  user = computed(() => this.authService.currentUserSignal());

  constructor(
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {}

  logout(): void {
    this.authService.logout().subscribe();
    this.close.emit();
  }

  openEditProfile(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px',
      autoFocus: false,
    });
    this.close.emit();
  }
}
