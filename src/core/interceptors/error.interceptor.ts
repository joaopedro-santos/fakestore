import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { SessionService } from '../services/session.service';
import { HttpErrorModel } from '../models/http-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const httpError: HttpErrorModel = {
        status: error.status,
        message: error.message,
      };

      const messageByStatus: Record<number, string> = {
        400: 'Requisição inválida.',
        401: 'Sessão inválida.',
        403: 'Acesso negado.',
        404: 'Recurso não encontrado.',
        500: 'Erro interno.',
      };

      const message = messageByStatus[httpError.status] ?? 'Erro inesperado.';
      notificationService.error(message);

      if (httpError.status === 401) {
        sessionService.clearSession();
        router.navigate(['/login']);
      }

      return throwError(() => httpError);
    }),
  );
};
