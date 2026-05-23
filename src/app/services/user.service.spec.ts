import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { Firestore, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn(() => ({ path: 'mock-collection' })),
  doc: vi.fn(() => ({ id: 'uid1', path: 'mock-doc' })),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

const firestoreUserData = {
  email: 'kiku@example.com',
  image: 'https://img.example.com/kiku.jpg',
  handle: 'kikuKrenn',
  name: 'Kiku Krenbrink',
  description: 'A fluffy cat',
  posts: [],
  following: [],
  favorites: [],
  followers: [],
  tags: ['tabby'],
};

function makeDocSnapshot(exists: boolean, data?: Record<string, unknown>, id = 'uid1') {
  return { id, exists: () => exists, data: () => data };
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });
    service = TestBed.inject(UserService);
  });

  describe('createUserProfile', () => {
    it('calls setDoc with the provided profile data', async () => {
      vi.mocked(setDoc).mockResolvedValue(undefined);

      await service.createUserProfile('uid1', {
        name: 'Kiku', handle: 'kiku', description: 'Cat', email: 'kiku@example.com',
      });

      expect(vi.mocked(setDoc)).toHaveBeenCalledOnce();
      expect(vi.mocked(setDoc)).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'Kiku', handle: 'kiku', createdAt: expect.any(String) }),
      );
    });
  });

  describe('getUserProfileById', () => {
    it('returns a mapped User when the document exists', async () => {
      vi.mocked(getDoc).mockResolvedValue(makeDocSnapshot(true, firestoreUserData) as any);

      const user = await service.getUserProfileById('uid1');
      expect(user).not.toBeNull();
      expect(user?.name).toBe('Kiku Krenbrink');
      expect(user?.handle).toBe('kikuKrenn');
      expect(user?.id).toBe('uid1');
    });

    it('returns null when the document does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValue(makeDocSnapshot(false) as any);

      const user = await service.getUserProfileById('uid1');
      expect(user).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('maps Firestore docs to User objects', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [{ id: 'uid1', data: () => firestoreUserData }],
      } as any);

      const users = await firstValueFrom(service.getUsers());
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('uid1');
      expect(users[0].name).toBe('Kiku Krenbrink');
    });

    it('returns empty array on Firestore error', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));
      const users = await firstValueFrom(service.getUsers());
      expect(users).toEqual([]);
    });

    it('fills in empty strings for missing optional fields', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [{ id: 'uid1', data: () => ({}) }],
      } as any);

      const users = await firstValueFrom(service.getUsers());
      expect(users[0].email).toBe('');
      expect(users[0].image).toBe('');
      expect(users[0].posts).toEqual([]);
    });
  });

  describe('updateUserProfile', () => {
    it('calls updateDoc with the provided fields and an updatedAt timestamp', async () => {
      vi.mocked(updateDoc).mockResolvedValue(undefined);

      await firstValueFrom(service.updateUserProfile('uid1', { name: 'New Name', image: 'new.jpg' }));

      expect(vi.mocked(updateDoc)).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'New Name', image: 'new.jpg', updatedAt: expect.any(String) }),
      );
    });
  });

  describe('getUserById', () => {
    it('returns a User when the document exists', async () => {
      vi.mocked(getDoc).mockResolvedValue(makeDocSnapshot(true, firestoreUserData) as any);

      const user = await firstValueFrom(service.getUserById('uid1'));
      expect(user.name).toBe('Kiku Krenbrink');
    });

    it('throws when the document does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValue(makeDocSnapshot(false) as any);

      await expect(firstValueFrom(service.getUserById('uid1'))).rejects.toThrow(
        'No user found with id: uid1',
      );
    });
  });
});
