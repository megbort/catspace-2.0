import { inject, Injectable } from '@angular/core';
import { from, Observable, forkJoin, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export interface FavoritePost {
  postId: string;
  postOwnerId: string;
  favoritedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly firestore = inject(Firestore);

  favoritePost(
    userId: string,
    postId: string,
    postOwnerId: string
  ): Observable<void> {
    const userFavoriteDoc = this.getUserFavoriteDoc(userId, postId);
    const postFavoriteDoc = this.getPostFavoriteDoc(
      postOwnerId,
      postId,
      userId
    );

    const favoriteData: FavoritePost = {
      postId,
      postOwnerId,
      favoritedAt: new Date().toISOString(),
    };

    const userFavoriteData = {
      userId,
      favoritedAt: new Date().toISOString(),
    };

    return forkJoin([
      from(setDoc(userFavoriteDoc, favoriteData)),
      from(setDoc(postFavoriteDoc, userFavoriteData)),
    ]).pipe(map(() => undefined));
  }

  /**
   * Remove a post from user's favorites
   */
  unfavoritePost(
    userId: string,
    postId: string,
    postOwnerId: string
  ): Observable<void> {
    const userFavoriteDoc = this.getUserFavoriteDoc(userId, postId);
    const postFavoriteDoc = this.getPostFavoriteDoc(
      postOwnerId,
      postId,
      userId
    );

    return forkJoin([
      from(deleteDoc(userFavoriteDoc)),
      from(deleteDoc(postFavoriteDoc)),
    ]).pipe(map(() => undefined));
  }

  /**
   * Get all posts favorited by a user
   */
  getUserFavorites(userId: string): Observable<FavoritePost[]> {
    const favoritesCollection = collection(
      this.firestore,
      `users/${userId}/favorites`
    );

    return collectionData(favoritesCollection, { idField: 'id' }).pipe(
      take(1),
      map((favorites) => favorites as FavoritePost[]),
      catchError((error) => {
        console.error(`Error fetching favorites for user ${userId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Get all users who favorited a specific post
   */
  getPostFavorites(
    postOwnerId: string,
    postId: string
  ): Observable<{ userId: string; favoritedAt: string }[]> {
    const postFavoritesCollection = collection(
      this.firestore,
      `users/${postOwnerId}/posts/${postId}/favorites`
    );

    return collectionData(postFavoritesCollection, { idField: 'id' }).pipe(
      take(1),
      map(
        (favorites) => favorites as { userId: string; favoritedAt: string }[]
      ),
      catchError((error) => {
        console.error(`Error fetching favorites for post ${postId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Check if a user has favorited a specific post
   */
  isPostFavorited(userId: string, postId: string): Observable<boolean> {
    const userFavoriteDoc = this.getUserFavoriteDoc(userId, postId);

    return from(getDoc(userFavoriteDoc)).pipe(
      map((docSnap) => docSnap.exists()),
      catchError((error) => {
        console.error(`Error checking if post ${postId} is favorited:`, error);
        return of(false);
      })
    );
  }

  /**
   * Get the favorite count for a specific post
   */
  getPostFavoriteCount(
    postOwnerId: string,
    postId: string
  ): Observable<number> {
    return this.getPostFavorites(postOwnerId, postId).pipe(
      map((favorites) => favorites.length)
    );
  }

  private getUserFavoriteDoc(userId: string, postId: string) {
    return doc(this.firestore, `users/${userId}/favorites/${postId}`);
  }

  private getPostFavoriteDoc(
    postOwnerId: string,
    postId: string,
    userId: string
  ) {
    return doc(
      this.firestore,
      `users/${postOwnerId}/posts/${postId}/favorites/${userId}`
    );
  }
}
