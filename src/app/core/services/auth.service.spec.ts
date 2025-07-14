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
