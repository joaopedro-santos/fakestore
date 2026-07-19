import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { SessionService } from '../services/session.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationService: { error: jest.Mock };
  let sessionService: { clearSession: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    TestBed.resetTestingModule();
    notificationService = { error: jest.fn() };
    sessionService = { clearSession: jest.fn() };
    router = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationService },
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve notificar e fazer logout em 401', () => {
    httpClient.get('/api/products').subscribe({ error: () => undefined });

    const req = httpTestingController.expectOne('/api/products');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(notificationService.error).toHaveBeenCalledWith('Sessão inválida.');
    expect(sessionService.clearSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve notificar erro 404', () => {
    httpClient.get('/api/products').subscribe({ error: () => undefined });

    const req = httpTestingController.expectOne('/api/products');
    req.flush('Not found', { status: 404, statusText: 'Not found' });

    expect(notificationService.error).toHaveBeenCalledWith('Recurso não encontrado.');
  });
});
