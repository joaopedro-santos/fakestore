import { Routes } from '@angular/router';
import { ROUTES } from '../core/constants/routes.constants';
import { authGuard } from '../core/guards/auth.guard';
import { AppLayoutComponent } from '../shared/layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: ROUTES.LOGIN,
    loadChildren: () =>
      import('../features/auth/auth.routes').then(
        (module) => module.AUTH_ROUTES
      ),
  },

  {
    path: '',
    canActivate: [authGuard],
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTES.DASHBOARD,
      },
      {
        path: ROUTES.DASHBOARD,
        loadChildren: () =>
          import('../features/dashboard/dashboard.routes').then(
            (module) => module.DASHBOARD_ROUTES,
          ),
      },
      {
        path: ROUTES.PRODUCTS.ROOT,
        loadChildren: () =>
          import('../features/products/products.routes').then(
            (module) => module.PRODUCTS_ROUTES,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('../shared/pages/not-found/not-found.page').then(
        (module) => module.NotFoundPage,
      ),
  },
];