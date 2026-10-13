import { Component, computed, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { Dialog, DialogType, PriorityImageDirective } from '../../shared';
import { UnpicImageDirective } from '@unpic/angular';
import { AuthService, LazyDialogService, ThemeService } from '../../services';
import { BannerComponent } from '../ui/banner.component';

@Component({
  selector: 'app-menu',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslatePipe,
    RouterModule,
    MatDialogModule,
    UnpicImageDirective,
    PriorityImageDirective,
    BannerComponent,
  ],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  open = output<void>();
  isLoggedIn = computed(() => this.authService.currentUserSignal());
  isDarkTheme = computed(() => this.themeService.theme() === 'dark');

  defaultDialogProperties = {
    width: '500px',
    autoFocus: false,
  };

  public readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly lazyDialog = inject(LazyDialogService);

  get currentUser() {
    return this.authService.currentUserSignal();
  }

  async openDialog(dialog: DialogType): Promise<void> {
    if (dialog === Dialog.SignUp) {
      await this.lazyDialog.open(
        () => import('../auth/signup/signup.component').then((m) => m.SignupComponent),
        this.defaultDialogProperties,
      );
    } else if (dialog === Dialog.Login) {
      await this.lazyDialog.open(
        () => import('../auth/login/login.component').then((m) => m.LoginComponent),
        this.defaultDialogProperties,
      );
    } else {
      await this.lazyDialog.open(
        () => import('../create-post/create-post.component').then((m) => m.CreatePostComponent),
        { width: '550px', autoFocus: false },
      );
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
