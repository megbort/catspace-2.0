import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomDialogComponent } from '../ui/custom-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthService,
  LoaderService,
  MediaService,
  NotificationService,
  Post,
  PostService,
} from '../../services';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-create-post',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDialogComponent,
  ],
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  private readonly dialog = inject(MatDialog);
  private readonly loader = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly mediaService = inject(MediaService);
  private readonly postService = inject(PostService);
  private readonly translate = inject(TranslateService);

  constructor() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(400)]],
      image: [''],
    });
  }

  close(): void {
    this.dialog.closeAll();
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.form.patchValue({ image: '' });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.notificationService.error(
          this.translate.instant('form.error.invalidFileType')
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.notificationService.error(
          this.translate.instant('form.error.fileTooLarge')
        );
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (fileReadEvent) => {
        this.previewUrl = fileReadEvent.target?.result as string;
        this.form.patchValue({ image: this.previewUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  post(): void {
    if (this.form.valid) {
      this.loader.show();

      const currentUser = this.authService.currentUserSignal();

      if (!currentUser) {
        this.loader.hide();
        this.notificationService.error(
          this.translate.instant('form.error.userNotFound')
        );
        return;
      }

      if (this.selectedFile) {
        const postId = this.postService.generatePostId(currentUser.id);

        this.mediaService
          .uploadPostImage(this.selectedFile, postId)
          .pipe(
            tap((imageUrl: string) => {
              this.createPost(currentUser.id, imageUrl, postId);
            }),
            catchError((error: any) => {
              const errorMessage =
                error?.message ||
                this.translate.instant('form.error.uploadFailed');
              this.notificationService.error(errorMessage);
              this.loader.hide();
              return of(null);
            })
          )
          .subscribe();
      } else {
        this.notificationService.error(
          this.translate.instant('form.error.imageRequired')
        );
        this.loader.hide();
      }
    }
  }

  private createPost(userId: string, imageUrl: string, postId?: string): void {
    const postData: Omit<Post, 'id'> = {
      title: this.form.value.title,
      image: imageUrl,
      description: this.form.value.description || '',
      favorites: 0,
      comments: [],
    };

    this.postService
      .createPost(userId, postData, postId)
      .pipe(
        tap(() => {
          this.notificationService.success(
            this.translate.instant('createPost.success.postCreated')
          );
          this.dialog.closeAll();
        }),
        catchError(() => {
          this.notificationService.error(
            this.translate.instant('createPost.error.postFailed')
          );
          return of(null);
        }),
        finalize(() => {
          this.loader.hide();
        })
      )
      .subscribe();
  }
}
