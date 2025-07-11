import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import CryptoJS from "crypto-js";

const REGION = import.meta.env.VITE_AWS_REGION || "us-east-1";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_COGNITO_CLIENT_SECRET;
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;

if (!CLIENT_ID || !USER_POOL_ID) {
  throw new Error("Missing Cognito configuration. Please set VITE_COGNITO_CLIENT_ID and VITE_COGNITO_USER_POOL_ID");
}

// Function to calculate SECRET_HASH using HMAC-SHA256
function calculateSecretHash(username: string): string {
  if (!CLIENT_SECRET) {
    throw new Error("CLIENT_SECRET is required but not configured");
  }
  
  const message = username + CLIENT_ID;
  const hash = CryptoJS.HmacSHA256(message, CLIENT_SECRET);
  return CryptoJS.enc.Base64.stringify(hash);
}

const client = new CognitoIdentityProviderClient({
  region: REGION,
});

export interface CognitoUser {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  attributes: Record<string, string>;
}

export interface AuthResult {
  user: CognitoUser;
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
  private currentUser: CognitoUser | null = null;

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

  private saveUserToStorage(user: CognitoUser) {
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

  private parseUserFromToken(idToken: string): CognitoUser {
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
      const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        SecretHash: calculateSecretHash(email),
        UserAttributes: [
          { Name: "email", Value: email },
          ...Object.entries(attributes).map(([key, value]) => ({
            Name: key,
            Value: value,
          })),
        ],
      });

      await client.send(command);
    } catch (error: any) {
      console.error("SignUp error:", error);
      throw {
        code: error.name,
        message: error.message,
      };
    }
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        SecretHash: calculateSecretHash(email),
      });

      await client.send(command);
    } catch (error: any) {
      console.error("ConfirmSignUp error:", error);
      throw {
        code: error.name,
        message: error.message,
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const command = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: calculateSecretHash(email),
        },
      });

      const response = await client.send(command);

      if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        return {
          user: { username: email, email, emailVerified: false, attributes: {} },
          accessToken: "",
          idToken: "",
          refreshToken: "",
          challengeName: response.ChallengeName,
          session: response.Session,
        };
      }

      if (!response.AuthenticationResult) {
        throw new Error("Authentication failed");
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
      console.error("SignIn error:", error);
      throw {
        code: error.name,
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
        AuthFlow: "USER_PASSWORD_AUTH",
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
      const command = new ForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        SecretHash: calculateSecretHash(email),
      });

      await client.send(command);
    } catch (error: any) {
      console.error("ForgotPassword error:", error);
      throw {
        code: error.name,
        message: error.message,
      };
    }
  }

  async confirmPassword(email: string, code: string, newPassword: string): Promise<void> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
        SecretHash: calculateSecretHash(email),
      });

      await client.send(command);
    } catch (error: any) {
      console.error("ConfirmPassword error:", error);
      throw {
        code: error.name,
        message: error.message,
      };
    }
  }

  async resendSignUp(email: string): Promise<void> {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: CLIENT_ID,
        Username: email,
        SecretHash: calculateSecretHash(email),
      });

      await client.send(command);
    } catch (error: any) {
      console.error("ResendSignUp error:", error);
      throw {
        code: error.name,
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