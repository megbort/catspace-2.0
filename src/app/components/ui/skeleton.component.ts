import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="skeleton"
      [style.width]="resolvedWidth()"
      [style.height]="resolvedHeight()"
    ></div>
  `,
  styles: [
    `
      .skeleton {
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.08) 25%,
          rgba(0, 0, 0, 0.14) 37%,
          rgba(0, 0, 0, 0.08) 63%
        );
        background-size: 400% 100%;
        animation: skeleton-shimmer 1.4s ease-in-out infinite;
      }

      @keyframes skeleton-shimmer {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0 0;
        }
      }

      :host-context(.dark-theme) .skeleton {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.12) 25%,
          rgba(255, 255, 255, 0.2) 37%,
          rgba(255, 255, 255, 0.12) 63%
        );
        background-size: 400% 100%;
      }
    `,
  ],
})
export class SkeletonComponent {
  width = input<string | number>('100%');
  height = input<string | number>('1rem');

  protected readonly resolvedWidth = computed(() =>
    this.toCssSize(this.width()),
  );
  protected readonly resolvedHeight = computed(() =>
    this.toCssSize(this.height()),
  );

  private toCssSize(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }
}
