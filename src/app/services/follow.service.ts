import { inject, Injectable } from '@angular/core';
import { from, Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  private readonly firestore = inject(Firestore);

  followUser(currentUserId: string, targetUserId: string): Observable<void> {
    const currentUserFollowingDoc = this.getUserFollowingDoc(
      currentUserId,
      targetUserId
    );
    const targetUserFollowerDoc = this.getUserFollowerDoc(
      targetUserId,
      currentUserId
    );

    const followingData = {
      userId: targetUserId,
      followedAt: new Date().toISOString(),
    };

    const followerData = {
      userId: currentUserId,
      followedAt: new Date().toISOString(),
    };

    return forkJoin([
      from(setDoc(currentUserFollowingDoc, followingData)),
      from(setDoc(targetUserFollowerDoc, followerData)),
    ]).pipe(map(() => undefined));
  }

  unfollowUser(currentUserId: string, targetUserId: string): Observable<void> {
    const currentUserFollowingDoc = this.getUserFollowingDoc(
      currentUserId,
      targetUserId
    );
    const targetUserFollowerDoc = this.getUserFollowerDoc(
      targetUserId,
      currentUserId
    );

    return forkJoin([
      from(deleteDoc(currentUserFollowingDoc)),
      from(deleteDoc(targetUserFollowerDoc)),
    ]).pipe(map(() => undefined));
  }

  private getUserFollowingDoc(userId: string, followingUserId: string) {
    const followingCollection = collection(
      this.firestore,
      `users/${userId}/following`
    );
    return doc(followingCollection, followingUserId);
  }

  private getUserFollowerDoc(userId: string, followerUserId: string) {
    const followersCollection = collection(
      this.firestore,
      `users/${userId}/followers`
    );
    return doc(followersCollection, followerUserId);
  }

  getFollowing(
    userId: string
  ): Observable<{ id: string; userId: string; followedAt: string }[]> {
    const followingCollection = collection(
      this.firestore,
      `users/${userId}/following`
    );

    return collectionData(followingCollection, { idField: 'id' }).pipe(
      take(1), // Take only the first emission and complete
      map((docs) =>
        docs.map((doc: any) => ({
          id: doc.id,
          userId: doc.userId,
          followedAt: doc.followedAt,
        }))
      )
    );
  }

  getFollowers(
    userId: string
  ): Observable<{ id: string; userId: string; followedAt: string }[]> {
    const followersCollection = collection(
      this.firestore,
      `users/${userId}/followers`
    );

    return collectionData(followersCollection, { idField: 'id' }).pipe(
      take(1), // Take only the first emission and complete
      map((docs) =>
        docs.map((doc: any) => ({
          id: doc.id,
          userId: doc.userId,
          followedAt: doc.followedAt,
        }))
      )
    );
  }
}
