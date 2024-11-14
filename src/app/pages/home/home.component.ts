import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Profile, ProfileService } from '../../services';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, TranslateModule, ProfileCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  featured: Profile[] = [];

  constructor(
    private readonly router: Router,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
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
}
