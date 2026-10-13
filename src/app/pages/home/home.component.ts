import { Component, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { AuthService, LazyDialogService, User, UserService } from '../../services';
import { Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { UnpicImageDirective } from '@unpic/angular';
import { PriorityImageDirective } from '../../shared';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    TranslatePipe,
    ProfileCardComponent,
    UnpicImageDirective,
    PriorityImageDirective,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  featured: User[] = [];
  isLoggedIn = computed(() => this.authService.currentUserSignal());

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly lazyDialog = inject(LazyDialogService);
  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.userService
      .getUsers()
      .pipe(map((users: User[]) => users.slice(0, 4)))
      .subscribe((data: User[]) => {
        this.featured = data;
      });
  }

  viewProfile(id: string): void {
    this.router.navigate(['/profile', id]);
  }

  async signUp(): Promise<void> {
    await this.lazyDialog.open(
      () =>
        import('../../components/auth/signup/signup.component').then(
          (m) => m.SignupComponent,
        ),
      { width: '500px', autoFocus: false },
    );
  }
}
