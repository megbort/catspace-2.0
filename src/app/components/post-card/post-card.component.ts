import { Component } from '@angular/core';
import { PROFILES, Post } from '../../services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  post: Post = PROFILES[0].posts[0];
}
