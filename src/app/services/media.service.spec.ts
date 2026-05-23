import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MediaService } from './media.service';
import { AuthService } from './auth.service';

const mockHttp = { post: vi.fn() };
const mockTranslate = { instant: vi.fn((key: string) => key) };
const mockAuthService = { user$: of(null) };

function makeFile(overrides: Partial<{ name: string; size: number; type: string }> = {}): File {
  const { name = 'test.jpg', size = 100, type = 'image/jpeg' } = overrides;
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size, configurable: true });
  return file;
}

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.user$ = of(null);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    service = TestBed.inject(MediaService);
  });

  describe('uploadImage — auth validation', () => {
    it('rejects when user is not authenticated', async () => {
      mockAuthService.user$ = of(null);

      await expect(
        firstValueFrom(service.uploadImage(makeFile(), 'catspace/posts')),
      ).rejects.toThrow();
    });

    it('rejects when authenticated user has no uid', async () => {
      mockAuthService.user$ = of({} as any);

      await expect(
        firstValueFrom(service.uploadImage(makeFile(), 'catspace/posts')),
      ).rejects.toThrow();
    });
  });

  describe('uploadImage — file validation', () => {
    beforeEach(() => {
      mockAuthService.user$ = of({ uid: 'user1' } as any);
    });

    it('rejects when file exceeds 5MB', async () => {
      const bigFile = makeFile({ size: 6 * 1024 * 1024 });

      await expect(
        firstValueFrom(service.uploadImage(bigFile, 'catspace/posts')),
      ).rejects.toThrow();
    });

    it('rejects when file type is not in the allowed list', async () => {
      const gifFile = makeFile({ type: 'image/gif' });

      await expect(
        firstValueFrom(service.uploadImage(gifFile, 'catspace/posts')),
      ).rejects.toThrow();
    });

    it('accepts valid jpeg under 5MB', async () => {
      mockHttp.post.mockReturnValue(of({ secure_url: 'https://res.cloudinary.com/img.jpg' }));
      const validFile = makeFile({ size: 1 * 1024 * 1024, type: 'image/jpeg' });

      // Stub Image so dimension check passes immediately
      class MockImage {
        width = 100;
        height = 100;
        onload: (() => void) | null = null;
        set src(_: string) { this.onload?.(); }
      }
      vi.stubGlobal('Image', MockImage);

      const url = await firstValueFrom(service.uploadImage(validFile, 'catspace/posts'));
      expect(url).toBe('https://res.cloudinary.com/img.jpg');

      vi.unstubAllGlobals();
    });
  });

  describe('uploadImage — rate limiting', () => {
    beforeEach(() => {
      mockAuthService.user$ = of({ uid: 'user1' } as any);
      mockHttp.post.mockReturnValue(of({ secure_url: 'https://example.com/img.jpg' }));

      class MockImage {
        width = 100;
        height = 100;
        onload: (() => void) | null = null;
        set src(_: string) { this.onload?.(); }
      }
      vi.stubGlobal('Image', MockImage);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('rejects on the 6th upload within the same minute', async () => {
      const validFile = makeFile({ size: 100, type: 'image/jpeg' });

      // Exhaust the 5-per-minute limit
      for (let i = 0; i < 5; i++) {
        await firstValueFrom(service.uploadImage(validFile, 'catspace/posts'));
      }

      await expect(
        firstValueFrom(service.uploadImage(validFile, 'catspace/posts')),
      ).rejects.toThrow();
    });
  });

  describe('uploadUserAvatar', () => {
    it('delegates to uploadImage with the user-specific folder path', () => {
      const spy = vi.spyOn(service, 'uploadImage').mockReturnValue(of('https://img.url'));
      const file = makeFile();

      service.uploadUserAvatar(file, 'user1');

      expect(spy).toHaveBeenCalledWith(file, 'catspace/users/user1', expect.anything());
    });
  });

  describe('uploadPostImage', () => {
    it('uses a post-specific folder when a postId is given', () => {
      const spy = vi.spyOn(service, 'uploadImage').mockReturnValue(of('https://img.url'));
      const file = makeFile();

      service.uploadPostImage(file, 'post123');

      expect(spy).toHaveBeenCalledWith(file, 'catspace/posts/post123', expect.anything());
    });

    it('uses the generic posts folder when no postId is given', () => {
      const spy = vi.spyOn(service, 'uploadImage').mockReturnValue(of('https://img.url'));
      const file = makeFile();

      service.uploadPostImage(file);

      expect(spy).toHaveBeenCalledWith(file, 'catspace/posts', expect.anything());
    });
  });
});
