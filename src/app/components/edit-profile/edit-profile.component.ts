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
} from '../../services';
import { GlobalStore } from '../../shared';

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

  constructor(
    private readonly dialog: MatDialog,
    private readonly loader: LoaderService,
    private readonly notificationService: NotificationService,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly globalStore: GlobalStore,
    private readonly userService: UserService,
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
    this.dialog.closeAll();
  }

  editAvatar(): void {
    console.log('Edit avatar clicked');
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

      const profileUpdates: ProfileUpdates = {
        name: this.form.value.name,
        handle: this.form.value.handle,
        description: this.form.value.description ?? '',
        image: this.form.value.avatar ?? '',
      };

      this.userService
        .updateUserProfile(currentUser.id, profileUpdates)
        .then(() => {
          const updatedUser = { ...currentUser, ...profileUpdates };
          this.authService.currentUserSignal.set(updatedUser);
          this.globalStore.login(updatedUser, true);

          this.loader.hide();
          this.notificationService.success(
            this.translate.instant('form.success.updateProfile')
          );
          this.dialog.closeAll();
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          this.loader.hide();
          this.notificationService.error(
            this.translate.instant('form.error.updateProfile')
          );
        });
    }
  }
}
