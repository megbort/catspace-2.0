import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomDialogComponent } from '../../custom-dialog/custom-dialog.component';
import {
  AuthService,
  LoaderService,
  NotificationService,
} from '../../../services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDialogComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<LoginComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
    private readonly loader: LoaderService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      email: 'demo3@example.com', // Default email for testing
      password: '123456', // Default password for testing
    });
  }

  login(): void {
    if (this.form.valid) {
      this.loader.show();

      const rawForm = this.form.getRawValue();
      this.authService
        .login(rawForm.email, rawForm.password)
        .pipe(
          catchError((error) => {
            console.error('Login error:', error);
            this.notificationService.error(
              this.translate.instant('form.error.login')
            );
            return of(null);
          }),
          tap((result) => {
            if (result) {
              this.notificationService.success(
                this.translate.instant('form.success.login')
              );
              this.dialogRef.close();
            }
          }),
          finalize(() => {
            this.loader.hide();
          })
        )
        .subscribe();
    }
  }

  signUp(): void {
    this.dialogRef.close();
    this.dialog.open(SignupComponent, { width: '500px', autoFocus: false });
  }
}
