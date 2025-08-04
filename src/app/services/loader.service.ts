import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '../shared/state/global.store';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly globalStore = inject(GlobalStore);

  get isLoading() {
    return this.globalStore.isLoading;
  }

  show(): void {
    this.globalStore.setLoading(true);
  }

  hide(): void {
    this.globalStore.setLoading(false);
  }
}
