import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { SessionService } from '../services/session.service';

describe('authGuard', () => {
  let sessionService: { hasValidSession: jest.Mock };
  let router: { createUrlTree: jest.Mock };

  beforeEach(() => {
    TestBed.resetTestingModule();
    sessionService = { hasValidSession: jest.fn() };
    router = { createUrlTree: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('deve permitir acesso para usuário autenticado', () => {
    sessionService.hasValidSession.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(undefined as never, { url: '/products' } as never));

    expect(result).toBe(true);
  });

  it('deve redirecionar para login quando não autenticado', () => {
    const tree = { root: [] };
    sessionService.hasValidSession.mockReturnValue(false);
    router.createUrlTree.mockReturnValue(tree as never);

    const result = TestBed.runInInjectionContext(() => authGuard(undefined as never, { url: '/products' } as never));

    expect(router.createUrlTree).toHaveBeenCalledWith(['login']);
    expect(result).toBe(tree);
  });
});
