import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILES } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [TranslateModule, ProfileCardComponent, CommonModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent {
  profiles = PROFILES;

  constructor(readonly router: Router) {}

  view(id: string) {
    this.router.navigate(['/profile', id]);
  }

  follow(event: FollowEvent) {
    console.log(`Id: ${event.id}; Follow: ${event.following}`);
  }
}
