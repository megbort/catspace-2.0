import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService, User, UserService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, map, of } from 'rxjs';

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
  profiles: User[] = [];
  loadedProfiles = 8;
  loading = signal(false);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.loading.set(true);
    this.loader.show();
    this.userService
      .getUsers()
      .pipe(
        map((users: User[]) => users),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      )
      .subscribe((data: User[]) => {
        this.profiles = data;
        this.loader.hide();
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
