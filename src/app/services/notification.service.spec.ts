import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { NotificationComponent } from '../components/ui/notification.component';

describe('NotificationService', () => {
  let service: NotificationService;
  const mockSnackBar = { openFromComponent: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: mockSnackBar }],
    });
    service = TestBed.inject(NotificationService);
  });

  it('success() opens snackbar with type "success"', () => {
    service.success('Saved!');
    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      expect.objectContaining({ data: { message: 'Saved!', type: 'success' } }),
    );
  });

  it('error() opens snackbar with type "error"', () => {
    service.error('Something went wrong');
    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      expect.objectContaining({ data: { message: 'Something went wrong', type: 'error' } }),
    );
  });

  it('warning() opens snackbar with type "warning"', () => {
    service.warning('Watch out');
    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      expect.objectContaining({ data: { message: 'Watch out', type: 'warning' } }),
    );
  });

  it('uses 3000ms duration by default', () => {
    service.success('ok');
    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      expect.objectContaining({ duration: 3000 }),
    );
  });

  it('accepts custom config that overrides defaults', () => {
    service.success('ok', { duration: 500 });
    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      expect.objectContaining({ duration: 500 }),
    );
  });
});
