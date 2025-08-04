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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AuthService,
  NotificationService,
  LoaderService,
} from '../../../services';
import { LoginComponent } from '../login/login.component';
import { CustomDialogComponent } from '../../ui/custom-dialog.component';
import { catchError } from 'rxjs/internal/operators/catchError';
import { finalize, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDialogComponent,
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  form: FormGroup;
  step: 1 | 2 = 1;

  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<SignupComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly loader = inject(LoaderService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      handle: ['', [Validators.required]],
      description: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signUp(): void {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();
      const { name, handle, description, email, password } = rawForm;

      this.loader.show();

      this.authService
        .register(email, password, { name, handle, description })
        .pipe(
          catchError((error) => {
            console.error('Registration error:', error);

            const errorMessage = this.getErrorMessage(error);
            this.notificationService.error(errorMessage);

            return of(null);
          }),
          tap((result) => {
            if (result !== null) {
              this.notificationService.success(
                this.translate.instant('auth.signUp.success.accountCreated')
              );
              this.dialogRef.close();
              this.router.navigate(['/featured']);
            }
          }),
          finalize(() => {
            this.loader.hide();
          })
        )
        .subscribe();
    }
  }

  login(): void {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, { width: '500px', autoFocus: false });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return this.translate.instant('form.error.emailInUse');
    } else {
      return this.translate.instant('form.error.signUpDefault');
    }
  }
}
