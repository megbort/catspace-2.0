import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService, Profile, ProfileService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, of, tap } from 'rxjs';

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
    private readonly profileService: ProfileService,
    private readonly loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.loading.set(true);
    this.loader.show();
    this.profileService
      .getProfiles()
      .pipe(
        catchError((error) => {
          console.error('Error fetching profiles:', error);
          return of([]);
        }),
        tap((result) => {
          this.profiles = result;
        }),
        finalize(() => {
          this.loader.hide();
          this.loading.set(false);
        })
      )
      .subscribe();
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
