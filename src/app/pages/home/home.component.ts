import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import {
  FollowEvent,
  ProfileCardComponent,
} from '../../components/profile-card/profile-card.component';
import { PROFILES, Profile } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, TranslateModule, ProfileCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  featured: Profile[] = PROFILES.slice(0, 4);

  constructor(readonly router: Router) {}

  view(id: string) {
    this.router.navigate(['/profile', id]);
  }

  follow(event: FollowEvent) {
    console.log(`Id: ${event.id}; Follow: ${event.following}`);
  }
}
