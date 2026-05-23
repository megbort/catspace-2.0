import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  function createService(): ThemeService {
    TestBed.configureTestingModule({});
    return TestBed.inject(ThemeService);
  }

  describe('initial theme detection', () => {
    it('uses saved light theme from localStorage', () => {
      localStorage.setItem('catspace-theme', 'light');
      expect(createService().theme()).toBe('light');
    });

    it('uses saved dark theme from localStorage', () => {
      localStorage.setItem('catspace-theme', 'dark');
      expect(createService().theme()).toBe('dark');
    });

    it('falls back to system dark preference when no saved theme', () => {
      vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
      expect(createService().theme()).toBe('dark');
      vi.unstubAllGlobals();
    });

    it('defaults to light when system prefers light and no saved theme', () => {
      vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
      expect(createService().theme()).toBe('light');
      vi.unstubAllGlobals();
    });
  });

  describe('setTheme', () => {
    let service: ThemeService;

    beforeEach(() => {
      service = createService();
    });

    it('updates the theme signal', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
    });

    it('persists the choice to localStorage', () => {
      service.setTheme('dark');
      expect(localStorage.getItem('catspace-theme')).toBe('dark');
    });

    it('adds dark-theme class to documentElement when set to dark', () => {
      service.setTheme('dark');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    it('removes dark-theme class when switching to light', () => {
      service.setTheme('dark');
      service.setTheme('light');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('switches from light to dark', () => {
      localStorage.setItem('catspace-theme', 'light');
      const service = createService();
      service.toggleTheme();
      expect(service.theme()).toBe('dark');
    });

    it('switches from dark to light', () => {
      localStorage.setItem('catspace-theme', 'dark');
      const service = createService();
      service.toggleTheme();
      expect(service.theme()).toBe('light');
    });
  });
});
