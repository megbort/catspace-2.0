import type { Meta, StoryObj } from '@storybook/angular';
import { LoaderComponent } from '../../app/components/ui/loader.component';
import { LoaderService } from '../../app/services/loader.service';
import { GlobalStore } from '../../app/shared/state/global.store';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<LoaderComponent> = {
  title: 'Design System/Loader',
  component: LoaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        {
          provide: GlobalStore,
          useFactory: () => {
            const store = new GlobalStore();
            store.setLoading(true);
            return store;
          },
        },
        LoaderService,
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<LoaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `<app-loader></app-loader>`,
  }),
};
