// Client-side Cognito service - Simplified version
// All communication goes through backend API

export interface SimpleCognitoUser {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
}

export interface SimpleCognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface SimpleAuthResult {
  success: boolean;
  user?: SimpleCognitoUser;
  tokens?: SimpleCognitoTokens;
  challengeName?: string;
  session?: string;
  message?: string;
}

class SimpleCognitoService {
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private refreshToken: string | null = null;
  private currentUser: SimpleCognitoUser | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      this.accessToken = localStorage.getItem('simple_cognito_access_token');
      this.idToken = localStorage.getItem('simple_cognito_id_token');
      this.refreshToken = localStorage.getItem('simple_cognito_refresh_token');
      const userStr = localStorage.getItem('simple_cognito_user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
    }
  }

  private saveToStorage(tokens: SimpleCognitoTokens, user: SimpleCognitoUser) {
    try {
      localStorage.setItem('simple_cognito_access_token', tokens.accessToken);
      localStorage.setItem('simple_cognito_id_token', tokens.idToken);
      localStorage.setItem('simple_cognito_refresh_token', tokens.refreshToken);
      localStorage.setItem('simple_cognito_user', JSON.stringify(user));
      
      this.accessToken = tokens.accessToken;
      this.idToken = tokens.idToken;
      this.refreshToken = tokens.refreshToken;
      this.currentUser = user;
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  private clearStorage() {
    try {
      localStorage.removeItem('simple_cognito_access_token');
      localStorage.removeItem('simple_cognito_id_token');
      localStorage.removeItem('simple_cognito_refresh_token');
      localStorage.removeItem('simple_cognito_user');
      
      this.accessToken = null;
      this.idToken = null;
      this.refreshToken = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  async signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/cognito/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'inscription',
      };
    }
  }

  async signIn(email: string, password: string): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/cognito/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user && data.tokens) {
          this.saveToStorage(data.tokens, data.user);
          return {
            success: true,
            user: data.user,
            tokens: data.tokens,
            message: data.message,
          };
        } else if (data.challengeName) {
          return {
            success: false,
            challengeName: data.challengeName,
            session: data.session,
            message: data.message,
          };
        }
      }

      return {
        success: false,
        message: data.message || 'Erreur de connexion',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la connexion',
      };
    }
  }

  async completeNewPassword(email: string, session: string, newPassword: string): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/cognito/complete-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          session,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user && data.tokens) {
          this.saveToStorage(data.tokens, data.user);
          return {
            success: true,
            user: data.user,
            tokens: data.tokens,
            message: data.message,
          };
        }
      }

      return {
        success: false,
        message: data.message || 'Erreur lors de la mise à jour du mot de passe',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du mot de passe',
      };
    }
  }

  async forgotPassword(email: string): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/cognito/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'envoi du code',
      };
    }
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/cognito/confirm-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la réinitialisation',
      };
    }
  }

  async signOut(): Promise<void> {
    this.clearStorage();
  }

  isAuthenticated(): boolean {
    return !!(this.accessToken && this.idToken && this.currentUser);
  }

  getCurrentUser(): SimpleCognitoUser | null {
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const simpleCognitoService = new SimpleCognitoService();