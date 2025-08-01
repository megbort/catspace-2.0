import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CreatePostComponent } from '../app/components/create-post/create-post.component';
import { MatDialogRef } from '@angular/material/dialog';

const meta: Meta<CreatePostComponent> = {
  title: 'Components/Create Post',
  component: CreatePostComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
            closeAll: () => {},
          },
        },
      ],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
    }),
  ],
};

export default meta;
type Story = StoryObj<CreatePostComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <app-create-post></app-create-post>
      </div>
    `,
  }),
};
