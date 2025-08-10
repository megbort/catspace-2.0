import { Component, output, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { CreatePostComponent } from '../create-post/create-post.component';

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

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  logout(): void {
    this.authService.logout();
    this.close.emit();
  }

  editProfile(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px',
      autoFocus: false,
    });
    this.close.emit();
  }

  newPost(): void {
    this.dialog.open(CreatePostComponent, {
      width: '550px',
      autoFocus: false,
    });
    this.close.emit();
  }
}
