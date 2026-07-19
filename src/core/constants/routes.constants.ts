export const ROUTES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  PRODUCTS: {
    ROOT: 'products',
    CREATE: 'new',
    EDIT: ':id/edit',
  },
} as const;
