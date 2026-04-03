import { inject, Injectable } from '@angular/core';
import { from, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore } from '@angular/fire/firestore';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  private readonly firestore = inject(Firestore);

  followUser(currentUserId: string, targetUserId: string): Observable<void> {
    const currentUserFollowingDoc = this.getUserFollowingDoc(
      currentUserId,
      targetUserId,
    );
    const targetUserFollowerDoc = this.getUserFollowerDoc(
      targetUserId,
      currentUserId,
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
      targetUserId,
    );
    const targetUserFollowerDoc = this.getUserFollowerDoc(
      targetUserId,
      currentUserId,
    );

    return forkJoin([
      from(deleteDoc(currentUserFollowingDoc)),
      from(deleteDoc(targetUserFollowerDoc)),
    ]).pipe(map(() => undefined));
  }

  private getUserFollowingDoc(userId: string, followingUserId: string) {
    const followingCollection = collection(
      this.firestore,
      `users/${userId}/following`,
    );
    return doc(followingCollection, followingUserId);
  }

  private getUserFollowerDoc(userId: string, followerUserId: string) {
    const followersCollection = collection(
      this.firestore,
      `users/${userId}/followers`,
    );
    return doc(followersCollection, followerUserId);
  }

  getFollowing(
    userId: string,
  ): Observable<{ id: string; userId: string; followedAt: string }[]> {
    const followingCollection = collection(
      this.firestore,
      `users/${userId}/following`,
    );

    return from(getDocs(followingCollection)).pipe(
      map((docs) =>
        docs.docs.map((followDoc) => {
          const data = followDoc.data() as {
            userId?: string;
            followedAt?: string;
          };
          return {
            id: followDoc.id,
            userId: data.userId || '',
            followedAt: data.followedAt || '',
          };
        }),
      ),
    );
  }

  getFollowers(
    userId: string,
  ): Observable<{ id: string; userId: string; followedAt: string }[]> {
    const followersCollection = collection(
      this.firestore,
      `users/${userId}/followers`,
    );

    return from(getDocs(followersCollection)).pipe(
      map((docs) =>
        docs.docs.map((followerDoc) => {
          const data = followerDoc.data() as {
            userId?: string;
            followedAt?: string;
          };
          return {
            id: followerDoc.id,
            userId: data.userId || '',
            followedAt: data.followedAt || '',
          };
        }),
      ),
    );
  }
}
