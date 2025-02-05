import { Component } from '@angular/core';
import { Post, USER } from '../../services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  post: Post = USER.posts[0];
}
