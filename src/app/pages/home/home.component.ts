import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { PROFILES, Profile } from '../../services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, TranslateModule, ProfileCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  featured: Profile[] = PROFILES.slice(0, 4);
}
