import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/list/list.page').then((m) => m.ListPage),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/create/create.page').then((m) => m.CreatePage),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/edit/edit.page').then((m) => m.EditPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/detail.page').then((m) => m.DetailPage),
  },
];
