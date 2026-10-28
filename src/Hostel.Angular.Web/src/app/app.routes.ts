import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomFormComponent } from './pages/room-form/room-form.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { OccupancyReportComponent } from './pages/occupancy-report/occupancy-report.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminRolesComponent } from './pages/admin-roles/admin-roles.component';
import { NewsComponent } from './pages/news/news.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'rooms',
    component: RoomsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'rooms/new',
    component: RoomFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'rooms/:id/edit',
    component: RoomFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/new',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/:id/edit',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/by-date',
    component: OrdersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'report',
    component: OccupancyReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/roles',
    component: AdminRolesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'news',
    component: NewsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  }
];
