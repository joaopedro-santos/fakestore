import { Routes } from '@angular/router';
import { ROUTES } from '../core/constants/routes.constants';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../features/home/home.routes').then((module) => module.HOME_ROUTES),
  },
  {
    path: ROUTES.LOGIN,
    loadChildren: () => import('../features/auth/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: ROUTES.PRODUCTS.ROOT,
    canActivate: [authGuard],
    loadChildren: () => import('../features/products/products.routes').then((module) => module.PRODUCTS_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
