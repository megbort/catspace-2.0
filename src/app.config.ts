import {
  ApplicationConfig,
  DOCUMENT,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  InMemoryScrollingOptions,
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import {
  defaultTranslateProviders,
  SUPPORTED_LANGUAGES,
} from './app/shared/config/translate';
import { GlobalStore, TranslatedTitleStrategy } from './app/shared';

function initializeLanguage(translate: TranslateService, document: Document) {
  return () => {
    const browserLang = navigator.language?.split('-')[0] ?? 'en';
    const lang = SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
    document.documentElement.lang = lang;
    translate.addLangs(SUPPORTED_LANGUAGES);
    return translate.use(lang);
  };
}

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingConfig = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, inMemoryScrollingConfig),
    provideHttpClient(),
    defaultTranslateProviders,
    provideAppInitializer(() => initializeLanguage(inject(TranslateService), inject(DOCUMENT))()),
    GlobalStore,
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
  ],
};
