import { useState, useEffect, useCallback } from "react";
import { cognitoService, type CognitoUser } from "@/lib/cognito";

export interface AuthState {
  user: CognitoUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useCognitoAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Check if user is already authenticated
      if (cognitoService.isAuthenticated()) {
        const user = cognitoService.getCurrentUserSync();
        if (user) {
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          return;
        }
      }

      // Try to get current user from Cognito
      const user = await cognitoService.getCurrentUser();
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        error: null,
      });
    } catch (error: any) {
      console.error("Auth check failed:", error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error.message || "Authentication check failed",
      });
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await cognitoService.signOut();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Sign out failed:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Sign out failed",
      }));
    }
  }, []);

  const refreshAuth = useCallback(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    ...state,
    signOut,
    refreshAuth,
  };
}