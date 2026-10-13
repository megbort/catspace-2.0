import { Meta, type StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { UserSidenavComponent } from '../app/components/user-sidenav/user-sidenav.component';
import { applicationConfig } from '@storybook/angular';
import { storybookTranslateProviders } from '../app/shared';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { mockUser } from '../app/services/mocks';
import { AuthService } from '../app/services';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const meta: Meta<UserSidenavComponent> = {
  title: 'Components/User Sidenav',
  component: UserSidenavComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        storybookTranslateProviders,
        {
          provide: AuthService,
          useValue: {
            login: () => of(void 0),
            logout: () => of(void 0),
            register: () => of(void 0),
            user$: of(null),
            currentUserSignal: signal(mockUser),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UserSidenavComponent>;

export const Primary: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <app-user-sidenav></app-user-sidenav>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(mockUser.name)).toBeVisible();
    await expect(canvas.getByText(`@${mockUser.handle}`)).toBeVisible();
    await expect(
      await canvas.findByRole('button', { name: 'Edit Profile' }),
    ).toBeVisible();
  },
};
