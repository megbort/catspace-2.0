import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'catspace-theme';
  private readonly mode = signal<ThemeMode>(this.getInitialTheme());

  readonly theme = this.mode.asReadonly();

  constructor() {
    this.applyTheme(this.mode());
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.mode() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    this.mode.set(theme);
    this.applyTheme(theme);
    globalThis.localStorage?.setItem(this.storageKey, theme);
  }

  private getInitialTheme(): ThemeMode {
    const savedTheme = globalThis.localStorage?.getItem(this.storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    const prefersDark =
      globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    globalThis.document?.documentElement.classList.toggle(
      'dark-theme',
      theme === 'dark',
    );
  }
}
