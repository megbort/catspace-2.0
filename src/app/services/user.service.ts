import { Injectable } from '@angular/core';
import { USER } from './mocks';
import { Post } from './models';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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
