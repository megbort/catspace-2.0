import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../../services';
import { User } from '../../services/models';
import { redirectIfAuthenticatedGuard } from './auth.guard';

describe('redirectIfAuthenticatedGuard', () => {
  const followingTree = {} as UrlTree;
  const mockRouter = { createUrlTree: vi.fn(() => followingTree) };
  let currentUser: ReturnType<typeof signal<User | null | undefined>>;
  let isInitialized: ReturnType<typeof signal<boolean>>;

  const runGuard = () =>
    TestBed.runInInjectionContext(
      () =>
        redirectIfAuthenticatedGuard({} as never, {} as never) as Observable<
          boolean | UrlTree
        >,
    );

  const resolveAuth = (user: User | null) => {
    currentUser.set(user);
    isInitialized.set(true);
    TestBed.tick();
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
    currentUser = signal<User | null | undefined>(undefined);
    isInitialized = signal(false);
    TestBed.overrideProvider(AuthService, {
      useFactory: () => ({
        currentUser$: toObservable(currentUser),
        isInitialized$: toObservable(isInitialized),
      }),
    });
  });

  it('waits for auth, then redirects a signed-in user to /following', async () => {
    const decision = firstValueFrom(runGuard());
    resolveAuth({ id: 'uid1' } as User);

    expect(await decision).toBe(followingTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/following']);
  });

  it('waits for auth, then allows a signed-out visitor', async () => {
    const decision = firstValueFrom(runGuard());
    resolveAuth(null);

    expect(await decision).toBe(true);
  });
});
