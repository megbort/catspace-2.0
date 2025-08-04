import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User, AuthService, NotificationService } from '../../services';
import { RouterModule } from '@angular/router';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { UnpicImageDirective } from '@unpic/angular';
import { MatDialog } from '@angular/material/dialog';
import { AuthMessageComponent } from '../auth/auth-message.component';

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
    CommonModule,
    MatButtonToggleModule,
    UnpicImageDirective,
  ],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {
  userFollowing = input<string[]>();
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
  follow = output<FollowEvent>();

  following = false;

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  get formattedTags(): string {
    return this.profile()
      .tags.map((tag: string) => `#${tag}`)
      .join(' ');
  }

  setFollowingStatus(): void {
    if (!this.authService.currentUserSignal()) {
      return;
    }

    this.userFollowing()?.forEach((id) => {
      if (id === this.profile().id) {
        this.following = true;
      }
    });
  }

  toggleFollow(event: MatButtonToggleChange): void {
    if (!this.authService.currentUserSignal()) {
      this.showAuthMessage();
      event.source.checked = this.following;
      return;
    }

    this.following = !this.following;
    this.follow.emit({
      id: this.profile().id,
      following: this.following,
    });

    this.notificationService.success(
      this.translate.instant('auth.login.success.loggedIn')
    );
  }

  showAuthMessage(): void {
    this.dialog.open(AuthMessageComponent, { autoFocus: false });
  }
}
