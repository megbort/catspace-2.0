import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GlobalStore } from '../../shared';
import { LoaderService } from '../../services';

@Component({
  selector: 'app-following',
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './following.component.html',
})
export class FollowingComponent implements OnInit {
  private readonly globalStore = inject(GlobalStore);
  private readonly loader = inject(LoaderService);

  following = [];
  loading = computed(() => this.globalStore.isLoading());

  ngOnInit(): void {
    this.loader.show();

    // Simulate loading time for fetching following data
    setTimeout(() => {
      this.loader.hide();
    }, 500);
  }
}
