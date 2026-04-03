import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { defaultTranslateConfig } from './app/shared/config/translate';
import { GlobalStore } from './app/shared';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingConfig = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, inMemoryScrollingConfig),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    importProvidersFrom(TranslateModule.forRoot(defaultTranslateConfig)),
    GlobalStore,
  ],
};
