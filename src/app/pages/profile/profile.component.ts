import { Component } from '@angular/core';
import { Post, Profile, ProfileService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, MatButtonModule, PostCardComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  profile?: Profile;
  placeholders = Array(9).fill(0);
  posts: Post[] = [];

  constructor(
    readonly route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

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
            if (data) {
              this.profile = data;
              this.posts = data.posts;
            }
          });
      }
    });
  }
}
