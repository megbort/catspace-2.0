import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { Firestore, deleteDoc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { FavoriteService } from './favorite.service';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn(() => ({ path: 'mock-collection' })),
  doc: vi.fn(() => ({ id: 'mock-id', path: 'mock-doc' })),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });
    service = TestBed.inject(FavoriteService);
  });

  describe('favoritePost', () => {
    it('writes to both the user favorites and post favorites subcollections', async () => {
      vi.mocked(setDoc).mockResolvedValue(undefined);

      await firstValueFrom(service.favoritePost('user1', 'post1', 'owner1'));

      expect(vi.mocked(setDoc)).toHaveBeenCalledTimes(2);
    });
  });

  describe('unfavoritePost', () => {
    it('deletes from both the user favorites and post favorites subcollections', async () => {
      vi.mocked(deleteDoc).mockResolvedValue(undefined);

      await firstValueFrom(service.unfavoritePost('user1', 'post1', 'owner1'));

      expect(vi.mocked(deleteDoc)).toHaveBeenCalledTimes(2);
    });
  });

  describe('getUserFavorites', () => {
    it('returns the list of favorited posts', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [
          { data: () => ({ postId: 'post1', postOwnerId: 'owner1', favoritedAt: '2024-01-01T00:00:00.000Z' }) },
        ],
      } as any);

      const favorites = await firstValueFrom(service.getUserFavorites('user1'));
      expect(favorites).toHaveLength(1);
      expect(favorites[0].postId).toBe('post1');
      expect(favorites[0].postOwnerId).toBe('owner1');
    });

    it('returns empty array on Firestore error', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));
      const favorites = await firstValueFrom(service.getUserFavorites('user1'));
      expect(favorites).toEqual([]);
    });
  });

  describe('getPostFavorites', () => {
    it('returns the list of users who favorited the post', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [
          { data: () => ({ userId: 'user1', favoritedAt: '2024-01-01T00:00:00.000Z' }) },
          { data: () => ({ userId: 'user2', favoritedAt: '2024-01-02T00:00:00.000Z' }) },
        ],
      } as any);

      const favorites = await firstValueFrom(service.getPostFavorites('owner1', 'post1'));
      expect(favorites).toHaveLength(2);
      expect(favorites[0].userId).toBe('user1');
    });

    it('returns empty array on error', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));
      const favorites = await firstValueFrom(service.getPostFavorites('owner1', 'post1'));
      expect(favorites).toEqual([]);
    });
  });

  describe('isPostFavorited', () => {
    it('returns true when the favorite document exists', async () => {
      vi.mocked(getDoc).mockResolvedValue({ exists: () => true } as any);
      const result = await firstValueFrom(service.isPostFavorited('user1', 'post1'));
      expect(result).toBe(true);
    });

    it('returns false when the favorite document does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as any);
      const result = await firstValueFrom(service.isPostFavorited('user1', 'post1'));
      expect(result).toBe(false);
    });

    it('returns false on error', async () => {
      vi.mocked(getDoc).mockRejectedValue(new Error('Firestore error'));
      const result = await firstValueFrom(service.isPostFavorited('user1', 'post1'));
      expect(result).toBe(false);
    });
  });

  describe('getPostFavoriteCount', () => {
    it('returns the number of users who favorited the post', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [
          { data: () => ({ userId: 'u1', favoritedAt: '' }) },
          { data: () => ({ userId: 'u2', favoritedAt: '' }) },
          { data: () => ({ userId: 'u3', favoritedAt: '' }) },
        ],
      } as any);

      const count = await firstValueFrom(service.getPostFavoriteCount('owner1', 'post1'));
      expect(count).toBe(3);
    });

    it('returns 0 when no one has favorited the post', async () => {
      vi.mocked(getDocs).mockResolvedValue({ docs: [] } as any);
      const count = await firstValueFrom(service.getPostFavoriteCount('owner1', 'post1'));
      expect(count).toBe(0);
    });
  });
});
