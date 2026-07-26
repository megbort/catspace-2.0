import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { PostCardComponent } from '../app/components/post-card/post-card.component';
import {
  USERS,
  mockPost,
  FavoriteService,
  AuthService,
  NotificationService,
} from '../app/services';
import { of } from 'rxjs';
import { signal } from '@angular/core';

const post = mockPost;

const meta: Meta<PostCardComponent> = {
  title: 'Components/Post Card',
  component: PostCardComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(withFetch()),
        {
          provide: FavoriteService,
          useValue: {
            favoritePost: () => of(void 0),
            unfavoritePost: () => of(void 0),
            getUserFavorites: () => of([]),
            getPostFavoriteCount: () => of(5),
            isPostFavorited: () => of(false),
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(post.title)).toBeVisible();
    const favoriteButton = canvas.getByRole('button', {
      name: 'Add to favorites',
    });
    await expect(favoriteButton).toBeVisible();
    await userEvent.click(favoriteButton);
  },
};
