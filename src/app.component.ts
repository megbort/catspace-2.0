import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './app/components/menu/menu.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { UserSidenavComponent } from './app/components/user-sidenav/user-sidenav.component';
import { LoaderComponent } from './app/components/ui/loader.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './app/services';
import { filter, take } from 'rxjs/operators';

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

  ngOnInit(): void {
    this.authService.initializeUser();
    this.handleInitialRedirect();
  }

  private handleInitialRedirect(): void {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== undefined),
        take(1)
      )
      .subscribe((user) => {
        if (user && this.router.url === '/home') {
          this.router.navigate(['/featured']);
        }
      });
  }

  onSidenavToggle(isOpened: boolean): void {
    document.body.style.overflow = isOpened ? 'hidden' : '';
  }
}
