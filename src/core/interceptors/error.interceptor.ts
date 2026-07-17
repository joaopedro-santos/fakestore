import { HttpInterceptorFn } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Placeholder for future centralized error handling.
  return next(req);
};
