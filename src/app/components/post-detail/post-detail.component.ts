import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AuthService,
  FavoriteService,
  NotificationService,
  Post,
} from '../../services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnpicImageDirective } from '@unpic/angular';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthMessageComponent } from '../auth/auth-message.component';

@Component({
  selector: 'app-post-detail',
  imports: [
    TranslateModule,
    UnpicImageDirective,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './post-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit {
  private readonly favoriteService = inject(FavoriteService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<PostDetailComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<{ post?: Post } | null>(
    MAT_DIALOG_DATA,
    { optional: true },
  );

  post = input<Post>({
    id: '',
    title: '',
    image: '',
    description: '',
    favorites: 0,
    comments: [],
    userId: '',
  });

  displayPost = computed(() => this.dialogData?.post ?? this.post());
  isFavorited = signal(false);
  favoriteCount = signal(0);
  loading = signal(false);
  showSparkles = signal(false);

  ngOnInit(): void {
    this.checkIfFavorited();
    this.loadFavoriteCount();
  }

  private checkIfFavorited(): void {
    const currentUser = this.authService.currentUserSignal();
    const post = this.displayPost();

    if (!currentUser || !post.id) {
      return;
    }

    this.favoriteService
      .isPostFavorited(currentUser.id, post.id)
      .pipe(take(1))
      .subscribe((isFavorited) => {
        this.isFavorited.set(isFavorited);
      });
  }

  private loadFavoriteCount(): void {
    const post = this.displayPost();

    if (!post.id || !post.userId) {
      this.favoriteCount.set(post.favorites || 0);
      return;
    }

    this.favoriteService
      .getPostFavoriteCount(post.userId, post.id)
      .pipe(take(1))
      .subscribe((count) => {
        this.favoriteCount.set(count);
      });
  }

  toggleFavorite(event?: Event): void {
    event?.stopPropagation();

    const currentUser = this.authService.currentUserSignal();
    if (!currentUser) {
      this.showAuthMessage();
      return;
    }

    const post = this.displayPost();
    if (!post.id || !post.userId) {
      this.notificationService.error(
        this.translate.instant('favorite.error.favoritePost'),
      );
      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    const wasFavorited = this.isFavorited();

    if (!wasFavorited) {
      this.showSparkles.set(true);
      setTimeout(() => this.showSparkles.set(false), 800);
    }

    if (wasFavorited) {
      this.favoriteService
        .unfavoritePost(currentUser.id, post.id, post.userId)
        .pipe(
          tap(() => {
            this.isFavorited.set(false);
            this.favoriteCount.update((count) => Math.max(0, count - 1));
          }),
          catchError((error) => {
            console.error('Error unfavoriting post:', error);
            this.notificationService.error(
              this.translate.instant('favorite.error.unfavoritePost'),
            );
            return EMPTY;
          }),
          take(1),
          finalize(() => {
            this.loading.set(false);
          }),
        )
        .subscribe();
      return;
    }

    this.favoriteService
      .favoritePost(currentUser.id, post.id, post.userId)
      .pipe(
        tap(() => {
          this.isFavorited.set(true);
          this.favoriteCount.update((count) => count + 1);
        }),
        catchError((error) => {
          console.error('Error favoriting post:', error);
          this.notificationService.error(
            this.translate.instant('favorite.error.favoritePost'),
          );
          return EMPTY;
        }),
        take(1),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe();
  }

  showAuthMessage(): void {
    this.dialog.open(AuthMessageComponent, { autoFocus: false });
  }

  close(): void {
    this.dialogRef?.close();
  }
}
