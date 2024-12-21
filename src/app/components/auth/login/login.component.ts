import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStore } from '../../../shared';
import { User, USER } from '../../../services';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  user: User = USER;

  constructor(
    private readonly globalStore: GlobalStore,
    private readonly dialogRef: MatDialogRef<LoginComponent>,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      email: this.user.email,
      password: '123456',
    });
  }

  login(): void {
    if (this.form.valid) {
      this.globalStore.login(USER, true);
      this.dialogRef.close();
    }
  }

  signup(): void {
    console.log('signup');
  }
}
