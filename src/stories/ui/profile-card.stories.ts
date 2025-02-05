import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { ProfileCardComponent } from '../../app/components/profile-card/profile-card.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore, storybookTranslateConfig } from '../../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Profile } from '../../app/services';

const mockProfile: Profile = {
  id: '3',
  image:
    'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  name: 'Luna Moonpurr',
  handle: 'lunathepurr',
  followers: 205,
  tags: ['#mysterious', '#paws', '#moonlight', '#elegant'],
};

const meta: Meta<ProfileCardComponent> = {
  title: 'Components/Profile Card',
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
    profile: mockProfile,
  },
};
