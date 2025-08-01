import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { MenuComponent } from '../app/components/menu/menu.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared/config/translate';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../app/services';
import { signal } from '@angular/core';

const meta: Meta<MenuComponent> = {
  title: 'Components/Menu',
  component: MenuComponent,
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
type Story = StoryObj<MenuComponent>;

export const Primary: Story = {
  args: {},
};
