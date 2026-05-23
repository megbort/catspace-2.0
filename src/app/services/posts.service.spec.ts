import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { PostService } from './posts.service';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn(() => ({ path: 'mock-collection' })),
  doc: vi.fn(() => ({ id: 'new-post-id', path: 'mock-doc' })),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
}));

function makeQuerySnapshot(docs: { id: string; data: Record<string, unknown> }[]) {
  return { docs: docs.map((d) => ({ id: d.id, data: () => d.data })) };
}

const basePostData = { title: 'Test', image: '', description: '', favorites: 0, comments: [] };

describe('PostService', () => {
  let service: PostService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });
    service = TestBed.inject(PostService);
  });

  describe('getPostsByProfileId', () => {
    it('maps Firestore docs to Post objects and injects userId', async () => {
      vi.mocked(getDocs).mockResolvedValue(
        makeQuerySnapshot([{ id: 'p1', data: { ...basePostData } }]) as any,
      );

      const posts = await firstValueFrom(service.getPostsByProfileId('user1'));

      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('p1');
      expect(posts[0].userId).toBe('user1');
    });

    it('preserves existing userId on posts that already have one', async () => {
      vi.mocked(getDocs).mockResolvedValue(
        makeQuerySnapshot([{ id: 'p1', data: { ...basePostData, userId: 'original-owner' } }]) as any,
      );

      const posts = await firstValueFrom(service.getPostsByProfileId('user1'));
      expect(posts[0].userId).toBe('original-owner');
    });

    it('sorts posts newest-first by createdAt', async () => {
      vi.mocked(getDocs).mockResolvedValue(
        makeQuerySnapshot([
          { id: 'old', data: { ...basePostData, createdAt: '2024-01-01T00:00:00.000Z' } },
          { id: 'new', data: { ...basePostData, createdAt: '2024-06-01T00:00:00.000Z' } },
        ]) as any,
      );

      const posts = await firstValueFrom(service.getPostsByProfileId('user1'));
      expect(posts[0].id).toBe('new');
      expect(posts[1].id).toBe('old');
    });

    it('returns empty array on Firestore error', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));
      const posts = await firstValueFrom(service.getPostsByProfileId('user1'));
      expect(posts).toEqual([]);
    });
  });

  describe('createPost', () => {
    it('writes to Firestore, updates postCreatedSignal, and returns the post id', async () => {
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const postId = await firstValueFrom(service.createPost('user1', basePostData));

      expect(vi.mocked(setDoc)).toHaveBeenCalledOnce();
      expect(postId).toBe('new-post-id');
      expect(service.postCreatedSignal()).toEqual({ uid: 'user1', timestamp: expect.any(Number) });
    });

    it('uses the provided postId when given', async () => {
      vi.mocked(doc).mockReturnValue({ id: 'custom-id', path: 'mock' } as any);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const postId = await firstValueFrom(service.createPost('user1', basePostData, 'custom-id'));
      expect(postId).toBe('custom-id');
    });
  });

  describe('getPostsFromFollowedUsers', () => {
    it('returns empty array immediately when no user ids are provided', async () => {
      const posts = await firstValueFrom(service.getPostsFromFollowedUsers([]));
      expect(posts).toEqual([]);
      expect(vi.mocked(getDocs)).not.toHaveBeenCalled();
    });

    it('combines posts from multiple users and sorts by date', async () => {
      vi.mocked(getDocs)
        .mockResolvedValueOnce(
          makeQuerySnapshot([
            { id: 'p1', data: { ...basePostData, userId: 'u1', createdAt: '2024-01-01T00:00:00.000Z' } },
          ]) as any,
        )
        .mockResolvedValueOnce(
          makeQuerySnapshot([
            { id: 'p2', data: { ...basePostData, userId: 'u2', createdAt: '2024-06-01T00:00:00.000Z' } },
          ]) as any,
        );

      const posts = await firstValueFrom(service.getPostsFromFollowedUsers(['u1', 'u2']));
      expect(posts).toHaveLength(2);
      expect(posts[0].id).toBe('p2');
    });

    it('filters out posts with null ids', async () => {
      vi.mocked(getDocs).mockResolvedValue(
        makeQuerySnapshot([
          { id: 'p1', data: { ...basePostData } },
          { id: '', data: { ...basePostData, id: null } },
        ]) as any,
      );

      const posts = await firstValueFrom(service.getPostsFromFollowedUsers(['u1']));
      expect(posts.every((p) => p.id != null)).toBe(true);
    });
  });

  describe('resetPostCreatedSignal', () => {
    it('sets postCreatedSignal back to null', async () => {
      vi.mocked(setDoc).mockResolvedValue(undefined);
      await firstValueFrom(service.createPost('user1', basePostData));
      expect(service.postCreatedSignal()).not.toBeNull();

      service.resetPostCreatedSignal();
      expect(service.postCreatedSignal()).toBeNull();
    });
  });
});
