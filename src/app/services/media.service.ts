import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  maxDimensions?: { width: number; height: number };
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly cloudinaryUrl = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;
  private readonly uploadCount = new Map<string, number>();
  private readonly RATE_LIMIT_PER_MINUTE = 5;

  private readonly defaultValidation: FileValidationOptions = {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxDimensions: { width: 2000, height: 2000 },
  };

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);

  private validateFile(
    file: File,
    options?: FileValidationOptions
  ): Observable<void> {
    return new Observable((observer) => {
      const validation = { ...this.defaultValidation, ...options };

      // Check file size
      if (validation.maxSizeBytes && file.size > validation.maxSizeBytes) {
        observer.error(
          new Error(
            this.translateService.instant('media.error.fileTooLarge', {
              maxSizeBytes: validation.maxSizeBytes,
            })
          )
        );
        return;
      }

      // Check file type
      if (
        validation.allowedTypes &&
        !validation.allowedTypes.includes(file.type)
      ) {
        observer.error(
          new Error(
            this.translateService.instant('media.error.invalidFileType', {
              fileTypes: validation.allowedTypes.join(', '),
            })
          )
        );
        return;
      }

      // Check dimensions
      if (validation.maxDimensions && file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          if (
            img.width > validation.maxDimensions!.width ||
            img.height > validation.maxDimensions!.height
          ) {
            observer.error(
              new Error(
                this.translateService.instant('media.error.maxDimensions', {
                  maxWidth: validation.maxDimensions!.width,
                  maxHeight: validation.maxDimensions!.height,
                })
              )
            );
          } else {
            observer.next();
            observer.complete();
          }
        };
        img.onerror = () => observer.error(new Error('Invalid image file'));
        img.src = URL.createObjectURL(file);
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userKey = `${userId}_${Math.floor(now / 60000)}`; // Per minute
    const count = this.uploadCount.get(userKey) || 0;

    if (count >= this.RATE_LIMIT_PER_MINUTE) {
      return false;
    }

    this.uploadCount.set(userKey, count + 1);

    // Clean up old entries
    for (const [key] of this.uploadCount) {
      const keyTime = parseInt(key.split('_')[1]);
      if (now - keyTime * 60000 > 60000) {
        this.uploadCount.delete(key);
      }
    }

    return true;
  }

  private validateUserAuthentication(user: any): Observable<void> {
    return new Observable((observer) => {
      if (!user) {
        observer.error(
          new Error(this.translateService.instant('media.error.authFailed'))
        );
        return;
      }
      observer.next();
      observer.complete();
    });
  }

  private validateRateLimit(userId: string): Observable<void> {
    return new Observable((observer) => {
      if (!this.checkRateLimit(userId)) {
        observer.error(
          new Error(this.translateService.instant('media.rateLimitExceeded'))
        );
        return;
      }
      observer.next();
      observer.complete();
    });
  }

  uploadImage(
    file: File,
    folder: string,
    options?: FileValidationOptions
  ): Observable<string> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        return this.validateUserAuthentication(user).pipe(
          switchMap(() => {
            if (!user?.uid) {
              return throwError(
                () =>
                  new Error(
                    this.translateService.instant('media.error.authFailed')
                  )
              );
            }
            return this.validateRateLimit(user.uid);
          }),
          switchMap(() => this.validateFile(file, options))
        );
      }),
      switchMap(() => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', environment.cloudinary.uploadPreset);
        formData.append('folder', folder);
        formData.append('timestamp', Date.now().toString());

        return this.http.post<CloudinaryResponse>(this.cloudinaryUrl, formData);
      }),
      map((response) => response.secure_url),
      catchError((error) => {
        console.error('Upload error:', error);
        return throwError(() => new Error(error?.message || error));
      })
    );
  }

  uploadUserAvatar(file: File, userId: string): Observable<string> {
    return this.uploadImage(
      file,
      `catspace/users/${userId}`,
      this.defaultValidation
    );
  }

  uploadPostImage(file: File, postId?: string): Observable<string> {
    const folder = postId ? `catspace/posts/${postId}` : 'catspace/posts';
    return this.uploadImage(file, folder, this.defaultValidation);
  }
}
