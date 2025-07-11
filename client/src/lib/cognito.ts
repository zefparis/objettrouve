// Client-side Cognito service that uses backend API endpoints

export interface CognitoUserData {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  attributes: Record<string, string>;
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
      this.accessToken = localStorage.getItem("cognito_access_token");
      this.idToken = localStorage.getItem("cognito_id_token");
      this.refreshToken = localStorage.getItem("cognito_refresh_token");
      const userStr = localStorage.getItem("cognito_user");
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error("Error loading tokens from storage:", error);
    }
  }

  private saveTokensToStorage(tokens: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }) {
    try {
      localStorage.setItem("cognito_access_token", tokens.accessToken);
      localStorage.setItem("cognito_id_token", tokens.idToken);
      localStorage.setItem("cognito_refresh_token", tokens.refreshToken);
      this.accessToken = tokens.accessToken;
      this.idToken = tokens.idToken;
      this.refreshToken = tokens.refreshToken;
    } catch (error) {
      console.error("Error saving tokens to storage:", error);
    }
  }

  private saveUserToStorage(user: CognitoUserData) {
    try {
      localStorage.setItem("cognito_user", JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  }

  private clearStorage() {
    try {
      localStorage.removeItem("cognito_access_token");
      localStorage.removeItem("cognito_id_token");
      localStorage.removeItem("cognito_refresh_token");
      localStorage.removeItem("cognito_user");
      this.accessToken = null;
      this.idToken = null;
      this.refreshToken = null;
      this.currentUser = null;
    } catch (error) {
      console.error("Error clearing storage:", error);
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
      // First, get the session by signing in with temporary password
      const initiateCommand = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: temporaryPassword,
          SECRET_HASH: calculateSecretHash(email),
        },
      });

      const initiateResponse = await client.send(initiateCommand);

      if (!initiateResponse.Session) {
        throw new Error("No session available for password change");
      }

      // Then respond to the NEW_PASSWORD_REQUIRED challenge
      const respondCommand = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: initiateResponse.Session,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
          SECRET_HASH: calculateSecretHash(email),
        },
      });

      const response = await client.send(respondCommand);

      if (!response.AuthenticationResult) {
        throw new Error("Password change failed");
      }

      const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;

      if (!AccessToken || !IdToken || !RefreshToken) {
        throw new Error("Invalid authentication response");
      }

      const user = this.parseUserFromToken(IdToken);

      this.saveTokensToStorage({
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
      });

      this.saveUserToStorage(user);

      return {
        user,
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
      };
    } catch (error: any) {
      console.error("CompleteNewPassword error:", error);
      throw {
        code: error.name,
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
    if (!this.accessToken) {
      return null;
    }

    try {
      const command = new GetUserCommand({
        AccessToken: this.accessToken,
      });

      const response = await client.send(command);

      if (!response.UserAttributes) {
        return null;
      }

      const attributes: Record<string, string> = {};
      response.UserAttributes.forEach((attr) => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value;
        }
      });

      const user: CognitoUser = {
        username: response.Username || "",
        email: attributes.email || "",
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        emailVerified: attributes.email_verified === "true",
        attributes,
      };

      this.saveUserToStorage(user);
      return user;
    } catch (error: any) {
      console.error("GetCurrentUser error:", error);
      // If token is invalid, clear storage
      if (error.name === "NotAuthorizedException") {
        this.clearStorage();
      }
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (this.accessToken) {
        const command = new GlobalSignOutCommand({
          AccessToken: this.accessToken,
        });

        await client.send(command);
      }
    } catch (error: any) {
      console.error("SignOut error:", error);
    } finally {
      this.clearStorage();
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