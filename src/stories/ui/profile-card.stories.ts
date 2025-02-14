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
  description:
    "Hello! I'm Luna, the fluffiest boss around. I spend my days napping in sunbeams and pretending not to care about your attention... but don't be fooled—I control everything. Pet me if you must, but only for 3 seconds, then I'll claw your hand. My real passion? Pushing your things off ledges just to see what happens. Feed me at exactly 6 p.m., or else...",
  followers: 205,
  tags: ['#mysterious', '#paws', '#moonlight', '#elegant'],
  posts: [],
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
