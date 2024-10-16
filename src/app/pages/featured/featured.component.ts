import { Component } from '@angular/core';
import { PROFILES } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [TranslateModule, ProfileCardComponent],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent {
  profiles = PROFILES;
}
