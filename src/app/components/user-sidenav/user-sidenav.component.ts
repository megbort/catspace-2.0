import { Component, output, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore } from '../../shared';

@Component({
  selector: 'app-user-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.scss'],
})
export class UserSidenavComponent {
  close = output<void>();
  user = computed(() => this.globalStore.user());

  constructor(private readonly globalStore: GlobalStore) {}
}
