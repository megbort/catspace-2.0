import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { AuthService, User, UserService } from '../../services';
import { Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { UnpicImageDirective } from '@unpic/angular';
import { SignupComponent } from '../../components/auth/signup/signup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    TranslateModule,
    ProfileCardComponent,
    UnpicImageDirective,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  featured: User[] = [];
  isLoggedIn = computed(() => this.authService.currentUserSignal());

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
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

  signUp(): void {
    this.dialog.open(SignupComponent, { width: '500px', autoFocus: false });
  }
}
