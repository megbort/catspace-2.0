import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import {
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './models';
import { UserService } from './user.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly firebaseAuth = inject(Auth);

  currentUserSignal = signal<User | null | undefined>(undefined);
  currentUser$ = toObservable(this.currentUserSignal);
  isInitialized = signal<boolean>(false);
  isInitialized$ = toObservable(this.isInitialized);
  user$ = user(this.firebaseAuth);

  initializeUser(): void {
    this.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await this.userService.getUserProfileById(
            firebaseUser.uid
          );

          const fullUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            image: profile?.image || '',
            handle: profile?.handle || '',
            name: profile?.name || firebaseUser.displayName || '',
            description: profile?.description || '',
            posts: profile?.posts || [],
            following: profile?.following || [],
            favorites: profile?.favorites || [],
            followers: profile?.followers || [],
            tags: profile?.tags || [],
          };

          this.currentUserSignal.set(fullUser);
        } catch (error) {
          console.error('Error loading user profile:', error);
          this.currentUserSignal.set(null);
        }
      } else {
        this.currentUserSignal.set(null);
      }

      this.isInitialized.set(true);
      this.router.navigate(['/following']);
    });
  }

  register(
    email: string,
    password: string,
    profile: { name: string; handle: string; description: string }
  ): Observable<void> {
    const { name, handle, description } = profile;

    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then(async (response) => {
        const uid = response.user.uid;

        await response.user.getIdToken();
        await updateProfile(response.user, { displayName: name });

        return this.userService.createUserProfile(uid, {
          name,
          handle,
          description,
          email,
        });
      })
      .catch((error) => {
        console.error('Registration error details:', error);
        throw error;
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );

    return from(promise);
  }

  logout(): Observable<void> {
    this.currentUserSignal.set(null);
    const promise = this.firebaseAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.router.navigate(['/home']);
      });
    return from(promise);
  }
}
