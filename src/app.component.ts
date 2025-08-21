import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
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
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('profileDrawer') profileDrawer!: MatSidenav;

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
  }

  onSidenavToggle(isOpened: boolean): void {
    document.body.style.overflow = isOpened ? 'hidden' : '';
  }
}
