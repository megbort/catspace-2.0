import { inject, Injectable } from '@angular/core';
import { User } from './models';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore = inject(Firestore);

  createUserProfile(
    uid: string,
    profile: {
      name: string;
      handle: string;
      description: string;
      email: string;
    }
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, {
      ...profile,
      createdAt: new Date().toISOString(),
    });
  }

  async getUserProfileById(uid: string): Promise<User | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          email: data.email || '',
          image: data.image || '',
          handle: data.handle || '',
          name: data.name || '',
          description: data.description || '',
          posts: data.posts || [],
          following: data.following || [],
          favorites: data.favorites || [],
          followers: data.followers || [],
          tags: data.tags || [],
          followerCount: data.followerCount,
          followingCount: data.followingCount,
          postCount: data.postCount,
        } as User;
      }
      return null;
    });
  }

  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');

    return collectionData(usersCollection, { idField: 'id' }).pipe(
      map((users) =>
        users.map(
          (user: any) =>
            ({
              id: user.id || '',
              email: user.email || '',
              image: user.image || '',
              handle: user.handle || '',
              name: user.name || '',
              description: user.description || '',
              posts: user.posts || [],
              following: user.following || [],
              favorites: user.favorites || [],
              followers: user.followers || [],
              tags: user.tags || [],
              followerCount: user.followerCount,
              followingCount: user.followingCount,
              postCount: user.postCount,
            } as User)
        )
      ),
      catchError((error) => {
        console.error('Error fetching Firestore data: ', error);
        return of([] as User[]);
      })
    );
  }

  updateUserProfile(
    uid: string,
    updates: {
      name?: string;
      handle?: string;
      description?: string;
      image?: string;
    }
  ): Observable<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(
      updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      }).catch((error) => {
        console.error('Error updating user profile:', error);
        throw error;
      })
    );
  }

  getUserById(id: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${id}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            email: data.email || '',
            image: data.image || '',
            handle: data.handle || '',
            name: data.name || '',
            description: data.description || '',
            posts: data.posts || [],
            following: data.following || [],
            favorites: data.favorites || [],
            followers: data.followers || [],
            tags: data.tags || [],
            followerCount: data.followerCount,
            followingCount: data.followingCount,
            postCount: data.postCount,
          } as User;
        }
        throw new Error(`No user found with id: ${id}`);
      }),
      catchError((error) => {
        console.error(`Error fetching user with id ${id}:`, error);
        return throwError(() => new Error(`No user found with id: ${id}`));
      })
    );
  }
}
