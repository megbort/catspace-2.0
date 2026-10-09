import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

// @unpic/angular has no priority input and always writes loading="lazy",
// so LCP images opt back into eager, high-priority loading after it runs.
@Directive({ selector: 'img[appPriorityImage]' })
export class PriorityImageDirective {
  constructor() {
    const image = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

    afterNextRender(() => {
      image.loading = 'eager';
      image.setAttribute('fetchpriority', 'high');
    });
  }
}
