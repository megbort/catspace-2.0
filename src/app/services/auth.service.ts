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
import { GlobalStore } from '../shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<User | null | undefined>(undefined);

  constructor(
    private readonly userService: UserService,
    private readonly globalStore: GlobalStore,
    private readonly router: Router
  ) {}

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
          };

          this.currentUserSignal.set(fullUser);
          this.globalStore.login(fullUser, true);
        } catch (error) {
          console.error('Error loading user profile:', error);
          this.currentUserSignal.set(null);
          this.globalStore.logout(null, false);
        }
      } else {
        this.currentUserSignal.set(null);
        this.globalStore.logout(null, false);
      }
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
    const promise = this.firebaseAuth.signOut().then(() => {
      this.currentUserSignal.set(null);
      this.globalStore.logout(null, false);
      this.router.navigate(['/home']);
    });
    return from(promise);
  }
}
