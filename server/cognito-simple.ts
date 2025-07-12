import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminGetUserCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  RespondToAuthChallengeCommand,
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

function calculateSecretHash(username: string): string {
  const message = username + CLIENT_ID;
  const hash = CryptoJS.HmacSHA256(message, CLIENT_SECRET);
  return CryptoJS.enc.Base64.stringify(hash);
}

export interface SimpleAuthResult {
  success: boolean;
  user?: {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified: boolean;
  };
  tokens?: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  };
  challengeName?: string;
  session?: string;
  message?: string;
}

export class SimpleCognitoService {
  // Inscription utilisateur (méthode standard)
  async signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<SimpleAuthResult> {
    try {
      const userAttributes = [
        { Name: "email", Value: email },
      ];

      if (firstName) userAttributes.push({ Name: "given_name", Value: firstName });
      if (lastName) userAttributes.push({ Name: "family_name", Value: lastName });

      // Use standard SignUp (no admin permissions required)
      const signUpCommand = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        SecretHash: calculateSecretHash(email),
        UserAttributes: userAttributes,
      });

      const response = await client.send(signUpCommand);

      // Note: User might need to confirm via email/SMS (depends on pool configuration)

      return {
        success: true,
        message: "Utilisateur créé avec succès. Vérifiez votre email pour la confirmation.",
      };
    } catch (error: any) {
      console.error("SignUp error:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la création du compte",
      };
    }
  }

  // Connexion utilisateur (méthode standard)
  async signIn(email: string, password: string): Promise<SimpleAuthResult> {
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
          success: false,
          challengeName: response.ChallengeName,
          session: response.Session,
          message: "Nouveau mot de passe requis",
        };
      }

      if (!response.AuthenticationResult) {
        return {
          success: false,
          message: "Échec de l'authentification",
        };
      }

      const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;

      if (!AccessToken || !IdToken || !RefreshToken) {
        return {
          success: false,
          message: "Réponse d'authentification invalide",
        };
      }

      // Parse user from token
      const user = this.parseUserFromToken(IdToken);

      return {
        success: true,
        user,
        tokens: {
          accessToken: AccessToken,
          idToken: IdToken,
          refreshToken: RefreshToken,
        },
        message: "Connexion réussie",
      };
    } catch (error: any) {
      console.error("SignIn error:", error);
      return {
        success: false,
        message: error.message || "Erreur de connexion",
      };
    }
  }

  // Compléter le nouveau mot de passe
  async completeNewPassword(email: string, session: string, newPassword: string): Promise<SimpleAuthResult> {
    try {
      const command = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: session,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
          SECRET_HASH: calculateSecretHash(email),
        },
      });

      const response = await client.send(command);

      if (!response.AuthenticationResult) {
        return {
          success: false,
          message: "Échec de la mise à jour du mot de passe",
        };
      }

      const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;

      if (!AccessToken || !IdToken || !RefreshToken) {
        return {
          success: false,
          message: "Réponse d'authentification invalide",
        };
      }

      const user = this.parseUserFromToken(IdToken);

      return {
        success: true,
        user,
        tokens: {
          accessToken: AccessToken,
          idToken: IdToken,
          refreshToken: RefreshToken,
        },
        message: "Mot de passe mis à jour avec succès",
      };
    } catch (error: any) {
      console.error("CompleteNewPassword error:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la mise à jour du mot de passe",
      };
    }
  }

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<SimpleAuthResult> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        SecretHash: calculateSecretHash(email),
      });

      await client.send(command);

      return {
        success: true,
        message: "Code de réinitialisation envoyé par email",
      };
    } catch (error: any) {
      console.error("ForgotPassword error:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de l'envoi du code",
      };
    }
  }

  // Confirmer le nouveau mot de passe
  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<SimpleAuthResult> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
        SecretHash: calculateSecretHash(email),
      });

      await client.send(command);

      return {
        success: true,
        message: "Mot de passe réinitialisé avec succès",
      };
    } catch (error: any) {
      console.error("ConfirmForgotPassword error:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la réinitialisation",
      };
    }
  }

  // Obtenir les informations utilisateur
  async getCurrentUser(accessToken: string): Promise<SimpleAuthResult> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: accessToken, // This should be the username, not access token
      });

      const response = await client.send(command);

      if (!response.UserAttributes) {
        return {
          success: false,
          message: "Utilisateur non trouvé",
        };
      }

      const email = response.UserAttributes.find(attr => attr.Name === "email")?.Value || "";
      const firstName = response.UserAttributes.find(attr => attr.Name === "given_name")?.Value;
      const lastName = response.UserAttributes.find(attr => attr.Name === "family_name")?.Value;
      const emailVerified = response.UserAttributes.find(attr => attr.Name === "email_verified")?.Value === "true";

      return {
        success: true,
        user: {
          username: response.Username || email,
          email,
          firstName,
          lastName,
          emailVerified,
        },
      };
    } catch (error: any) {
      console.error("GetCurrentUser error:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la récupération des informations utilisateur",
      };
    }
  }

  private parseUserFromToken(idToken: string): any {
    try {
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      return {
        username: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        emailVerified: payload.email_verified === true,
      };
    } catch (error) {
      console.error("Error parsing user from token:", error);
      throw new Error("Invalid token format");
    }
  }
}

export const simpleCognitoService = new SimpleCognitoService();