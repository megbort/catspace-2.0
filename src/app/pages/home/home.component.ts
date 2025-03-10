import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Profile, ProfileService } from '../../services';
import { Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { UnpicImageDirective } from '@unpic/angular';
import { SignupComponent } from '../../components/auth/signup/signup.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

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

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly profileService: ProfileService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileService
      .getProfiles()
      .pipe(map((profiles) => profiles.slice(0, 4)))
      .subscribe((data) => {
        this.featured = data;
      });

    this.fetchFireStore();
  }

  fetchFireStore() {
    this.userService.getUsers().subscribe((data) => {
      console.log(data);
    });
  }

  view(id: string): void {
    this.router.navigate(['/profile', id]);
  }

  follow(event: FollowEvent): void {
    console.log(`Id: ${event.id}; Follow: ${event.following}`);
  }

  signUp(): void {
    this.dialog.open(SignupComponent, { width: '500px' });
  }
}
