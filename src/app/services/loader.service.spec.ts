import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { LoaderService } from './loader.service';
import { GlobalStore } from '../shared/state/global.store';

describe('LoaderService', () => {
  let service: LoaderService;
  const isLoading = signal(false);
  const mockStore = { isLoading, setLoading: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: GlobalStore, useValue: mockStore }],
    });
    service = TestBed.inject(LoaderService);
  });

  it('show() calls setLoading(true) on the store', () => {
    service.show();
    expect(mockStore.setLoading).toHaveBeenCalledWith(true);
  });

  it('hide() calls setLoading(false) on the store', () => {
    service.hide();
    expect(mockStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('isLoading delegates to the store signal', () => {
    expect(service.isLoading).toBe(mockStore.isLoading);
  });
});
