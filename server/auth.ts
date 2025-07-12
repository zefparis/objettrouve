import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  AdminInitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminGetUserCommand,
  AdminConfirmSignUpCommand,
  AdminRespondToAuthChallengeCommand,
  type SignUpCommandOutput,
  type ConfirmSignUpCommandOutput,
  type InitiateAuthCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { storage } from "./storage";

const CLIENT_ID = process.env.VITE_COGNITO_CLIENT_ID!;
const CLIENT_SECRET = process.env.VITE_COGNITO_CLIENT_SECRET!;
const USER_POOL_ID = process.env.VITE_COGNITO_USER_POOL_ID!;
const AWS_REGION = process.env.VITE_AWS_REGION!;

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function calculateSecretHash(username: string): string {
  const message = username + CLIENT_ID;
  return crypto.createHmac('sha256', CLIENT_SECRET).update(message).digest('base64');
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  attributes: Record<string, string>;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
  requiresPasswordChange?: boolean;
  requiresVerification?: boolean;
  session?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Parse user data from Cognito ID token
function parseUserFromToken(idToken: string): AuthUser {
  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
  
  return {
    id: payload.sub,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    emailVerified: payload.email_verified === true,
    phoneVerified: payload.phone_number_verified === true,
    attributes: payload,
  };
}

// Sign up new user
export async function signUp(data: SignUpData): Promise<{ userSub: string; codeDeliveryDetails: any }> {
  const { email, password, firstName, lastName, phone } = data;
  
  const userAttributes = [
    { Name: "email", Value: email },
  ];
  
  if (firstName) userAttributes.push({ Name: "given_name", Value: firstName });
  if (lastName) userAttributes.push({ Name: "family_name", Value: lastName });
  if (phone) userAttributes.push({ Name: "phone_number", Value: phone });

  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: userAttributes,
    SecretHash: calculateSecretHash(email),
  });

  const response = await cognitoClient.send(command);
  
  if (!response.UserSub) {
    throw new Error("Échec de l'inscription");
  }

  return {
    userSub: response.UserSub,
    codeDeliveryDetails: response.CodeDeliveryDetails,
  };
}

// Confirm sign up with verification code
export async function confirmSignUp(email: string, code: string): Promise<void> {
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    SecretHash: calculateSecretHash(email),
  });

  await cognitoClient.send(command);
}

// Resend confirmation code
export async function resendConfirmationCode(email: string): Promise<any> {
  const command = new ResendConfirmationCodeCommand({
    ClientId: CLIENT_ID,
    Username: email,
    SecretHash: calculateSecretHash(email),
  });

  const response = await cognitoClient.send(command);
  return response.CodeDeliveryDetails;
}

// Sign in user
export async function signIn(email: string, password: string): Promise<AuthResult> {
  // Try regular auth first
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

    const response = await cognitoClient.send(command);
    
    if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return {
        user: { id: "", email, emailVerified: false, attributes: {} },
        tokens: { accessToken: "", idToken: "", refreshToken: "", expiresIn: 0 },
        requiresPasswordChange: true,
        session: response.Session,
      };
    }

    if (!response.AuthenticationResult) {
      throw new Error("Échec de l'authentification");
    }

    const { AccessToken, IdToken, RefreshToken, ExpiresIn } = response.AuthenticationResult;

    if (!AccessToken || !IdToken || !RefreshToken) {
      throw new Error("Tokens manquants");
    }

    const user = parseUserFromToken(IdToken);
    
    // Store user in database
    await storage.upsertUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      user,
      tokens: {
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
        expiresIn: ExpiresIn || 3600,
      },
    };
  } catch (error: any) {
    // Try admin auth as fallback
    if (error.name === 'NotAuthorizedException' && error.message.includes('admin')) {
      try {
        const adminCommand = new AdminInitiateAuthCommand({
          UserPoolId: USER_POOL_ID,
          ClientId: CLIENT_ID,
          AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: calculateSecretHash(email),
          },
        });

        const adminResponse = await cognitoClient.send(adminCommand);
        
        if (adminResponse.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          return {
            user: { id: "", email, emailVerified: false, attributes: {} },
            tokens: { accessToken: "", idToken: "", refreshToken: "", expiresIn: 0 },
            requiresPasswordChange: true,
            session: adminResponse.Session,
          };
        }

        if (!adminResponse.AuthenticationResult) {
          throw new Error("Échec de l'authentification");
        }

        const { AccessToken, IdToken, RefreshToken, ExpiresIn } = adminResponse.AuthenticationResult;

        if (!AccessToken || !IdToken || !RefreshToken) {
          throw new Error("Tokens manquants");
        }

        const user = parseUserFromToken(IdToken);
        
        // Store user in database
        await storage.upsertUser({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        return {
          user,
          tokens: {
            accessToken: AccessToken,
            idToken: IdToken,
            refreshToken: RefreshToken,
            expiresIn: ExpiresIn || 3600,
          },
        };
      } catch (adminError: any) {
        throw adminError;
      }
    }
    
    throw error;
  }
}

