import { Component } from '@angular/core';
import { Profile, PROFILES } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslateModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profile?: Profile;
  placeholders = Array(9).fill(0);

  constructor(readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.profile = PROFILES.find((profile) => profile.id === id);
    }
  }
}
