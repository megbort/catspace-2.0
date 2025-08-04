import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore } from '../../shared';

@Component({
  selector: 'app-following',
  imports: [CommonModule, TranslateModule],
  templateUrl: './following.component.html',
})
export class FollowingComponent {
  loading = computed(() => this.globalStore.isLoading());

  private readonly globalStore = inject(GlobalStore);
}
