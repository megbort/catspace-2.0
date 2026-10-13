import { Component, output, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services';

@Component({
  selector: 'app-user-sidenav',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './user-sidenav.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./user-sidenav.component.scss'],
})
export class UserSidenavComponent {
  sidenavClose = output<void>();
  user = computed(() => this.authService.currentUserSignal());

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  logout(): void {
    this.authService.logout();
    this.sidenavClose.emit();
  }

  async editProfile(): Promise<void> {
    const { EditProfileComponent } = await import('../edit-profile/edit-profile.component');
    this.dialog.open(EditProfileComponent, {
      width: '500px',
      autoFocus: false,
    });
    this.sidenavClose.emit();
  }

  async newPost(): Promise<void> {
    const { CreatePostComponent } = await import('../create-post/create-post.component');
    this.dialog.open(CreatePostComponent, {
      width: '550px',
      autoFocus: false,
    });
    this.sidenavClose.emit();
  }
}
