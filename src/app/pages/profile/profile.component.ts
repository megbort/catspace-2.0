import { Component } from '@angular/core';
import { Post, Profile, ProfileService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, MatButtonModule, PostCardComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  profile?: Profile;
  posts: Post[] = [];

  constructor(
    readonly route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      if (id) {
        this.readProfile(id);
      }
    });
  }

  readProfile(id: string): void {
    this.profileService
      .getProfileById(id)
      .pipe()
      .subscribe((data) => {
        if (data) {
          this.profile = data;
          this.posts = data.posts;
        }
      });
  }
}
