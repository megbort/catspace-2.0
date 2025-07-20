import { Component } from '@angular/core';
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
import { AuthService, NotificationService } from '../../../services';
import { LoginComponent } from '../login/login.component';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  form: FormGroup;
  step: 1 | 2 = 1;

  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<SignupComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService
  ) {
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
            if (result) {
              this.notificationService.success(
                'Account created successfully! Welcome to Catspace!'
              );
              this.dialogRef.close();
            }
          })
        )
        .subscribe();
    }
  }

  login(): void {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, { width: '500px' });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return this.translate.instant('form.error.emailInUse');
    } else {
      return this.translate.instant('form.error.signUpDefault');
    }
  }
}
