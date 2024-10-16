import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../services';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, RouterModule],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {
  @Input() profile?: Profile;
}
