import { inject, Injectable } from '@angular/core';
import { User } from './models';
import { catchError, map, Observable, of } from 'rxjs';
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
        return docSnap.data() as User;
      }
      return null;
    });
  }

  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');

    return collectionData(usersCollection, { idField: 'id' }).pipe(
      map((users) => users as User[]),
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
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
}
