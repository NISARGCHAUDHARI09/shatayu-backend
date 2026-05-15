import { jwtDecode } from 'jwt-decode';
import { AUTH_CONFIG } from '../config/auth';

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  name: string;
  exp: number;
  iat: number;
}

export class TokenManager {
  private static instance: TokenManager;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Store token in localStorage or sessionStorage
  setToken(token: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  }

  // Get token from storage
  getToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) || 
           sessionStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  // Remove token from storage
  removeToken(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  }

  // Decode JWT token
  decodeToken(token?: string): TokenPayload | null {
    const authToken = token || this.getToken();
    if (!authToken) return null;

    try {
      return jwtDecode<TokenPayload>(authToken);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  // Check if token is valid (not expired)
  isTokenValid(token?: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  }

  // Check if token is about to expire
  isTokenExpiringSoon(token?: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    const bufferTime = AUTH_CONFIG.REFRESH_BUFFER / 1000;
    
    return decoded.exp - currentTime < bufferTime;
  }

  // Get user info from token
  getUserFromToken(token?: string): TokenPayload | null {
    return this.decodeToken(token);
  }

  // Check if user has specific role
  hasRole(requiredRole: string, token?: string): boolean {
    const user = this.getUserFromToken(token);
    return user?.role === requiredRole;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[], token?: string): boolean {
    const user = this.getUserFromToken(token);
    return user ? roles.includes(user.role) : false;
  }

  // Get token expiration time
  getTokenExpiration(token?: string): Date | null {
    const decoded = this.decodeToken(token);
    return decoded ? new Date(decoded.exp * 1000) : null;
  }

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiration(token?: string): number {
    const expiration = this.getTokenExpiration(token);
    return expiration ? expiration.getTime() - Date.now() : 0;
  }

  // Auto-refresh token setup
  setupAutoRefresh(refreshCallback: () => Promise<string | null>): void {
    const token = this.getToken();
    if (!token || !this.isTokenValid(token)) return;

    const timeUntilRefresh = this.getTimeUntilExpiration(token) - AUTH_CONFIG.REFRESH_BUFFER;
    
    if (timeUntilRefresh > 0) {
      setTimeout(async () => {
        try {
          const newToken = await refreshCallback();
          if (newToken) {
            this.setToken(newToken);
            // Setup next refresh
            this.setupAutoRefresh(refreshCallback);
          }
        } catch (error) {
          console.error('Auto-refresh failed:', error);
          // Logout user on refresh failure
          this.removeToken();
          window.location.href = AUTH_CONFIG.LOGIN_REDIRECT;
        }
      }, timeUntilRefresh);
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();