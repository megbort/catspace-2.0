import { Component, output, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService, LazyDialogService } from '../../services';

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
  private readonly lazyDialog = inject(LazyDialogService);

  logout(): void {
    this.authService.logout();
    this.sidenavClose.emit();
  }

  async editProfile(): Promise<void> {
    const dialogRef = await this.lazyDialog.open(
      () => import('../edit-profile/edit-profile.component').then((m) => m.EditProfileComponent),
      { width: '500px', autoFocus: false },
    );
    if (dialogRef) {
      this.sidenavClose.emit();
    }
  }

  async newPost(): Promise<void> {
    const dialogRef = await this.lazyDialog.open(
      () => import('../create-post/create-post.component').then((m) => m.CreatePostComponent),
      { width: '550px', autoFocus: false },
    );
    if (dialogRef) {
      this.sidenavClose.emit();
    }
  }
}
