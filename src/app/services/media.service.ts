import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly cloudinaryUrl = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

  constructor(private readonly http: HttpClient) {}

  uploadImage(file: File, folder: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    formData.append('folder', folder);

    return this.http
      .post<CloudinaryResponse>(this.cloudinaryUrl, formData)
      .pipe(
        map((response) => response.secure_url),
        catchError((error) => {
          return throwError(
            () => new Error('Image upload failed: ' + (error?.message || error))
          );
        })
      );
  }

  uploadUserAvatar(file: File, userId: string): Observable<string> {
    return this.uploadImage(file, `catspace/users/${userId}`);
  }

  uploadPostImage(file: File, postId?: string): Observable<string> {
    const folder = postId ? `catspace/posts/${postId}` : 'catspace/posts';
    return this.uploadImage(file, folder);
  }
}
