import { Component, signal } from '@angular/core';
import { Post, PostService, Profile, ProfileService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { catchError, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  imports: [
    TranslateModule,
    MatButtonModule,
    PostCardComponent,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styles: `
    :host{
    @apply grow;
  }`,
})
export class ProfileComponent {
  profile?: Profile;
  posts: Post[] = [];
  loading = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly profileService: ProfileService,
    private readonly postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.loadProfileData(id);
      }
    });
  }

  private loadProfileData(id: string): void {
    this.loading.set(true);

    this.profileService
      .getProfileById(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading profile', error);
          return [null];
        }),
        switchMap((profileData) => {
          if (profileData) {
            this.profile = profileData;
            return this.postService.getPostsByProfileId(id);
          } else {
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error loading posts', error);
          return [];
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.loading.set(false);
      });
  }
}
