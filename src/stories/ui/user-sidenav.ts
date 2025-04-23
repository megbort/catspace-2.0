import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { ProfileCardComponent } from '../../app/components/profile-card/profile-card.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore, storybookTranslateConfig } from '../../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Profile, PROFILES } from '../../app/services';

const profile: Profile = PROFILES[0];

const meta: Meta<ProfileCardComponent> = {
  title: 'Components/Profile Menu',
  component: ProfileCardComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        GlobalStore,
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
