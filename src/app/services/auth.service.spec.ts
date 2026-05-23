import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
  user: vi.fn(() => of(null)),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(() => Promise.resolve()),
}));

const mockRouter = { navigate: vi.fn() };
const mockUserService = {
  getUserProfileById: vi.fn(),
  createUserProfile: vi.fn(),
};
const mockFirebaseAuth = { signOut: vi.fn(() => Promise.resolve()) };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockFirebaseAuth },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  describe('initializeUser', () => {
    it('sets currentUserSignal to null and marks initialized when no Firebase user', () => {
      service.user$ = of(null) as any;
      service.initializeUser();

      expect(service.currentUserSignal()).toBeNull();
      expect(service.isInitialized()).toBe(true);
    });

    it('loads user profile and sets currentUserSignal when Firebase user exists', async () => {
      mockUserService.getUserProfileById.mockResolvedValue({
        handle: 'kikuKrenn', name: 'Kiku Krenbrink', image: 'img.jpg',
        description: 'A cat', posts: [], following: [], favorites: [], followers: [], tags: [],
      });

      service.user$ = of({ uid: 'uid1', email: 'kiku@example.com', displayName: 'Kiku' }) as any;
      service.initializeUser();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const user = service.currentUserSignal();
      expect(user).not.toBeNull();
      expect(user?.id).toBe('uid1');
      expect(user?.handle).toBe('kikuKrenn');
      expect(service.isInitialized()).toBe(true);
    });

    it('sets currentUserSignal to null when profile load fails', async () => {
      mockUserService.getUserProfileById.mockRejectedValue(new Error('Firestore error'));

      service.user$ = of({ uid: 'uid1', email: 'kiku@example.com' }) as any;
      service.initializeUser();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(service.currentUserSignal()).toBeNull();
      expect(service.isInitialized()).toBe(true);
    });
  });

  describe('login', () => {
    it('calls signInWithEmailAndPassword and navigates to /following on success', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: { uid: 'uid1' } } as any);

      await firstValueFrom(service.login('kiku@example.com', 'password'));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/following']);
    });
  });

  describe('logout', () => {
    it('clears currentUserSignal immediately', () => {
      service.logout();
      expect(service.currentUserSignal()).toBeNull();
    });

    it('navigates to /home after sign-out completes', async () => {
      service.logout();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('register', () => {
    it('creates a Firebase user and then saves the profile', async () => {
      const { createUserWithEmailAndPassword } = await import('@angular/fire/auth');
      const mockCredential = {
        user: { uid: 'new-uid', getIdToken: vi.fn(() => Promise.resolve('token')) },
      };
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockCredential as any);
      mockUserService.createUserProfile.mockResolvedValue(undefined);

      await firstValueFrom(
        service.register('kiku@example.com', 'password', {
          name: 'Kiku', handle: 'kiku', description: 'A cat',
        }),
      );

      expect(vi.mocked(createUserWithEmailAndPassword)).toHaveBeenCalledWith(
        mockFirebaseAuth,
        'kiku@example.com',
        'password',
      );
      expect(mockUserService.createUserProfile).toHaveBeenCalledWith(
        'new-uid',
        expect.objectContaining({ name: 'Kiku', handle: 'kiku', email: 'kiku@example.com' }),
      );
    });
  });
});
