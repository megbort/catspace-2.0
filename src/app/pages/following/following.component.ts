import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GlobalStore } from '../../shared';
import {
  LoaderService,
  FollowService,
  PostService,
  AuthService,
} from '../../services';
import { Post } from '../../services/models';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { switchMap, finalize, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-following',
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    PostCardComponent,
  ],
  templateUrl: './following.component.html',
})
export class FollowingComponent implements OnInit {
  private readonly globalStore = inject(GlobalStore);
  private readonly loader = inject(LoaderService);
  private readonly followService = inject(FollowService);
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);

  initialized = signal(false);
  followingPosts = signal<Post[]>([]);
  loading = computed(() => this.globalStore.isLoading());

  ngOnInit(): void {
    this.loadFollowingPosts();
  }

  private loadFollowingPosts(): void {
    this.loader.show();

    const currentUser = this.authService.currentUserSignal();

    if (!currentUser) {
      this.loader.hide();
      return;
    }

    this.followService
      .getFollowing(currentUser.id)
      .pipe(
        switchMap((following) => {
          const followedUserIds = following.map((f) => f.userId);

          if (followedUserIds.length === 0) {
            return of([]);
          }

          return this.postService.getPostsFromFollowedUsers(followedUserIds);
        }),
        tap((posts) => {
          this.followingPosts.set(posts);
        }),
        catchError((error) => {
          console.error('Error loading following posts:', error);
          this.followingPosts.set([]);
          return of([]);
        }),
        finalize(() => {
          this.loader.hide();
          this.initialized.set(true);
        })
      )
      .subscribe();
  }
}
