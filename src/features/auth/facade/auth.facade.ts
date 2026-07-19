import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { AuthRepository } from '../../../infrastructure/repositories/auth.repository';
import { SessionService } from '../../../core/services/session.service';
import { AuthState } from '../models/auth-state.model';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly stateSubject = new BehaviorSubject<AuthState>({
    loading: false,
    error: null,
  });

  public readonly state$: Observable<AuthState> = this.stateSubject.asObservable();

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionService: SessionService,
  ) {}

  public login(payload: LoginRequest): Observable<LoginResponse> {
    this.stateSubject.next({ loading: true, error: null });

    return this.authRepository.login(payload).pipe(
      tap((response: LoginResponse) => {
        this.sessionService.login(response.token);
      }),
      catchError((error: unknown) => {
        const message = 'Falha ao realizar login.';
        this.stateSubject.next({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
      finalize(() => {
        const currentState = this.stateSubject.getValue();
        if (currentState.error === null) {
          this.stateSubject.next({ loading: false, error: null });
        }
      }),
    );
  }

  public getPostLoginRoute(): string {
    return this.sessionService.getPostLoginRoute();
  }
}
