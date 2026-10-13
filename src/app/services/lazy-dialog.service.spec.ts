import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LazyDialogService } from './lazy-dialog.service';
import { NotificationService } from './notification.service';

@Component({ template: '' })
class TestDialogComponent {}

@Component({ template: '' })
class OtherDialogComponent {}

describe('LazyDialogService', () => {
  let service: LazyDialogService;
  const dialogRef = { id: 'ref' };
  const mockDialog = { open: vi.fn(() => dialogRef) };
  const mockNotification = { error: vi.fn() };
  const mockTranslate = { instant: vi.fn((key: string) => key) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: NotificationService, useValue: mockNotification },
        { provide: TranslateService, useValue: mockTranslate },
      ],
    });
    service = TestBed.inject(LazyDialogService);
  });

  it('opens the loaded component with the given config', async () => {
    const config = { width: '500px' };
    const ref = await service.open(() => Promise.resolve(TestDialogComponent), config);

    expect(mockDialog.open).toHaveBeenCalledWith(TestDialogComponent, config);
    expect(ref).toBe(dialogRef);
  });

  it('shows an error and returns null when the component fails to load', async () => {
    const ref = await service.open(() => Promise.reject(new Error('chunk failed')));

    expect(ref).toBeNull();
    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(mockNotification.error).toHaveBeenCalledWith('common.dialogLoadFailed');
  });

  it('ignores any other dialog request while a load is pending', async () => {
    let resolveLoad!: (component: typeof TestDialogComponent) => void;
    const pending = new Promise<typeof TestDialogComponent>((resolve) => {
      resolveLoad = resolve;
    });

    const first = service.open(() => pending);
    const second = await service.open(() => Promise.resolve(OtherDialogComponent));
    resolveLoad(TestDialogComponent);
    await first;

    expect(second).toBeNull();
    expect(mockDialog.open).toHaveBeenCalledTimes(1);
    expect(mockDialog.open).toHaveBeenCalledWith(TestDialogComponent, undefined);
  });

  it('allows a new attempt after a failed load', async () => {
    await service.open(() => Promise.reject(new Error('chunk failed')));
    const ref = await service.open(() => Promise.resolve(TestDialogComponent));

    expect(ref).toBe(dialogRef);
  });
});
