import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared/config/translate';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GlobalStore } from '../app/shared';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../app/components/auth/signup/signup.component';
import { AuthService, LoaderService } from '../app/services';
import { signal } from '@angular/core';

const meta: Meta<SignupComponent> = {
  title: 'Components/Auth/SignUp',
  component: SignupComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(withFetch()),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              params: {},
            },
          },
        },
        GlobalStore,
        LoaderService,
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        AuthService,
        {
          provide: AuthService,
          useValue: {
            login: () => of(void 0),
            logout: () => of(void 0),
            register: () => of(void 0),
            user$: of(null),
            currentUserSignal: signal(null),
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
type Story = StoryObj<SignupComponent>;

export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
      <div style="max-width: 500px;">
        <app-signup></app-signup>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      await canvas.findByLabelText('Profile Name'),
      'Tabby Cat',
    );
    await userEvent.type(canvas.getByLabelText('Handle'), 'tabbycat');
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(await canvas.findByLabelText('Email')).toBeVisible();
    await expect(canvas.getByLabelText('Password')).toBeVisible();
  },
};