// Complete password change for new users
export async function completeNewPassword(
  email: string,
  temporaryPassword: string,
  newPassword: string,
  session?: string
): Promise<AuthResult> {
  if (session) {
    // Use existing session
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

    const response = await cognitoClient.send(command);
    
    if (!response.AuthenticationResult) {
      throw new Error("Échec du changement de mot de passe");
    }

    const { AccessToken, IdToken, RefreshToken, ExpiresIn } = response.AuthenticationResult;

    if (!AccessToken || !IdToken || !RefreshToken) {
      throw new Error("Tokens manquants");
    }

    const user = parseUserFromToken(IdToken);
    
    // Store user in database
    await storage.upsertUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      user,
      tokens: {
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
        expiresIn: ExpiresIn || 3600,
      },
    };
  }
  
  // No session provided, try to get one first
  const result = await signIn(email, temporaryPassword);
  
  if (result.requiresPasswordChange && result.session) {
    return completeNewPassword(email, temporaryPassword, newPassword, result.session);
  }
  
  throw new Error("Session manquante pour le changement de mot de passe");
}

// Forgot password
export async function forgotPassword(email: string): Promise<any> {
  const command = new ForgotPasswordCommand({
    ClientId: CLIENT_ID,
    Username: email,
    SecretHash: calculateSecretHash(email),
  });

  const response = await cognitoClient.send(command);
  return response.CodeDeliveryDetails;
}

// Confirm forgot password
export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: calculateSecretHash(email),
  });

  await cognitoClient.send(command);
}

// Get current user
export async function getCurrentUser(accessToken: string): Promise<AuthUser> {
  const command = new GetUserCommand({
    AccessToken: accessToken,
  });

  const response = await cognitoClient.send(command);
  
  if (!response.UserAttributes) {
    throw new Error("Utilisateur non trouvé");
  }

  const attributes: Record<string, string> = {};
  response.UserAttributes.forEach(attr => {
    if (attr.Name && attr.Value) {
      attributes[attr.Name] = attr.Value;
    }
  });

  return {
    id: attributes.sub,
    email: attributes.email,
    firstName: attributes.given_name,
    lastName: attributes.family_name,
    emailVerified: attributes.email_verified === 'true',
    phoneVerified: attributes.phone_number_verified === 'true',
    attributes,
  };
}

// Sign out user
export async function signOut(accessToken: string): Promise<void> {
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  await cognitoClient.send(command);
}

// Admin create user (for testing)
export async function adminCreateUser(
  email: string,
  temporaryPassword: string,
  attributes: Record<string, string> = {}
): Promise<void> {
  const userAttributes = [
    { Name: "email", Value: email },
    { Name: "email_verified", Value: "true" },
  ];

  Object.entries(attributes).forEach(([key, value]) => {
    userAttributes.push({ Name: key, Value: value });
  });

  const command = new AdminCreateUserCommand({
    UserPoolId: USER_POOL_ID,
    Username: email,
    TemporaryPassword: temporaryPassword,
    UserAttributes: userAttributes,
    MessageAction: "SUPPRESS", // Don't send welcome email
  });

  await cognitoClient.send(command);
}

// Admin set permanent password
export async function adminSetPermanentPassword(
  email: string,
  password: string
): Promise<void> {
  const command = new AdminSetUserPasswordCommand({
    UserPoolId: USER_POOL_ID,
    Username: email,
    Password: password,
    Permanent: true,
  });

  await cognitoClient.send(command);
}