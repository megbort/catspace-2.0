import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { AuthMessageComponent } from '../app/components/auth/auth-message.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared/config/translate';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const meta: Meta<AuthMessageComponent> = {
  title: 'Components/Auth/Message',
  component: AuthMessageComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
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
      ],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
    }),
  ],
};

export default meta;
type Story = StoryObj<AuthMessageComponent>;

export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
      <div style="max-width: 500px;">
        <app-auth-message></app-auth-message>
      </div>
    `,
  }),
};
