import { Routes } from '@angular/router';
import { FeaturedComponent } from './app/pages/featured/featured.component';
import { HomeComponent } from './app/pages/home/home.component';
import { ProfileComponent } from './app/pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'featured', component: FeaturedComponent },
  { path: 'profile/:id', component: ProfileComponent },
];
