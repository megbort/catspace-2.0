import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CreatePostComponent } from '../app/components/create-post/create-post.component';
import { MatDialogRef } from '@angular/material/dialog';
import {
  AuthService,
  MediaService,
  PostService,
  USERS,
  UserService,
} from '../app/services';
import { of } from 'rxjs';
import { signal } from '@angular/core';

const meta: Meta<CreatePostComponent> = {
  title: 'Components/Create Post',
  component: CreatePostComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
            closeAll: () => {},
          },
        },
        {
          provide: UserService,
          useValue: {
            updateUserProfile: () => Promise.resolve(),
            getUserProfileById: () => Promise.resolve(null),
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
          provide: MediaService,
          useValue: {
            uploadUserAvatar: () => of('https://example.com/avatar.jpg'),
            uploadImage: () => of('https://example.com/image.jpg'),
            uploadPostImage: () => of('https://example.com/post.jpg'),
          },
        },
        {
          provide: PostService,
          useValue: {
            createPost: () => of('test-post-id'),
            generatePostId: () => 'test-post-id',
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
type Story = StoryObj<CreatePostComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <app-create-post></app-create-post>
      </div>
    `,
  }),
};
