import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile, ProfileService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-featured',
  imports: [
    TranslateModule,
    ProfileCardComponent,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './featured.component.html',
  styles: `
  :host{
    @apply grow;
  }
  `,
})
export class FeaturedComponent {
  profiles: Profile[] = [];
  loadedProfiles = 8;
  loading = signal(false);

  constructor(
    private readonly router: Router,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.loading.set(true);
    this.profileService.getProfiles().subscribe((data) => {
      this.profiles = data;
      this.loading.set(false);
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
