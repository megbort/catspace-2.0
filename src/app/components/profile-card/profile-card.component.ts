import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../services';
import { RouterModule } from '@angular/router';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { UnpicImageDirective } from '@unpic/angular';
import { GlobalStore } from '../../shared';
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
  @Output() view = new EventEmitter<string>();
  @Output() follow = new EventEmitter<FollowEvent>();

  @Input() userFollowing?: string[] = [];
  @Input() profile: Profile = {
    id: '',
    image: '',
    name: '',
    handle: '',
    followers: 0,
    tags: [],
  };

  following = false;

  constructor(
    private readonly globalStore: GlobalStore,
    private readonly dialog: MatDialog
  ) {}

  setFollowingStatus(): void {
    if (!this.globalStore.authorized()) {
      return;
    }

    this.userFollowing?.forEach((id) => {
      if (id === this.profile.id) {
        this.following = true;
      }
    });
  }

  toggleFollow(event: MatButtonToggleChange): void {
    if (!this.globalStore.authorized()) {
      this.showAuthMessage();
      event.source.checked = this.following;
      return;
    }

    this.following = !this.following;
    this.follow.emit({
      id: this.profile.id,
      following: this.following,
    });
  }

  showAuthMessage(): void {
    this.dialog.open(AuthMessageComponent);
  }
}
