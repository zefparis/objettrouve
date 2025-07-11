import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AdminInitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import CryptoJS from "crypto-js";

const REGION = process.env.VITE_AWS_REGION || "us-east-1";
const CLIENT_ID = process.env.VITE_COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_COGNITO_CLIENT_SECRET;
const USER_POOL_ID = process.env.VITE_COGNITO_USER_POOL_ID;

if (!CLIENT_ID || !USER_POOL_ID || !CLIENT_SECRET) {
  throw new Error("Missing Cognito configuration");
}

const client = new CognitoIdentityProviderClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
  },
});

// Function to calculate SECRET_HASH using HMAC-SHA256
function calculateSecretHash(username: string): string {
  const message = username + CLIENT_ID;
  const hash = CryptoJS.HmacSHA256(message, CLIENT_SECRET);
  return CryptoJS.enc.Base64.stringify(hash);
}

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

export class CognitoService {
  private parseUserFromToken(idToken: string): CognitoUserData {
    try {
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
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
      // Try USER_PASSWORD_AUTH first (most straightforward approach)
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

      return {
        user,
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
      };
    } catch (error: any) {
      console.error("SignIn error:", error);
      
      // Provide helpful error message for USER_PASSWORD_AUTH flow
      if (error.name === "InvalidParameterException" && error.message.includes("USER_PASSWORD_AUTH flow not enabled")) {
        throw {
          code: "ConfigurationRequired",
          message: "Pour utiliser l'authentification par mot de passe, vous devez activer le flow USER_PASSWORD_AUTH dans votre configuration AWS Cognito.\n\nÉtapes:\n1. Ouvrez AWS Console → Amazon Cognito\n2. Sélectionnez votre User Pool\n3. Allez dans App integration → App client\n4. Cliquez sur Edit\n5. Dans Authentication flows, cochez ALLOW_USER_PASSWORD_AUTH\n6. Sauvegardez les changements",
        };
      }
      
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

  async getCurrentUser(accessToken: string): Promise<CognitoUserData | null> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
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

      return {
        username: response.Username || "",
        email: attributes.email || "",
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        emailVerified: attributes.email_verified === "true",
        attributes,
      };
    } catch (error: any) {
      console.error("GetCurrentUser error:", error);
      return null;
    }
  }

  async signOut(accessToken: string): Promise<void> {
    try {
      // For now, just clear the tokens on client side
      // AWS Cognito doesn't have a direct "sign out" command for access tokens
      // The client should clear local storage
    } catch (error: any) {
      console.error("SignOut error:", error);
      throw {
        code: error.name,
        message: error.message,
      };
    }
  }
}

export const cognitoService = new CognitoService();