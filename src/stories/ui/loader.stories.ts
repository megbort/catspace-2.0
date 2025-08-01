import type { Meta, StoryObj } from '@storybook/angular';
import { LoaderComponent } from '../../app/components/ui/loader.component';
import { LoaderService } from '../../app/services/loader.service';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

class MockLoaderService {
  private readonly _isLoading = signal(true);
  readonly isLoading = this._isLoading.asReadonly();

  show(): void {
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
  }
}

const meta: Meta<LoaderComponent> = {
  title: 'Design System/Loader',
  component: LoaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        { provide: LoaderService, useClass: MockLoaderService },
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
