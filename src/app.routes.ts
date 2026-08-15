import { Routes } from '@angular/router';
import { redirectIfAuthenticatedGuard, authGuard } from './app/shared';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./app/pages/home/home.component').then(
        (module) => module.HomeComponent,
      ),
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'featured',
    loadComponent: () =>
      import('./app/pages/featured/featured.component').then(
        (module) => module.FeaturedComponent,
      ),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./app/pages/profile/profile.component').then(
        (module) => module.ProfileComponent,
      ),
  },
  {
    path: 'my-page',
    redirectTo: '/profile/me',
  },
  {
    path: 'following',
    loadComponent: () =>
      import('./app/pages/following/following.component').then(
        (module) => module.FollowingComponent,
      ),
    canActivate: [authGuard],
  },
];
