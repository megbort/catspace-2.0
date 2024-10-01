import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FeaturedProfile } from '../../services';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [TranslateModule, MatButtonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile?: FeaturedProfile;
}
