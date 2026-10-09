import { Routes } from '@angular/router';
import { redirectIfAuthenticatedGuard, authGuard } from './app/shared';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    title: 'pageTitle.home',
    loadComponent: () =>
      import('./app/pages/home/home.component').then(
        (module) => module.HomeComponent,
      ),
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'featured',
    title: 'pageTitle.featured',
    loadComponent: () =>
      import('./app/pages/featured/featured.component').then(
        (module) => module.FeaturedComponent,
      ),
  },
  {
    path: 'profile/:id',
    title: 'pageTitle.profile',
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
    title: 'pageTitle.following',
    loadComponent: () =>
      import('./app/pages/following/following.component').then(
        (module) => module.FollowingComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    title: 'pageTitle.notFound',
    loadComponent: () =>
      import('./app/pages/not-found/not-found.component').then(
        (module) => module.NotFoundComponent,
      ),
  },
];
