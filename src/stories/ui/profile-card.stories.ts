import { Meta, type StoryObj } from '@storybook/angular';
import { ProfileCardComponent } from '../../app/components/profile-card/profile-card.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';

const meta: Meta<ProfileCardComponent> = {
  title: 'Components/Profile Card',
  component: ProfileCardComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProfileCardComponent>;

export const Primary: Story = {
  args: {},
};
