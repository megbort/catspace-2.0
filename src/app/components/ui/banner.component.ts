import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-banner',
  imports: [MatProgressSpinnerModule],
  template: `
    <div
      class="text-center text-caption p-2 bg-catspace-brown text-catspace-white"
    >
      <p>{{ content() }}</p>
    </div>
  `,
})
export class BannerComponent {
  content = input<string>('');
}
