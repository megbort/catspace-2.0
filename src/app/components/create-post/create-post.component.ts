import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomDialogComponent } from '../ui/custom-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthService,
  LoaderService,
  MediaService,
  NotificationService,
  Post,
  PostService,
} from '../../services';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

const TITLE_MIN_LENGTH = 2;
const DESCRIPTION_MAX_LENGTH = 400;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'] as const;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const JPEG_QUALITY = 0.92;

@Component({
  selector: 'app-create-post',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDialogComponent,
  ],
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  private readonly dialog = inject(MatDialog);
  private readonly loader = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly mediaService = inject(MediaService);
  private readonly postService = inject(PostService);
  private readonly translate = inject(TranslateService);

  private readonly imageContainerRef =
    viewChild<ElementRef<HTMLDivElement>>('imageContainer');
  private readonly imageElementRef =
    viewChild<ElementRef<HTMLImageElement>>('imageElement');

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // Cover dimensions at zoom=1, set once on image load
  protected baseW = signal(0);
  protected baseH = signal(0);
  private containerW = 0;
  private containerH = 0;

  protected zoom = signal(ZOOM_MIN);
  private readonly panX = signal(0);
  private readonly panY = signal(0);

  private readonly maxPanX = computed(() =>
    Math.max(0, (this.baseW() * this.zoom() - this.containerW) / 2),
  );
  private readonly maxPanY = computed(() =>
    Math.max(0, (this.baseH() * this.zoom() - this.containerH) / 2),
  );

  protected canZoomIn = computed(() => this.zoom() < ZOOM_MAX);
  protected canZoomOut = computed(() => this.zoom() > ZOOM_MIN);
  protected imageTransform = computed(
    () =>
      `translate(calc(-50% + ${this.panX()}px), calc(-50% + ${this.panY()}px)) scale(${this.zoom()})`,
  );

  protected isPosting = signal(false);

  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragOriginX = 0;
  private dragOriginY = 0;

  constructor() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(TITLE_MIN_LENGTH)]],
      description: ['', [Validators.maxLength(DESCRIPTION_MAX_LENGTH)]],
      image: [''],
    });
  }

  close(): void {
    this.dialog.closeAll();
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.form.patchValue({ image: '' });
    this.baseW.set(0);
    this.baseH.set(0);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
        this.notificationService.error(
          this.translate.instant('form.error.invalidFileType'),
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        this.notificationService.error(
          this.translate.instant('form.error.fileTooLarge'),
        );
        return;
      }

      this.selectedFile = file;
      this.zoom.set(ZOOM_MIN);
      this.panX.set(0);
      this.panY.set(0);
      this.baseW.set(0);
      this.baseH.set(0);

      const reader = new FileReader();
      reader.onload = (fileReadEvent) => {
        this.previewUrl = fileReadEvent.target?.result as string;
        this.form.patchValue({ image: this.previewUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  protected onImageLoad(): void {
    const container = this.imageContainerRef()?.nativeElement;
    const img = this.imageElementRef()?.nativeElement;
    if (!container || !img) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const coverScale = Math.max(cW / img.naturalWidth, cH / img.naturalHeight);
    this.containerW = cW;
    this.containerH = cH;
    this.baseW.set(img.naturalWidth * coverScale);
    this.baseH.set(img.naturalHeight * coverScale);
    this.zoom.set(ZOOM_MIN);
    this.panX.set(0);
    this.panY.set(0);
  }

  protected zoomIn(): void {
    if (!this.canZoomIn()) return;
    this.zoom.update((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
    this.clampPan();
  }

  protected zoomOut(): void {
    if (!this.canZoomOut()) return;
    this.zoom.update((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
    this.clampPan();
  }

  private clampPan(): void {
    const mX = this.maxPanX();
    const mY = this.maxPanY();
    this.panX.update((x) => Math.max(-mX, Math.min(mX, x)));
    this.panY.update((y) => Math.max(-mY, Math.min(mY, y)));
  }

  protected startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;

    const point = event instanceof MouseEvent ? event : event.touches[0];
    this.dragStartX = point.clientX;
    this.dragStartY = point.clientY;
    this.dragOriginX = this.panX();
    this.dragOriginY = this.panY();
  }

  @HostListener('window:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.applyPan(event.clientX, event.clientY);
  }

  protected onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.applyPan(event.touches[0].clientX, event.touches[0].clientY);
  }

  @HostListener('window:mouseup')
  protected onMouseUp(): void {
    this.isDragging = false;
  }

  protected onTouchEnd(): void {
    this.isDragging = false;
  }

  private applyPan(clientX: number, clientY: number): void {
    const dx = clientX - this.dragStartX;
    const dy = clientY - this.dragStartY;
    const mX = this.maxPanX();
    const mY = this.maxPanY();
    this.panX.set(Math.max(-mX, Math.min(mX, this.dragOriginX + dx)));
    this.panY.set(Math.max(-mY, Math.min(mY, this.dragOriginY + dy)));
  }

  private getCroppedBlob(): Promise<Blob> {
    const img = this.imageElementRef()?.nativeElement;
    if (!img) return Promise.reject(new Error('View refs not available'));

    const cW = this.containerW;
    const cH = this.containerH;
    const rW = this.baseW() * this.zoom();
    const rH = this.baseH() * this.zoom();
    const px = this.panX();
    const py = this.panY();

    const renderScale = rW / img.naturalWidth;
    const imgLeft = cW / 2 - rW / 2 + px;
    const imgTop = cH / 2 - rH / 2 + py;
    const srcX = -imgLeft / renderScale;
    const srcY = -imgTop / renderScale;
    const srcW = cW / renderScale;
    const srcH = cH / renderScale;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('Canvas 2D context unavailable'));

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('Canvas export failed')),
        'image/jpeg',
        JPEG_QUALITY,
      );
    });
  }

  post(): void {
    if (this.form.valid) {
      this.isPosting.set(true);
      this.loader.show();

      const currentUser = this.authService.currentUserSignal();

      if (!currentUser) {
        this.isPosting.set(false);
        this.loader.hide();
        this.notificationService.error(
          this.translate.instant('form.error.userNotFound'),
        );
        return;
      }

      if (this.selectedFile) {
        const postId = this.postService.generatePostId(currentUser.id);
        const getFile = (): Promise<File> =>
          this.getCroppedBlob()
            .then(
              (blob) => new File([blob], 'post.jpg', { type: 'image/jpeg' }),
            )
            .catch(() => this.selectedFile!);

        from(getFile())
          .pipe(
            switchMap((file) =>
              this.mediaService.uploadPostImage(file, postId),
            ),
            tap((imageUrl: string) => {
              this.createPost(currentUser.id, imageUrl, postId);
            }),
            catchError((error: any) => {
              const errorMessage =
                error?.message ||
                this.translate.instant('form.error.uploadFailed');
              this.notificationService.error(errorMessage);
              this.loader.hide();
              return of(null);
            }),
          )
          .subscribe();
      } else {
        this.isPosting.set(false);
        this.notificationService.error(
          this.translate.instant('form.error.imageRequired'),
        );
        this.loader.hide();
      }
    }
  }

  private createPost(userId: string, imageUrl: string, postId?: string): void {
    const postData: Omit<Post, 'id'> = {
      title: this.form.value.title,
      image: imageUrl,
      description: this.form.value.description || '',
      favorites: 0,
      comments: [],
    };

    this.postService
      .createPost(userId, postData, postId)
      .pipe(
        tap(() => {
          this.notificationService.success(
            this.translate.instant('createPost.success.postCreated'),
          );
          this.dialog.closeAll();
        }),
        catchError(() => {
          this.notificationService.error(
            this.translate.instant('createPost.error.postFailed'),
          );
          return of(null);
        }),
        finalize(() => {
          this.isPosting.set(false);
          this.loader.hide();
        }),
      )
      .subscribe();
  }
}
