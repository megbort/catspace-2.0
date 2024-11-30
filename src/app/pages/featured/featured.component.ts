import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile, ProfileService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-featured',
    imports: [TranslateModule, ProfileCardComponent, CommonModule],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
  profiles: Profile[] = [];

  constructor(
    private readonly router: Router,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getProfiles().subscribe((data) => {
      this.profiles = data;
    });
  }

  view(id: string): void {
    this.router.navigate(['/profile', id]);
  }

  follow(event: FollowEvent): void {
    console.log(`Id: ${event.id}; Follow: ${event.following}`);
  }
}
