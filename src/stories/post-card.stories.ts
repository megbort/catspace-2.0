import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { PostCardComponent } from '../app/components/post-card/post-card.component';
import {
  Post,
  USERS,
  FavoriteService,
  AuthService,
  NotificationService,
} from '../app/services';
import { of } from 'rxjs';
import { signal } from '@angular/core';

const post: Post = USERS[0].posts[0];

const meta: Meta<PostCardComponent> = {
  title: 'Components/Post Card',
  component: PostCardComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        {
          provide: FavoriteService,
          useValue: {
            favoritePost: () => of(void 0),
            unfavoritePost: () => of(void 0),
            getUserFavorites: () => of([]),
            getPostFavoriteCount: () => of(5),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: () => of(void 0),
            logout: () => of(void 0),
            register: () => of(void 0),
            user$: of(null),
            currentUserSignal: signal(USERS[0]),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            showSuccess: () => {},
            showError: () => {},
            showInfo: () => {},
          },
        },
      ],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
    }),
  ],
};

export default meta;
type Story = StoryObj<PostCardComponent>;

export const Primary: Story = {
  args: {
    post,
  },
};
