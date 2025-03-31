import { inject, Injectable } from '@angular/core';
import { Post } from './models';
import { Observable } from 'rxjs';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  firestore = inject(Firestore);

  getPostsByProfileId(profileId: string): Observable<Post[]> {
    const postsCollection = collection(
      this.firestore,
      `profiles/${profileId}/posts`
    );
    return collectionData(postsCollection, { idField: 'id' }) as Observable<
      Post[]
    >;
  }
}
