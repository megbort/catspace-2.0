import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="mb-16 py-24 px-4 min-h-[575px] max-w-2xl mx-auto flex flex-col items-center gap-6 text-center"
    >
      <span class="material-icons icon-36 text-catspace-orange" aria-hidden="true">
        pets
      </span>
      <h1 class="h2">{{ 'notFound.title' | translate }}</h1>
      <p class="text-body-1">{{ 'notFound.message' | translate }}</p>
      <div class="flex flex-wrap justify-center gap-6">
        <a class="text-body-1 underline" routerLink="/home">
          {{ 'notFound.home' | translate }}
        </a>
        <a class="text-body-1 underline" routerLink="/featured">
          {{ 'notFound.featured' | translate }}
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
