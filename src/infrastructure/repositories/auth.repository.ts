import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApiService } from '../api/auth-api.service';
import { LoginRequest } from '../../features/auth/models/login-request.model';
import { LoginResponse } from '../../features/auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  constructor(private readonly authApiService: AuthApiService) {}

  public login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authApiService.login(payload);
  }
}
