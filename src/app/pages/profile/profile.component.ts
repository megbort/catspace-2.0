import { Component, signal, computed } from '@angular/core';
import {
  Post,
  PostService,
  AuthService,
  UserService,
  LoaderService,
  User,
} from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { catchError, switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../../components/create-post/create-post.component';

@Component({
  selector: 'app-profile',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    PostCardComponent,
    CommonModule,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private readonly _user = signal<User | undefined>(undefined);
  private readonly currentProfileId = signal('');

  posts: Post[] = [];
  isOwner = signal(false);

  user = computed(() => {
    const currentUser = this.authService.currentUserSignal();
    const isOwner = this.isOwner();
    const profileId = this.currentProfileId();

    if (currentUser && isOwner && profileId === currentUser.id) {
      return currentUser;
    }
    return this._user();
  });

  get loading() {
    return this.loader.isLoading;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly postService: PostService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loader: LoaderService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        if (id === 'me') {
          this.handleMeRoute();
        } else {
          this.currentProfileId.set(id);
          this.loadProfileData(id);
        }
      }
    });
  }

  private handleMeRoute(): void {
    const currentUser = this.authService.currentUserSignal();

    if (currentUser) {
      this.currentProfileId.set(currentUser.id);
      this.loadProfileData(currentUser.id);
    } else {
      this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
        if (firebaseUser) {
          this.currentProfileId.set(firebaseUser.uid);
          this.loadProfileData(firebaseUser.uid);
        } else {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  private loadProfileData(id: string): void {
    this.loader.show();

    const currentUser = this.authService.currentUserSignal();

    if (!currentUser) {
      this.authService.user$.pipe(take(1)).subscribe((firebaseUser) => {
        if (firebaseUser && firebaseUser.uid === id) {
          this.isOwner.set(true);
          this.loadUserData(id);
        } else {
          this.tryLoadAsUser(id);
        }
      });
    } else {
      const isCurrentUser = currentUser.id === id;
      this.isOwner.set(isCurrentUser);

      if (isCurrentUser) {
        this.loadUserData(id);
      } else {
        this.loadUserDataVisitor(id);
      }
    }
  }

  private tryLoadAsUser(id: string): void {
    this.userService
      .getUserProfileById(id)
      .then((userData) => {
        if (userData) {
          this.isOwner.set(true);
          this._user.set(userData);
          this.loadUserPosts(id);
        } else {
          this.loadUserDataVisitor(id);
        }
      })
      .catch((error) => {
        console.error('Error loading user data, trying user data', error);
        this.loadUserDataVisitor(id);
      });
  }

  private loadUserData(id: string): void {
    this.userService
      .getUserProfileById(id)
      .then((userData) => {
        if (userData) {
          this._user.set(userData);
          this.loadUserPosts(id);
        } else {
          this.loader.hide();
        }
      })
      .catch((error) => {
        console.error('Error loading user data', error);
        this.loader.hide();
      });
  }

  private loadUserDataVisitor(id: string): void {
    this.userService
      .getUserById(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading user data', error);
          return [null];
        }),
        switchMap((userData) => {
          if (userData) {
            this._user.set(userData);
            return this.postService.getPostsByProfileId(id);
          } else {
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error loading posts', error);
          return [];
        })
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.loader.hide();
      });
  }

  private loadUserPosts(id: string): void {
    this.postService
      .getPostsByProfileId(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading posts', error);
          return [];
        })
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.loader.hide();
      });
  }

  editProfile(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px',
      autoFocus: false,
    });
  }

  newPost(): void {
    this.dialog.open(CreatePostComponent, {
      width: '550px',
      autoFocus: false,
    });
  }
}
