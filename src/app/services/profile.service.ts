import {
  inject,
  Injectable,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { Profile } from './models';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';
import { docData, Firestore } from '@angular/fire/firestore';
import {
  collection,
  doc,
  FirestoreDataConverter,
  getDocs,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly firestore = inject(Firestore);
  private readonly environmentInjector = inject(EnvironmentInjector);

  profileConverter: FirestoreDataConverter<Profile> = {
    toFirestore(profile: Profile): any {
      const { id, ...data } = profile;
      return data;
    },
    fromFirestore(snapshot, options): Profile {
      const data = snapshot.data(options) as Omit<Profile, 'id'>;
      return { id: snapshot.id, ...data };
    },
  };

  getProfiles(): Observable<Profile[]> {
    return runInInjectionContext(this.environmentInjector, () => {
      const profilesCollection = collection(
        this.firestore,
        'profiles'
      ).withConverter(this.profileConverter);

      return from(getDocs(profilesCollection)).pipe(
        map((snapshot) => snapshot.docs.map((doc) => doc.data())),
        catchError((error) => {
          console.error('Error fetching Firestore data: ', error);
          return of([]);
        })
      );
    });
  }

  getProfileById(id: string): Observable<Profile> {
    return runInInjectionContext(this.environmentInjector, () => {
      const profileDoc = doc(this.firestore, `profiles/${id}`).withConverter(
        this.profileConverter
      );

      return docData(profileDoc).pipe(
        map((profile) => {
          if (!profile) {
            throw new Error(`No profile found with id: ${id}`);
          }
          return profile;
        }),
        catchError((error) => {
          console.error(`Error fetching profile with id ${id}:`, error);
          return throwError(() => new Error(`No profile found with id: ${id}`));
        })
      );
    });
  }
}
