import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Pages will be created as components
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: {} as any },
  { path: 'register', component: {} as any },
  { path: 'home', component: {} as any },
  {
    path: 'rooms',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'rooms/new',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'rooms/:id/edit',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'orders',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/new',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/:id/edit',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/by-date',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'report',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'admin/users',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/roles',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'news',
    component: {} as any,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  }
];
