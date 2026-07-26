import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { ProfileCardComponent } from '../app/components/profile-card/profile-card.component';
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
  FOLLOWERS,
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
            getFollowers: () => of(FOLLOWERS),
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(profile.name)).toBeVisible();
    await expect(canvas.getByText(`@${profile.handle}`)).toBeVisible();
    await expect(
      await canvas.findByRole('button', { name: 'View Profile' }),
    ).toBeVisible();
    await expect(await canvas.findByText('Follow')).toBeVisible();
  },
};
