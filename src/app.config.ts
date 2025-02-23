import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { defaultTranslateConfig } from './app/shared/config/translate';
import { GlobalStore } from './app/shared';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingConfig = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, inMemoryScrollingConfig),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(TranslateModule.forRoot(defaultTranslateConfig)),
    provideAppInitializer(() => {
      const initializerFn = ((translate: TranslateService) => () => {
        translate.use(translate.defaultLang);
      })(inject(TranslateService));
      return initializerFn();
    }),
    GlobalStore,
  ],
};
