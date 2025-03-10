import { inject, Injectable } from '@angular/core';
import { USER } from './mocks';
import { Post } from './models';
import { catchError, Observable, of, throwError } from 'rxjs';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore = inject(Firestore);

  getUsers(): Observable<any> {
    const usersCollection = collection(this.firestore, 'users');

    return collectionData(usersCollection, { idField: 'id' }).pipe(
      catchError((error) => {
        console.error('Error fetching Firestore data: ', error);
        return of([]);
      })
    );
  }

  getPosts(): Observable<Post[]> {
    return of(USER.posts);
  }

  getPostById(id: string): Observable<Post> {
    const post = USER.posts.find((post) => post.id === id);
    if (post) {
      return of(post);
    } else {
      return throwError(() => new Error(`No post found with id: ${id}`));
    }
  }
}
