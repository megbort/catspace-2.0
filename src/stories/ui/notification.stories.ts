import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NotificationComponent } from '../../app/components/notification/notification.component';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

const meta: Meta<NotificationComponent> = {
  title: 'Design System/Notification',
  component: NotificationComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideHttpClient(withFetch())],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { message: 'Default message', type: 'success' },
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: () => {},
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<NotificationComponent>;

export const Success: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `<app-notification></app-notification>`,
    moduleMetadata: {
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            message: 'Your changes have been saved successfully!',
            type: 'success',
          },
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: () => console.log('Dismissed'),
          },
        },
      ],
    },
  }),
};

export const ErrorState: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `<app-notification></app-notification>`,
    moduleMetadata: {
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            message: 'Failed to save changes. Please try again.',
            type: 'error',
          },
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: () => console.log('Dismissed'),
          },
        },
      ],
    },
  }),
};

export const Warning: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `<app-notification></app-notification>`,
    moduleMetadata: {
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            message: 'Your session will expire in 5 minutes.',
            type: 'warning',
          },
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: () => console.log('Dismissed'),
          },
        },
      ],
    },
  }),
};
