import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../interfaces/login-response';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockLoginResponse: LoginResponse = {
    token: 'mock-token',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with null token if no token in localStorage', () => {
      
      expect(service.token).toBeNull();
      service.token$.subscribe((token) => {
        expect(token).toBeNull();
      });
    });
  });

  describe('login()', () => {
    it('should make POST request to login endpoint', () => {
      const username = 'testuser';
      const password = 'testpass';

      service.login(username, password).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });

      req.flush(mockLoginResponse);
    });

    it('should store token in localStorage and update token$ on successful login', () => {
      service.login('testuser', 'testpass').subscribe(() => {
        expect(localStorage.getItem('token')).toBe(mockLoginResponse.token);
        expect(service.token).toBe(mockLoginResponse.token);

        service.token$.subscribe((token) => {
          expect(token).toBe(mockLoginResponse.token);
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);
    });
  });

  describe('logout()', () => {
    it('should remove token from localStorage and set token$ to null', () => {
      localStorage.setItem('token', 'existing-token');
      service.token$.next('existing-token');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(service.token).toBeNull();

      service.token$.subscribe((token) => {
        expect(token).toBeNull();
      });
    });
  });

  describe('token getter', () => {
    it('should return current token value', () => {
      service.token$.next('test-token');
      expect(service.token).toBe('test-token');

      service.token$.next(null);
      expect(service.token).toBeNull();
    });
  });

  describe('url getter', () => {
    it('should return correct auth API URL', () => {
      expect(service.url).toBe(`${environment.apiUrl}/auth`);
    });
  });
});
