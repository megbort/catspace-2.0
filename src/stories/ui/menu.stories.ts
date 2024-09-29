import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { MenuComponent } from '../../app/components/menu/menu.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../../app/shared/config/translate';
import { provideHttpClient } from '@angular/common/http';

const meta: Meta<MenuComponent> = {
  title: 'Components/Menu',
  component: MenuComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideHttpClient()],
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
