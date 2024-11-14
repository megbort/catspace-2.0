import { Component } from '@angular/core';
import { Profile, ProfileService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';

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

  constructor(
    readonly route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.profileService
        .getProfileById(id)
        .pipe(
          catchError((error) => {
            console.error(`Error fetching profile: ${error.message}`);
            return of(undefined);
          })
        )
        .subscribe((data) => {
          this.profile = data;
        });
    }
  }
}
