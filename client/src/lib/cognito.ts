// Client-side Cognito service that uses backend API endpoints

export interface CognitoUserData {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  attributes: Record<string, string>;
}

export interface CognitoUser extends CognitoUserData {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}

export interface AuthResult {
  user: CognitoUserData;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  challengeName?: string;
  session?: string;
}

class CognitoService {
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private refreshToken: string | null = null;
  private currentUser: CognitoUserData | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    try {
      this.accessToken = localStorage.getItem('cognito_access_token');
      this.idToken = localStorage.getItem('cognito_id_token');
      this.refreshToken = localStorage.getItem('cognito_refresh_token');
      const userStr = localStorage.getItem('cognito_user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
    }
  }

  private saveTokensToStorage(tokens: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }) {
    try {
      localStorage.setItem('cognito_access_token', tokens.accessToken);
      localStorage.setItem('cognito_id_token', tokens.idToken);
      localStorage.setItem('cognito_refresh_token', tokens.refreshToken);
      
      this.accessToken = tokens.accessToken;
      this.idToken = tokens.idToken;
      this.refreshToken = tokens.refreshToken;
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  private saveUserToStorage(user: CognitoUserData) {
    try {
      localStorage.setItem('cognito_user', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  private clearStorage() {
    try {
      localStorage.removeItem('cognito_access_token');
      localStorage.removeItem('cognito_id_token');
      localStorage.removeItem('cognito_refresh_token');
      localStorage.removeItem('cognito_user');
      
      this.accessToken = null;
      this.idToken = null;
      this.refreshToken = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  private parseUserFromToken(idToken: string): CognitoUserData {
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return {
        username: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        emailVerified: payload.email_verified === true,
        attributes: payload,
      };
    } catch (error) {
      console.error("Error parsing user from token:", error);
      throw new Error("Invalid token format");
    }
  }

  async signUp(
    email: string,
    password: string,
    attributes: Record<string, string> = {}
  ): Promise<void> {
    try {
      const response = await fetch('/api/cognito/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: attributes.given_name,
          lastName: attributes.family_name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }
    } catch (error: any) {
      console.error("SignUp error:", error);
      throw {
        code: error.code || 'SignUpError',
        message: error.message,
      };
    }
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      const response = await fetch('/api/cognito/confirm-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }
    } catch (error: any) {
      console.error("ConfirmSignUp error:", error);
      throw {
        code: error.code || 'ConfirmSignUpError',
        message: error.message,
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
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

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }

      const result = await response.json();

      if (result.challengeName === "NEW_PASSWORD_REQUIRED") {
        return {
          user: { username: email, email, emailVerified: false, attributes: {} },
          accessToken: "",
          idToken: "",
          refreshToken: "",
          challengeName: result.challengeName,
          session: result.session,
        };
      }

      this.saveTokensToStorage({
        accessToken: result.accessToken,
        idToken: result.idToken,
        refreshToken: result.refreshToken,
      });

      this.saveUserToStorage(result.user);

      return result;
    } catch (error: any) {
      console.error("SignIn error:", error);
      throw {
        code: error.code || 'SignInError',
        message: error.message,
      };
    }
  }

  async completeNewPassword(
    email: string,
    temporaryPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      const response = await fetch('/api/cognito/complete-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          temporaryPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }

      const result = await response.json();

      this.saveTokensToStorage({
        accessToken: result.accessToken,
        idToken: result.idToken,
        refreshToken: result.refreshToken,
      });

      this.saveUserToStorage(result.user);

      return result;
    } catch (error: any) {
      console.error("CompleteNewPassword error:", error);
      throw {
        code: error.code || 'CompleteNewPasswordError',
        message: error.message,
      };
    }
  }

  async forgotPassword(email: string): Promise<void> {
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

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }
    } catch (error: any) {
      console.error("ForgotPassword error:", error);
      throw {
        code: error.code || 'ForgotPasswordError',
        message: error.message,
      };
    }
  }

  async confirmPassword(email: string, code: string, newPassword: string): Promise<void> {
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

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }
    } catch (error: any) {
      console.error("ConfirmPassword error:", error);
      throw {
        code: error.code || 'ConfirmPasswordError',
        message: error.message,
      };
    }
  }

  async resendSignUp(email: string): Promise<void> {
    try {
      const response = await fetch('/api/cognito/resend-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.error,
          message: error.message,
        };
      }
    } catch (error: any) {
      console.error("ResendSignUp error:", error);
      throw {
        code: error.code || 'ResendSignUpError',
        message: error.message,
      };
    }
  }

  async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      if (!this.accessToken) {
        return null;
      }

      const user: CognitoUser = {
        username: this.currentUser?.username || "",
        email: this.currentUser?.email || "",
        firstName: this.currentUser?.firstName,
        lastName: this.currentUser?.lastName,
        emailVerified: this.currentUser?.emailVerified || false,
        attributes: this.currentUser?.attributes || {},
        accessToken: this.accessToken,
        idToken: this.idToken,
        refreshToken: this.refreshToken,
      };

      return user;
    } catch (error: any) {
      console.error("GetCurrentUser error:", error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      this.clearStorage();
    } catch (error: any) {
      console.error("SignOut error:", error);
    }
  }

  isAuthenticated(): boolean {
    return !!(this.accessToken && this.currentUser);
  }

  getCurrentUserSync(): CognitoUser | null {
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getIdToken(): string | null {
    return this.idToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

export const cognitoService = new CognitoService();