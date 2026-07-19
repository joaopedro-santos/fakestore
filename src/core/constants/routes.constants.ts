export const ROUTES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  PRODUCTS: {
    ROOT: 'products',
    CREATE: 'new',
    DETAIL: ':id',
    EDIT: ':id/edit',
  },
} as const;
