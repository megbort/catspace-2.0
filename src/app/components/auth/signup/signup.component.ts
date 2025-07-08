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

  ngOnInit(): void {
    this.form.patchValue({
      name: this.user.name,
      handle: this.user.handle,
      description: this.user.description,
      email: this.user.email,
      password: '123456',
    });
  }

  signUp(): void {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();
      this.authService
        .register(rawForm.email, rawForm.handle, rawForm.password)
        .pipe(
          catchError((error) => {
            // TODO show error messages to the user
            console.error('Registration error:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          // TODO add toast or notification
          console.log('Registration successful');
          this.dialogRef.close();
          // TODO handle fetch user data
          this.globalStore.login(USER, true);
        });
    }
  }

  login(): void {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, { width: '500px' });
  }
}
