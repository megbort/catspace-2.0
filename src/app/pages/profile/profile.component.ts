import {
  Component,
  signal,
  computed,
  inject,
  effect,
  OnInit,
} from '@angular/core';
import {
  Post,
  PostService,
  AuthService,
  UserService,
  LoaderService,
  User,
  FollowService,
  NotificationService,
} from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatButtonToggleModule,
  MatButtonToggleChange,
} from '@angular/material/button-toggle';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { AuthMessageComponent } from '../../components/auth/auth-message.component';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { CreatePostComponent } from '../../components/create-post/create-post.component';
import { GlobalStore } from '../../shared/state/global.store';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    PostCardComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly _user = signal<User | undefined>(undefined);
  private readonly currentProfileId = signal('');
  private readonly _posts = signal<Post[]>([]);

  posts = computed(() => this._posts());
  isOwner = signal(false);
  loading = computed(() => this.globalStore.isLoading());
  following = signal(false);
  followerCount = signal(0);

  user = computed(() => {
    const currentUser = this.authService.currentUserSignal();
    const isOwner = this.isOwner();
    const profileId = this.currentProfileId();

    if (currentUser && isOwner && profileId === currentUser.id) {
      return currentUser;
    }
    return this._user();
  });

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly loader = inject(LoaderService);
  private readonly dialog = inject(MatDialog);
  private readonly globalStore = inject(GlobalStore);
  private readonly followService = inject(FollowService);
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const postCreated = this.postService.postCreatedSignal();
      const currentProfileId = this.currentProfileId();
      const isOwner = this.isOwner();

      if (postCreated && isOwner && postCreated.uid === currentProfileId) {
        this.loadUserPosts(currentProfileId);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        if (id === 'me') {
          this.handleMeRoute();
        } else {
          this.currentProfileId.set(id);
          this.loadProfileData(id);
        }
      }
    });
  }

  private handleMeRoute(): void {
    const currentUser = this.authService.currentUserSignal();

    if (currentUser) {
      this.currentProfileId.set(currentUser.id);
      this.loadProfileData(currentUser.id);
    } else {
      this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
        if (firebaseUser) {
          this.currentProfileId.set(firebaseUser.uid);
          this.loadProfileData(firebaseUser.uid);
        } else {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  private loadProfileData(id: string): void {
    this.loader.show();

    const currentUser = this.authService.currentUserSignal();

    if (!currentUser) {
      this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
        if (firebaseUser && firebaseUser.uid === id) {
          this.isOwner.set(true);
          this.loadUserData(id);
        } else {
          this.tryLoadAsUser(id);
        }
      });
    } else {
      const isCurrentUser = currentUser.id === id;
      this.isOwner.set(isCurrentUser);

      if (isCurrentUser) {
        this.loadUserData(id);
      } else {
        this.loadUserDataVisitor(id);
        // Load follow status and follower count for visitors
        this.loadFollowerCount();
        this.setFollowingStatus();
      }
    }
  }

  private tryLoadAsUser(id: string): void {
    this.userService
      .getUserProfileById(id)
      .then((userData) => {
        if (userData) {
          this.isOwner.set(true);
          this._user.set(userData);
          this.loadUserPosts(id);
        } else {
          this.loadUserDataVisitor(id);
        }
      })
      .catch((error) => {
        console.error('Error loading user data, trying user data', error);
        this.loadUserDataVisitor(id);
      });
  }

  private loadUserData(id: string): void {
    this.userService
      .getUserProfileById(id)
      .then((userData) => {
        if (userData) {
          this._user.set(userData);
          this.loadUserPosts(id);
        } else {
          this.loader.hide();
        }
      })
      .catch((error) => {
        console.error('Error loading user data', error);
        this.loader.hide();
      });
  }

  private loadUserDataVisitor(id: string): void {
    this.userService
      .getUserById(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading user data', error);
          return [null];
        }),
        switchMap((userData) => {
          if (userData) {
            this._user.set(userData);
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
      .subscribe((posts: Post[]) => {
        this._posts.set(posts);
        this.loader.hide();
      });
  }

  private loadUserPosts(id: string): void {
    this.postService
      .getPostsByProfileId(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading posts', error);
          return [];
        })
      )
      .subscribe((posts: Post[]) => {
        this._posts.set(posts);
        this.loader.hide();
      });
  }

  editProfile(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px',
      autoFocus: false,
    });
  }

  newPost(): void {
    this.dialog.open(CreatePostComponent, {
      width: '550px',
      autoFocus: false,
    });
  }

  private loadFollowerCount(): void {
    const profileId = this.currentProfileId();
    if (!profileId) return;

    this.followService
      .getFollowers(profileId)
      .pipe(
        tap((followers) => {
          this.followerCount.set(followers.length);
        }),
        catchError((error) => {
          console.error('Error loading follower count:', error);
          const user = this._user();
          this.followerCount.set(user?.followers?.length || 0);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private setFollowingStatus(): void {
    this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.checkFollowingStatus(firebaseUser.uid);
      }
    });
  }

  private checkFollowingStatus(currentUserId: string): void {
    const profileId = this.currentProfileId();
    if (!profileId) return;

    this.followService
      .getFollowing(currentUserId)
      .pipe(
        tap((following) => {
          const isFollowing = following.some(
            (follow) => follow.userId === profileId
          );
          this.following.set(isFollowing);
        }),
        catchError((error) => {
          console.error('Error checking following status:', error);
          this.following.set(false);
          return EMPTY;
        })
      )
      .subscribe();
  }

  toggleFollow(event: MatButtonToggleChange): void {
    this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
      if (!firebaseUser) {
        this.showAuthMessage();
        event.source.checked = this.following();
        return;
      }

      const currentUserId = firebaseUser.uid;
      const targetUserId = this.currentProfileId();

      this.following.set(!this.following());

      if (this.following()) {
        this.followService
          .followUser(currentUserId, targetUserId)
          .pipe(
            tap(() => {
              this.loadFollowerCount();
              const user = this._user();
              this.notificationService.success(
                this.translate.instant('profile.followingSuccess', {
                  name: user?.name || 'user',
                })
              );
            }),
            catchError((error) => {
              this.following.set(false);
              event.source.checked = false;
              this.notificationService.error(
                this.translate.instant('profile.followingError')
              );
              console.error('Error following user:', error);
              return EMPTY;
            })
          )
          .subscribe();
      } else {
        this.followService
          .unfollowUser(currentUserId, targetUserId)
          .pipe(
            tap(() => {
              this.loadFollowerCount();
            }),
            catchError((error) => {
              this.following.set(true);
              event.source.checked = true;
              this.notificationService.error(
                this.translate.instant('profile.unfollowError')
              );
              console.error('Error unfollowing user:', error);
              return EMPTY;
            })
          )
          .subscribe();
      }
    });
  }

  showAuthMessage(): void {
    this.dialog.open(AuthMessageComponent, { autoFocus: false });
  }
}
