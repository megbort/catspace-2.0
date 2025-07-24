import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  LoaderService,
  NotificationService,
  AuthService,
  UserService,
  MediaService,
} from '../../services';
import { GlobalStore } from '../../shared';
import { catchError, tap } from 'rxjs';

interface ProfileUpdates {
  name: string;
  handle: string;
  description?: string;
  image?: string;
}

@Component({
  selector: 'app-edit-profile',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private readonly dialog: MatDialog,
    private readonly loader: LoaderService,
    private readonly notificationService: NotificationService,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly globalStore: GlobalStore,
    private readonly userService: UserService,
    private readonly mediaService: MediaService,
    private readonly translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      handle: ['', [Validators.required]],
      description: ['', [Validators.maxLength(400)]],
      avatar: [''],
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserSignal();

    if (currentUser) {
      this.form.patchValue({
        name: currentUser.name || '',
        handle: currentUser.handle || '',
        description: currentUser.description || '',
        avatar: currentUser.image || '',
      });
    }
  }

  cancel(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.dialog.closeAll();
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
        this.form.patchValue({ avatar: this.previewUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  save(): void {
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
        this.mediaService
          .uploadUserAvatar(this.selectedFile, currentUser.id)
          .pipe(
            tap((imageUrl) => {
              this.updateProfile(currentUser, imageUrl);
            }),
            catchError((error) => {
              console.error('Error uploading image:', error);
              this.loader.hide();
              this.notificationService.error(
                this.translate.instant('form.error.uploadFailed')
              );
              return [];
            })
          )
          .subscribe();
      } else {
        const existingImageUrl = this.form.value.avatar ?? '';
        this.updateProfile(currentUser, existingImageUrl);
      }
    }
  }

  private updateProfile(currentUser: any, imageUrl: string): void {
    const profileUpdates: ProfileUpdates = {
      name: this.form.value.name,
      handle: this.form.value.handle,
      description: this.form.value.description ?? '',
      image: imageUrl,
    };

    this.userService
      .updateUserProfile(currentUser.id, profileUpdates)
      .pipe(
        tap(() => {
          const updatedUser = { ...currentUser, ...profileUpdates };
          this.authService.currentUserSignal.set(updatedUser);
          this.globalStore.login(updatedUser, true);

          this.loader.hide();
          this.notificationService.success(
            this.translate.instant('form.success.updateProfile')
          );
          this.dialog.closeAll();
        }),
        catchError((error) => {
          console.error('Error updating profile:', error);
          this.loader.hide();
          this.notificationService.error(
            this.translate.instant('form.error.updateProfile')
          );
          return [];
        })
      )
      .subscribe();
  }
}
