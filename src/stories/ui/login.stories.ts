import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { LoginComponent } from '../../app/components/auth/login/login.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../../app/shared/config/translate';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GlobalStore } from '../../app/shared';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const meta: Meta<LoginComponent> = {
  title: 'Components/Login',
  component: LoginComponent,
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
        GlobalStore,
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
type Story = StoryObj<LoginComponent>;

export const Primary: Story = {
  args: {},
};
