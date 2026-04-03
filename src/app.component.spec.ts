import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MenuComponent } from './app/components/menu/menu.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GlobalStore } from './app/shared';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService, LoaderService } from './app/services';
import { signal } from '@angular/core';

class MockGlobalStore {
  authorized = vi.fn().mockReturnValue(false);
  user = null;
  login = vi.fn();
  logout = vi.fn();
}

class MockActivatedRoute {
  snapshot = {
    data: {
      routeData: 'mockData',
    },
  };
  paramMap = of({
    get: () => 'mockParam',
  });
}

class MockAuthService {
  initializeUser = vi.fn();
  isInitialized$ = of(true);
  isInitialized = signal(true);
  currentUserSignal = signal(null);
}

class MockLoaderService {
  show = vi.fn();
  hide = vi.fn();
  isLoading = signal(false);
}

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    const mockTranslations = {
      'menu.home': 'Home',
      'menu.about': 'About',
    };
    return of(mockTranslations);
  }
}

describe('AppComponent Tests', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MenuComponent,
        FooterComponent,
        RouterOutlet,
        MatButtonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
      providers: [
        { provide: GlobalStore, useClass: MockGlobalStore },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: LoaderService, useClass: MockLoaderService },
      ],
    }).compileComponents();
  });

  it('should successfully create the AppComponent instance', () => {
    // Ensure the AppComponent is successfully created
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should include both the menu and footer components', () => {
    // Check if the MenuComponent and FooterComponent are rendered in the AppComponent
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-menu')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should include a router outlet for dynamic routing', () => {
    // Verify that a <router-outlet> element is present for dynamic routing
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
