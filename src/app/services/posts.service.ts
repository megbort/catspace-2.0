import { inject, Injectable, signal } from '@angular/core';
import { Post } from './models';
import { from, Observable, forkJoin, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  firestore = inject(Firestore);

  private readonly _postCreatedSignal = signal<string | null>(null);
  readonly postCreatedSignal = this._postCreatedSignal.asReadonly();

  getPostsByProfileId(profileId: string): Observable<Post[]> {
    const postsCollection = collection(
      this.firestore,
      `users/${profileId}/posts`
    );
    return collectionData(postsCollection, { idField: 'id' }).pipe(
      take(1),
      map((posts) => posts as Post[]),
      catchError((error) => {
        console.error(`Error fetching posts for ${profileId}:`, error);
        return of([]);
      })
    );
  }

  generatePostId(uid: string): string {
    const postsCollection = collection(this.firestore, `users/${uid}/posts`);
    const postRef = doc(postsCollection);
    return postRef.id;
  }

  createPost(
    uid: string,
    post: Omit<Post, 'id'>,
    postId?: string
  ): Observable<string> {
    const postsCollection = collection(this.firestore, `users/${uid}/posts`);
    const postRef = postId
      ? doc(postsCollection, postId)
      : doc(postsCollection);

    const postData = {
      ...post,
      id: postRef.id,
      createdAt: new Date().toISOString(),
    };

    return from(
      setDoc(postRef, postData).then(() => {
        this._postCreatedSignal.set(uid);
        return postRef.id;
      })
    );
  }

  getPostsFromFollowedUsers(followedUserIds: string[]): Observable<Post[]> {
    if (followedUserIds.length === 0) {
      return of([]);
    }

    const postObservables = followedUserIds.map((userId) =>
      this.getPostsByProfileId(userId).pipe(
        map((posts) => posts || []),
        catchError((error: any) => {
          console.warn(`Failed to load posts for user ${userId}:`, error);
          return of([]);
        })
      )
    );

    return forkJoin(postObservables).pipe(
      map((postsArrays) => {
        const allPosts = postsArrays
          .flat()
          .filter((post): post is Post => post?.id != null);

        const sortedPosts = [...allPosts].sort((a: Post, b: Post) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        return sortedPosts;
      }),
      catchError((error: any) => {
        console.error('Error in getPostsFromFollowedUsers forkJoin:', error);
        return of([]);
      })
    );
  }
}
