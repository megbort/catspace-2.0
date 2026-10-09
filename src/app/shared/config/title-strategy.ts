import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

const APP_NAME = 'Catspace';

@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);

    if (!key) {
      this.title.setTitle(APP_NAME);
      return;
    }

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((page: string) => this.title.setTitle(`${page} | ${APP_NAME}`));
  }
}
