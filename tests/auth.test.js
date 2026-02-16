import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../src/auth/auth.js';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    authService.tokenKey = 'authToken';
    authService.usernameKey = 'username';
    authService.csrfToken = null;
  });

  describe('setToken/getToken', () => {
    it('should store and retrieve token', () => {
      authService.setToken('test-token-123');
      expect(authService.getToken()).toBe('test-token-123');
    });
  });

  describe('setUsername/getUsername', () => {
    it('should store and retrieve username', () => {
      authService.setUsername('testuser');
      expect(authService.getUsername()).toBe('testuser');
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no token', () => {
      expect(authService.isLoggedIn()).toBe(false);
    });

    it('should return true when token exists', () => {
      authService.setToken('token');
      expect(authService.isLoggedIn()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear token and username', () => {
      authService.setToken('token');
      authService.setUsername('user');
      authService.logout();
      expect(authService.getToken()).toBe(null);
      expect(authService.getUsername()).toBe(null);
    });
  });

  describe('getAuthHeaders', () => {
    it('should return empty object when no token', () => {
      expect(authService.getAuthHeaders()).toEqual({});
    });

    it('should return Authorization header when token exists', () => {
      authService.setToken('my-token');
      expect(authService.getAuthHeaders()).toEqual({
        'Authorization': 'Bearer my-token'
      });
    });
  });

  describe('login', () => {
    it('should return success with token on valid credentials', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ token: 'abc123', username: 'testuser' })
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await authService.login('testuser', 'password');

      expect(result.success).toBe(true);
      expect(result.data.token).toBe('abc123');
      expect(result.data.username).toBe('testuser');
    });

    it('should return error on invalid credentials', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await authService.login('wrong', 'wrong');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should return error on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await authService.login('user', 'pass');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Ошибка соединения с сервером');
    });
  });
});
