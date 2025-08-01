import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { PostCardComponent } from '../app/components/post-card/post-card.component';
import { Post, USER } from '../app/services';

const post: Post = USER.posts[0];

const meta: Meta<PostCardComponent> = {
  title: 'Components/Post Card',
  component: PostCardComponent,
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
type Story = StoryObj<PostCardComponent>;

export const Primary: Story = {
  args: {
    post,
  },
};
