import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogComponent } from '../ui/custom-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDialogComponent,
  ],
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private readonly dialog: MatDialog) {
    this.form = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      favorites: new FormControl(0),
      comments: new FormControl([]),
    });
  }

  close(): void {
    this.dialog.closeAll();
  }

  post(): void {
    this.dialog.closeAll();
  }
}
