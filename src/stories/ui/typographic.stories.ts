import { Component, Input } from '@angular/core';
import { StoryObj, Meta } from '@storybook/angular';

@Component({
  selector: 'app-typographic',
  styles: [
    `
      table {
        table-layout: fixed;
        width: 100%;
      }

      th,
      td {
        max-width: 400px;
      }
    `,
  ],
  template: ` <div class="p-4 overflow-y-scroll h-full">
    <table>
      <thead class="text-left">
        <tr>
          <th>Style</th>
          <th>Class/Element</th>
        </tr>
      </thead>
      <tr>
        <td>
          <h1 class="py-2 mr-12">{{ h1 }}</h1>
        </td>
        <td>h1</td>
      </tr>
      <tr>
        <td>
          <h2 class="py-2 mr-12">{{ h2 }}</h2>
        </td>
        <td>h2</td>
      </tr>
      <tr>
        <td>
          <p class="py-2 mr-12 subtitle-1">{{ subtitle1 }}</p>
        </td>
        <td>subtitle-1</td>
      </tr>
      <tr>
        <td>
          <p class="py-2 mr-12 subtitle-2">{{ subtitle2 }}</p>
        </td>
        <td>subtitle-2</td>
      </tr>
      <tr>
        <td>
          <p class="py-2 mr-12 text-body-1">{{ body1 }}</p>
        </td>
        <td>text-body-1</td>
      </tr>
      <tr>
        <td>
          <p class="py-2 mr-12 text-body-2">{{ body2 }}</p>
        </td>
        <td>text-body-2</td>
      </tr>
      <tr>
        <td>
          <p class="py-2 mr-12 text-body-1 text-caption">{{ caption }}</p>
        </td>
        <td>text-caption</td>
      </tr>
    </table>
  </div>`,
})
class TypographicComponent {
  @Input() public h1: string | undefined;
  @Input() public h2: string | undefined;
  @Input() public subtitle1: string | undefined;
  @Input() public subtitle2: string | undefined;
  @Input() public body1: string | undefined;
  @Input() public body2: string | undefined;
  @Input() public caption: string | undefined;
}

export default {
  title: 'Design System/Typography',
  component: TypographicComponent,
  args: {
    h1: 'H1 Headline',
    h2: 'H2 Headline',
    subtitle1: 'Subtitle 1',
    subtitle2: 'Subtitle 2',
    body1: 'The quick brown fox jumps over the lazy dog',
    body2: 'The quick brown fox jumps over the lazy dog',
    caption: 'caption',
  },
} as Meta<TypographicComponent>;

export const Typography: StoryObj<TypographicComponent> = {};
