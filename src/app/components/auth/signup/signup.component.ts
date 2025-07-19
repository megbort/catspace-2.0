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
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore } from '../../../shared';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService, User, USER } from '../../../services';
import { LoginComponent } from '../login/login.component';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';

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
  user: User = USER;
  step: 1 | 2 = 1;
  isHandleFocused = false;

  constructor(
    private readonly globalStore: GlobalStore,
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<SignupComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
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
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            return of(null);
          })
        )
        .subscribe((result) => {
          if (result !== null) {
            console.log('Registration successful');
            this.dialogRef.close();
          } else {
            console.log('Registration failed');
          }
        });
    }
  }

  login(): void {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, { width: '500px' });
  }
}
