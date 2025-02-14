import { Component, Input } from '@angular/core';
import { Post } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { UnpicImageDirective } from '@unpic/angular';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [TranslateModule, UnpicImageDirective],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  @Input() post: Post = {
    id: '',
    title: '',
    image: '',
    favorites: 0,
    tags: [],
    comments: [],
  };
}
