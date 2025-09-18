import {
  Component,
  inject,
  input,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  User,
  AuthService,
  NotificationService,
  FollowService,
} from '../../services';
import { RouterModule } from '@angular/router';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { UnpicImageDirective } from '@unpic/angular';
import { MatDialog } from '@angular/material/dialog';
import { AuthMessageComponent } from '../auth/auth-message.component';
import { tap, catchError, EMPTY, take } from 'rxjs';

export interface FollowEvent {
  id: string;
  following: boolean;
}

@Component({
  selector: 'app-profile-card',
  imports: [
    TranslateModule,
    MatButtonModule,
    RouterModule,
    MatButtonToggleModule,
    UnpicImageDirective,
  ],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent implements OnInit {
  profile = input<User>({
    id: '',
    email: '',
    image: '',
    name: '',
    handle: '',
    description: '',
    posts: [],
    following: [],
    favorites: [],
    followers: [],
    tags: [],
  });

  view = output<string>();

  following = signal(false);
  followerCount = signal(0);

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly followService = inject(FollowService);
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  get formattedTags(): string {
    return this.profile()
      .tags.map((tag: string) => `#${tag}`)
      .join(' ');
  }

  ngOnInit(): void {
    this.loadFollowerCount();
    this.setFollowingStatus();
  }

  loadFollowerCount(): void {
    this.followService
      .getFollowers(this.profile().id)
      .pipe(
        tap((followers) => {
          this.followerCount.set(followers.length);
        }),
        catchError((error) => {
          console.error('Error loading follower count:', error);
          this.followerCount.set(this.profile().followers.length);
          return EMPTY;
        })
      )
      .subscribe();
  }

  setFollowingStatus(): void {
    this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.checkFollowingStatus(firebaseUser.uid);
      }
    });
  }

  private checkFollowingStatus(currentUserId: string): void {
    const profileId = this.profile().id;

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
      const targetUserId = this.profile().id;

      this.following.set(!this.following());

      if (this.following()) {
        this.followService
          .followUser(currentUserId, targetUserId)
          .pipe(
            tap(() => {
              this.loadFollowerCount();

              this.notificationService.success(
                this.translate.instant('profile.followingSuccess', {
                  name: this.profile().name,
                }),
                { duration: 50000 }
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
