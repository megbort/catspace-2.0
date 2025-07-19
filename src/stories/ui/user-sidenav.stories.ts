import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { UserSidenavComponent } from '../../app/components/user-sidenav/user-sidenav.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore, storybookTranslateConfig } from '../../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { USER } from '../../app/services/mocks';

class MockGlobalStore {
  private readonly userSignal = signal(USER);
  user = computed(() => this.userSignal());
}

const meta: Meta<UserSidenavComponent> = {
  title: 'Components/User Sidenav',
  component: UserSidenavComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        { provide: GlobalStore, useClass: MockGlobalStore },
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
