import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthFacade } from './auth.facade';
import { AuthRepository } from '../../../infrastructure/repositories/auth.repository';
import { SessionService } from '../../../core/services/session.service';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authRepository: { login: jest.Mock };
  let sessionService: { login: jest.Mock };

  beforeEach(() => {
    TestBed.resetTestingModule();
    authRepository = {
      login: jest.fn(),
    };

    sessionService = {
      login: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthRepository, useValue: authRepository },
        { provide: SessionService, useValue: sessionService },
      ],
    });

    facade = TestBed.inject(AuthFacade);
  });

  it('deve autenticar o usuário e salvar o token', () => {
    const request: LoginRequest = { username: 'teste@email.com', password: '123456' };
    const response: LoginResponse = { token: 'TOKEN' };

    authRepository.login.mockReturnValue(of(response));

    facade.login(request).subscribe();

    expect(authRepository.login).toHaveBeenCalledWith(request);
    expect(sessionService.login).toHaveBeenCalledWith(response.token);
  });

  it('deve atualizar loading durante o login', () => {
    const request: LoginRequest = { username: 'teste@email.com', password: '123456' };
    authRepository.login.mockReturnValue(of({ token: 'TOKEN' }));

    let state: { loading: boolean; error: string | null } | undefined;
    facade.state$.subscribe((value) => {
      state = value;
    });

    facade.login(request).subscribe();

    expect(state?.loading).toBe(false);
  });

  it('deve tratar erro da API', () => {
    const request: LoginRequest = { username: 'teste@email.com', password: '123456' };
    authRepository.login.mockReturnValue(throwError(() => new Error('boom')));

    let emittedError: string | null = null;
    facade.state$.subscribe((value) => {
      emittedError = value.error;
    });

    facade.login(request).subscribe({ error: () => undefined });

    expect(emittedError).toBe('Falha ao realizar login.');
  });
});
