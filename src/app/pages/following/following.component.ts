import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
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
import {
  switchMap,
  finalize,
  catchError,
  tap,
  takeUntil,
} from 'rxjs/operators';
import { of, Subject } from 'rxjs';

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
export class FollowingComponent implements OnInit, OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly loader = inject(LoaderService);
  private readonly followService = inject(FollowService);
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  initialized = signal(false);
  followingPosts = signal<Post[]>([]);
  loading = computed(() => this.globalStore.isLoading());

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user && this.authService.isInitialized()) {
          this.initialized.set(false);
          this.loadFollowingPosts();
        } else if (user === null) {
          this.followingPosts.set([]);
          this.initialized.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFollowingPosts(): void {
    const currentUser = this.authService.currentUserSignal();

    if (!currentUser) {
      console.log('No current user found, cannot load following posts');
      return;
    }

    if (this.initialized()) {
      return;
    }

    this.loader.show();
    this.followService
      .getFollowing(currentUser.id)
      .pipe(
        takeUntil(this.destroy$),
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
