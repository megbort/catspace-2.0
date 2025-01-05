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
import { User, USER } from '../../../services';
import { LoginComponent } from '../login/login.component';

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
    private readonly formBuilder: FormBuilder
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
      this.globalStore.login(USER, true);
      this.dialogRef.close();
    }
  }

  login(): void {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, { width: '500px' });
  }
}
