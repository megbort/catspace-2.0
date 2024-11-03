import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../services';
import { RouterModule } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface FollowEvent {
  id: string;
  following: boolean;
}

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {
  @Output() view = new EventEmitter<string>();
  @Output() follow = new EventEmitter<FollowEvent>();

  @Input() profile: Profile = {
    id: '',
    image: '',
    name: '',
    handle: '',
    followers: 0,
    tags: [],
    following: false,
    posts: [],
  };

  followUser() {
    this.profile.following = !this.profile.following;

    this.follow.emit({
      id: this.profile.id,
      following: this.profile.following,
    });
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.followUser();
      event.preventDefault();
    }
  }
}
