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
})
export class FeaturedComponent {
  profiles: Profile[] = [];
  loadedProfiles = 8;

  constructor(
    private readonly router: Router,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
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

  showMore(): void {
    this.loadedProfiles += 8;
  }
}
