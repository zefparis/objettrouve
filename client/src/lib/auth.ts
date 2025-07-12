// Simple authentication service that uses backend API endpoints

export interface SimpleUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface SimpleAuthResult {
  user: SimpleUser;
  message: string;
}

class SimpleAuthService {
  async signUp(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/auth/signup', {
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du compte');
      }

      const result = await response.json();
      return {
        user: result.user,
        message: result.message,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la création du compte');
    }
  }

  async signIn(email: string, password: string): Promise<SimpleAuthResult> {
    try {
      const response = await fetch('/api/auth/signin', {
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
        throw new Error(error.message || 'Erreur lors de la connexion');
      }

      const result = await response.json();
      return {
        user: result.user,
        message: result.message,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  }

  async signOut(): Promise<void> {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      console.error('Error during signout:', error);
    }
  }

  async getCurrentUser(): Promise<SimpleUser | null> {
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error('Failed to fetch user');
      }
      return response.json();
    } catch (error) {
      return null;
    }
  }
}

export const authService = new SimpleAuthService();