import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-user-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule],
  templateUrl: './user-sidenav.component.html',
})
export class UserSidenavComponent {
  @Output() closeDrawer = new EventEmitter<void>();

  close() {
    this.closeDrawer.emit();
    document.body.style.overflow = '';
  }
}
