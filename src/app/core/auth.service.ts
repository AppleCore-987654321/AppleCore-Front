import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginRequest,
  LoginResponse,
  RawLoginResponse,
} from './models/out/auth.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private usernameSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('username')
  );
  private userRolSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('userRol')
  );
  private customerIdSubject = new BehaviorSubject<number | null>(
    this.getStoredCustomerId()
  );

  username$ = this.usernameSubject.asObservable();
  userRol$ = this.userRolSubject.asObservable();
  customerId$ = this.customerIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredCustomerId(): number | null {
    const stored = localStorage.getItem('customerId');
    return stored ? Number(stored) : null;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Usuario de prueba para desarrollo
    if (credentials.username === 'applefan' && credentials.password === '123456') {
      const mockResponse: LoginResponse = {
        jwt: 'mock-jwt-token-12345',
        username: 'Apple Lover',
        roleType: 'CUSTOMER',
        customerId: 1
      };

      localStorage.setItem('token', mockResponse.jwt);
      this.setAuthData(mockResponse.username, mockResponse.roleType, mockResponse.customerId);

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockResponse);
          observer.complete();
        }, 500);
      });
    }

    // Usuario de prueba para ADMIN
    if (credentials.username === 'admincore' && credentials.password === 'admin123') {
      const mockAdminResponse: LoginResponse = {
        jwt: 'mock-admin-token-98765',
        username: 'Admin Core',
        roleType: 'ADMIN',
        customerId: null
      };

      localStorage.setItem('token', mockAdminResponse.jwt);
      this.setAuthData(mockAdminResponse.username, mockAdminResponse.roleType);

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockAdminResponse);
          observer.complete();
        }, 500);
      });
    }


    return this.http
      .post<RawLoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map((res) =>
          res && res.data ? res.data : (res as unknown as LoginResponse)
        ),
        tap((data) => {
          // Guardar token
          if (data.jwt) {
            localStorage.setItem('token', data.jwt);
          }

          // Usar setAuthData para el resto
          this.setAuthData(
            data.username || null,
            data.roleType || null,
            data.customerId
          );

          console.log('localStorage:', {
            token: this.getToken(),
            username: this.getUsername(),
            userRol: this.getUserRol(),
            customerId: this.getCustomerId(),
          });
        })
      );
  }

  setAuthData(username: string | null, userRol: string | null, customerId: number | null = null) {
    if (username) {
      localStorage.setItem('username', username);
      this.usernameSubject.next(username);
    }

    if (userRol) {
      localStorage.setItem('userRol', userRol);
      this.userRolSubject.next(userRol);
    }

    // Manejar customerId correctamente (puede ser null)
    if (customerId !== null && customerId !== undefined) {
      localStorage.setItem('customerId', customerId.toString());
      this.customerIdSubject.next(customerId);
    } else {
      localStorage.removeItem('customerId');
      this.customerIdSubject.next(null);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRol');
    localStorage.removeItem('customerId');

    this.usernameSubject.next(null);
    this.userRolSubject.next(null);
    this.customerIdSubject.next(null);
  }



  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  getUserRol(): string | null {
    return this.userRolSubject.value;
  }

  getCustomerId(): number | null {
    return this.customerIdSubject.value;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token.trim().length > 0;
  }
}

