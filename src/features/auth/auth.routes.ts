import { Routes } from '@angular/router';
import { ROUTES } from '../../core/constants/routes.constants';
import { AuthLayoutComponent } from '../../shared/layouts/auth-layout/auth-layout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTES.LOGIN,
      },
      {
        path: ROUTES.LOGIN,
        loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
      },
    ],
  },
];
