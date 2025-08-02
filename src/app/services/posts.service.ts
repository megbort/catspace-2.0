import { inject, Injectable } from '@angular/core';
import { Post } from './models';
import { from, Observable } from 'rxjs';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';

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

    return from(setDoc(postRef, postData).then(() => postRef.id));
  }
}
