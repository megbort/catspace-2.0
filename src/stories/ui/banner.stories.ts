import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BannerComponent } from '../../app/components/ui/banner.component';

const meta: Meta<BannerComponent> = {
  title: 'Design System/Banner',
  component: BannerComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideHttpClient(withFetch())],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
    }),
  ],
};

export default meta;
type Story = StoryObj<BannerComponent>;

export const Default: Story = {
  args: {
    content: 'This is a banner message. Please pay attention to it!',
  },
};
