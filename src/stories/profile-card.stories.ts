import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { ProfileCardComponent } from '../app/components/profile-card/profile-card.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  AuthService,
  User,
  USERS,
  UserService,
  FollowService,
} from '../app/services';
import { of } from 'rxjs';
import { signal } from '@angular/core';

const profile: User = USERS[0];

const meta: Meta<ProfileCardComponent> = {
  title: 'Components/Profile Card',
  component: ProfileCardComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
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
          provide: FollowService,
          useValue: {
            followUser: () => of(void 0),
            unfollowUser: () => of(void 0),
            getFollowing: () => of([]),
            getFollowers: () =>
              of([
                {
                  id: '1',
                  userId: 'user1',
                  followedAt: '2024-01-01T00:00:00.000Z',
                },
                {
                  id: '2',
                  userId: 'user2',
                  followedAt: '2024-01-02T00:00:00.000Z',
                },
              ]),
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
type Story = StoryObj<ProfileCardComponent>;

export const Primary: Story = {
  args: {
    profile: profile,
  },
};
