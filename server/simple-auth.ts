import bcrypt from 'bcrypt';
import { storage } from './storage';
import type { User } from '@shared/schema';

export interface SimpleAuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResult {
  user: SimpleAuthUser;
  success: boolean;
  message?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await storage.getAuthUserByEmail(email);
    if (existingUser) {
      return {
        user: null as any,
        success: false,
        message: "Un compte avec cet email existe déjà"
      };
    }

    // Create new user
    const passwordHash = await hashPassword(password);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser = await storage.upsertAuthUser({
      id: userId,
      email,
      firstName,
      lastName,
      passwordHash,
      emailVerified: true, // No OTP needed
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      success: true,
      message: "Compte créé avec succès"
    };
  } catch (error) {
    console.error('SignUp error:', error);
    return {
      user: null as any,
      success: false,
      message: "Erreur lors de la création du compte"
    };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await storage.getAuthUserByEmail(email);
    if (!user || !user.passwordHash) {
      return {
        user: null as any,
        success: false,
        message: "Email ou mot de passe incorrect"
      };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        user: null as any,
        success: false,
        message: "Email ou mot de passe incorrect"
      };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      success: true,
      message: "Connexion réussie"
    };
  } catch (error) {
    console.error('SignIn error:', error);
    return {
      user: null as any,
      success: false,
      message: "Erreur lors de la connexion"
    };
  }
}