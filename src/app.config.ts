import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { defaultTranslateConfig } from './app/shared/config/translate';
import { GlobalStore } from './app/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
