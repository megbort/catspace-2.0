import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { AuthService, Profile, ProfileService } from '../../services';
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
export class HomeComponent {
  featured: Profile[] = [];
  isLoggedIn = computed(() => this.authService.currentUserSignal());

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.profileService
      .getProfiles()
      .pipe(map((profiles) => profiles.slice(0, 4)))
      .subscribe((data) => {
        this.featured = data;
      });
  }

  view(id: string): void {
    this.router.navigate(['/profile', id]);
  }

  follow(event: FollowEvent): void {
    console.log(`Id: ${event.id}; Follow: ${event.following}`);
  }

  signUp(): void {
    this.dialog.open(SignupComponent, { width: '500px', autoFocus: false });
  }
}
