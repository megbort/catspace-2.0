import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './app/components/menu/menu.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { UserSidenavComponent } from './app/components/user-sidenav/user-sidenav.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './app/services';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MenuComponent,
    FooterComponent,
    UserSidenavComponent,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('profileDrawer') profileDrawer!: MatSidenav;

  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSignal.set({
          email: user.email ?? '',
          handle: user.displayName ?? '',
          name: user.displayName ?? '',
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
      console.log(this.authService.currentUserSignal());
    });
  }

  onSidenavToggle(isOpened: boolean): void {
    document.body.style.overflow = isOpened ? 'hidden' : '';
  }
}
