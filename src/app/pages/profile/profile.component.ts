import { Component, signal } from '@angular/core';
import {
  Post,
  PostService,
  Profile,
  ProfileService,
  AuthService,
  UserService,
  LoaderService,
} from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { catchError, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, MatButtonModule, PostCardComponent, CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  profile?: Profile;
  posts: Post[] = [];
  isOwner = signal(false);
  private currentProfileId = '';

  get loading() {
    return this.loader.isLoading;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly profileService: ProfileService,
    private readonly postService: PostService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        // Handle "me" route parameter
        if (id === 'me') {
          const currentUser = this.authService.currentUserSignal();
          if (currentUser) {
            this.currentProfileId = currentUser.id;
            this.loadProfileData(currentUser.id);
          } else {
            // Redirect to home if not logged in
            this.router.navigate(['/home']);
          }
        } else {
          this.currentProfileId = id;
          this.loadProfileData(id);
        }
      }
    });
  }

  private loadProfileData(id: string): void {
    this.loader.show();

    const currentUser = this.authService.currentUserSignal();

    if (!currentUser) {
      this.tryLoadAsUser(id);
    } else {
      const isCurrentUser = currentUser.id === id;
      this.isOwner.set(isCurrentUser);

      if (isCurrentUser) {
        this.loadUserData(id);
      } else {
        this.loadProfileDataVisitor(id);
      }
    }
  }

  private tryLoadAsUser(id: string): void {
    this.userService
      .getUserProfileById(id)
      .then((userData) => {
        if (userData) {
          this.isOwner.set(true);
          this.profile = userData as unknown as Profile;
          this.loadUserPosts(id);
        } else {
          this.loadProfileDataVisitor(id);
        }
      })
      .catch((error) => {
        console.error('Error loading user data, trying profile data', error);
        this.loadProfileDataVisitor(id);
      });
  }

  private loadUserData(id: string): void {
    this.userService
      .getUserProfileById(id)
      .then((userData) => {
        if (userData) {
          this.profile = userData as unknown as Profile;
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

  private loadProfileDataVisitor(id: string): void {
    this.profileService
      .getProfileById(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading profile data', error);
          return [null];
        }),
        switchMap((profileData) => {
          if (profileData) {
            this.profile = profileData;
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
}
