import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { SkeletonComponent } from '../../app/components/ui/skeleton.component';

const meta: Meta<SkeletonComponent> = {
  title: 'Design System/Skeleton',
  component: SkeletonComponent,
  decorators: [
    moduleMetadata({
      imports: [SkeletonComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<SkeletonComponent>;

export const Default: Story = {
  render: () => ({
    template: `
			<app-skeleton [width]="250" [height]="250"></app-skeleton>
		`,
  }),
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.skeleton');
    await expect(skeleton).toBeInTheDocument();
    await expect(skeleton).toHaveStyle({ width: '250px', height: '250px' });
  },
};
