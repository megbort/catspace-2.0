import { Component } from '@angular/core';
import { Profile, PROFILES } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profile?: Profile;

  constructor(readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.profile = PROFILES.find((profile) => profile.id === id);
    }
  }
}
