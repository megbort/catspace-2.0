import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule],
  template: `
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/20 z-[9999] transition-opacity duration-300"
      [class.opacity-0]="!isVisible"
      [class.invisible]="!isVisible"
      [class.opacity-100]="isVisible"
      [class.visible]="isVisible"
    >
      <div class="flex items-center justify-center">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
})
export class LoaderComponent {
  private readonly loaderService = inject(LoaderService);

  get isVisible() {
    return this.loaderService.isLoading();
  }
}
