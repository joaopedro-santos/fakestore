import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/dashboard-page.component').then(
        (module) => module.DashboardPageComponent,
      ),
  },
];
