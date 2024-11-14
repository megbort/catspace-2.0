import { Injectable } from '@angular/core';
import { Profile } from './models';
import { PROFILES } from './mocks';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  getProfiles(): Observable<Profile[]> {
    return of(PROFILES);
  }

  getProfileById(id: string): Observable<Profile> {
    const profile = PROFILES.find((profile) => profile.id === id);

    if (profile) {
      return of(profile);
    } else {
      return throwError(() => new Error(`No profile found with id: ${id}`));
    }
  }
}
