import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService, User, UserService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, map, of } from 'rxjs';
import { GlobalStore } from '../../shared/state/global.store';

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
  loading = computed(() => this.globalStore.isLoading());

  private readonly globalStore = inject(GlobalStore);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly loader = inject(LoaderService);

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
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
      });
  }

  viewProfile(id: string): void {
    this.router.navigate(['/profile', id]);
  }

  showMore(): void {
    this.loadedProfiles += 8;
  }
}
