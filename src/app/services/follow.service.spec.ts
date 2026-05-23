import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { Firestore, deleteDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { FollowService } from './follow.service';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn(() => ({ path: 'mock-collection' })),
  doc: vi.fn(() => ({ id: 'mock-id', path: 'mock-doc' })),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

describe('FollowService', () => {
  let service: FollowService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });
    service = TestBed.inject(FollowService);
  });

  describe('followUser', () => {
    it('writes to both the following and followers subcollections', async () => {
      vi.mocked(setDoc).mockResolvedValue(undefined);

      await firstValueFrom(service.followUser('currentUser', 'targetUser'));

      expect(vi.mocked(setDoc)).toHaveBeenCalledTimes(2);
    });
  });

  describe('unfollowUser', () => {
    it('deletes from both the following and followers subcollections', async () => {
      vi.mocked(deleteDoc).mockResolvedValue(undefined);

      await firstValueFrom(service.unfollowUser('currentUser', 'targetUser'));

      expect(vi.mocked(deleteDoc)).toHaveBeenCalledTimes(2);
    });
  });

  describe('getFollowing', () => {
    it('returns a mapped list of followed users', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [
          { id: 'targetUser', data: () => ({ userId: 'targetUser', followedAt: '2024-01-01T00:00:00.000Z' }) },
        ],
      } as any);

      const following = await firstValueFrom(service.getFollowing('currentUser'));
      expect(following).toHaveLength(1);
      expect(following[0].id).toBe('targetUser');
      expect(following[0].userId).toBe('targetUser');
      expect(following[0].followedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('fills in empty strings for missing fields', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [{ id: 'u1', data: () => ({}) }],
      } as any);

      const following = await firstValueFrom(service.getFollowing('currentUser'));
      expect(following[0].userId).toBe('');
      expect(following[0].followedAt).toBe('');
    });
  });

  describe('getFollowers', () => {
    it('returns a mapped list of followers', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [
          { id: 'followerUser', data: () => ({ userId: 'followerUser', followedAt: '2024-02-01T00:00:00.000Z' }) },
        ],
      } as any);

      const followers = await firstValueFrom(service.getFollowers('currentUser'));
      expect(followers).toHaveLength(1);
      expect(followers[0].userId).toBe('followerUser');
    });
  });
});
