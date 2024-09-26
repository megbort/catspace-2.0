import { Meta, type StoryObj } from '@storybook/angular';
import { MenuComponent } from '../../app/app/components/menu/menu.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';

const meta: Meta<MenuComponent> = {
  title: 'Components/Menu',
  component: MenuComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

export default meta;
type Story = StoryObj<MenuComponent>;

export const Primary: Story = {
  args: {},
};
