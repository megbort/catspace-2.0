import { Routes } from '@angular/router';
import { FeaturedComponent } from './app/pages/featured/featured.component';
import { HomeComponent } from './app/pages/home/home.component';
import { ProfileComponent } from './app/pages/profile/profile.component';
import { redirectIfAuthenticatedGuard, authGuard } from './app/shared';
import { FollowingComponent } from './app/pages/following/following.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [redirectIfAuthenticatedGuard],
  },
  { path: 'featured', component: FeaturedComponent },
  { path: 'profile/:id', component: ProfileComponent },
  {
    path: 'my-page',
    redirectTo: '/profile/me',
  },
  {
    path: 'following',
    component: FollowingComponent,
    canActivate: [authGuard],
  },
];
