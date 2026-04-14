import { signal } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import {
  applicationConfig,
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { of } from 'rxjs';
import { PostDetailComponent } from '../app/components/post-detail/post-detail.component';
import {
  AuthService,
  FavoriteService,
  NotificationService,
  Post,
  USERS,
} from '../app/services';
import { storybookTranslateConfig } from '../app/shared';

const post: Post = USERS[0].posts[0];

const meta: Meta<PostDetailComponent> = {
  title: 'Components/Post Detail',
  component: PostDetailComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(withFetch()),
        {
          provide: FavoriteService,
          useValue: {
            favoritePost: () => of(void 0),
            unfavoritePost: () => of(void 0),
            isPostFavorited: () => of(false),
            getPostFavoriteCount: () => of(20),
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
            success: () => {},
            error: () => {},
            warning: () => {},
          },
        },
      ],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
    }),
    componentWrapperDecorator(
      (story) =>
        `<div style="max-width: 750px; margin: 2rem auto; padding: 0 1rem;">${story}</div>`,
    ),
  ],
  args: {
    post,
  },
};

export default meta;
type Story = StoryObj<PostDetailComponent>;

export const Primary: Story = {};
