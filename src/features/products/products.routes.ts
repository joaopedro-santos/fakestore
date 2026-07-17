import { Routes } from '@angular/router';
import { ROUTES } from '../../core/constants/routes.constants';
import { AppLayoutComponent } from '../../shared/layouts/app-layout/app-layout.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTES.PRODUCTS.ROOT,
      },
      {
        path: ROUTES.PRODUCTS.ROOT,
        loadComponent: () => import('./pages/list/list.page').then((m) => m.ListPage),
      },
      {
        path: ROUTES.PRODUCTS.CREATE,
        loadComponent: () => import('./pages/create/create.page').then((m) => m.CreatePage),
      },
      {
        path: ROUTES.PRODUCTS.EDIT,
        loadComponent: () => import('./pages/edit/edit.page').then((m) => m.EditPage),
      },
    ],
  },
];
