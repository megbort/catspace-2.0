import { Component } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { LoaderService, NotificationService } from '../../services';

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
export class EditProfileComponent {
  form: FormGroup;

  constructor(
    private readonly dialog: MatDialog,
    private readonly loader: LoaderService,
    private readonly notificationService: NotificationService,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      handle: ['', [Validators.required]],
      description: ['', [Validators.maxLength(400)]],
      avatar: [''],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: 'John Doe',
      handle: 'johndoe',
      description: 'This is a sample description.',
      avatar:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1753057717/catspace/no-avatar_mm3idt.png',
    });
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
      // TODO: Implement save logic with user service
      console.log('Form values:', this.form.value);

      // Simulate API call
      setTimeout(() => {
        this.loader.hide();
        this.notificationService.success('Profile updated successfully!');
        this.dialog.closeAll();
      }, 1000);
    }
  }
}
