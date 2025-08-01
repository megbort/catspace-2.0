import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { UserSidenavComponent } from '../app/components/user-sidenav/user-sidenav.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { signal } from '@angular/core';
import { USER } from '../app/services/mocks';
import { AuthService } from '../app/services';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const meta: Meta<UserSidenavComponent> = {
  title: 'Components/User Sidenav',
  component: UserSidenavComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        {
          provide: AuthService,
          useValue: {
            login: () => of(void 0),
            logout: () => of(void 0),
            register: () => of(void 0),
            user$: of(null),
            currentUserSignal: signal(USER),
          },
        },
        {
          provide: ActivatedRoute,
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
type Story = StoryObj<UserSidenavComponent>;

export const Primary: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <app-user-sidenav></app-user-sidenav>
      </div>
    `,
  }),
};
