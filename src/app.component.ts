import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  RouterOutlet,
  RouterModule,
  Router,
  NavigationEnd,
} from '@angular/router';
import { filter, skip } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './app/components/menu/menu.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { UserSidenavComponent } from './app/components/user-sidenav/user-sidenav.component';
import { LoaderComponent } from './app/components/ui/loader.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AuthService, LoaderService } from './app/services';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MenuComponent,
    FooterComponent,
    UserSidenavComponent,
    LoaderComponent,
    MatSidenavModule,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild('profileDrawer') profileDrawer!: MatSidenav;

  private readonly main = viewChild<ElementRef<HTMLElement>>('main');
  private readonly destroyRef = inject(DestroyRef);

  authService = inject(AuthService);
  router = inject(Router);
  loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.loaderService.show();

    this.authService.initializeUser();

    this.authService.isInitialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        this.loaderService.hide();
      }
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.main()?.nativeElement.focus({ preventScroll: true }));
  }

  focusMain(event: Event): void {
    event.preventDefault();
    this.main()?.nativeElement.focus();
  }

  onSidenavToggle(isOpened: boolean): void {
    document.body.style.overflow = isOpened ? 'hidden' : '';
  }
}
