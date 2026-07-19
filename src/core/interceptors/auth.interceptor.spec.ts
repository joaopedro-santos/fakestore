import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionService } from '../services/session.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let sessionService: { getToken: jest.Mock };

  beforeEach(() => {
    TestBed.resetTestingModule();
    sessionService = { getToken: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: SessionService, useValue: sessionService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve incluir o token no header Authorization', () => {
    sessionService.getToken.mockReturnValue('TOKEN');

    httpClient.get('/api/products').subscribe();

    const req = httpTestingController.expectOne('/api/products');
    expect(req.request.headers.get('Authorization')).toBe('Bearer TOKEN');
    req.flush([]);
  });

  it('deve ignorar rotas públicas', () => {
    sessionService.getToken.mockReturnValue('TOKEN');

    httpClient.post('/auth/login', {}).subscribe();

    const req = httpTestingController.expectOne('/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
