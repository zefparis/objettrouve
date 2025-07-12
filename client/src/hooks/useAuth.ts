import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cognitoService } from "@/lib/cognito";
import { useCallback } from "react";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * Unified authentication hook
 * Works in both development and production modes
 * Uses server-side user data as source of truth
 */
export function useAuth(): AuthState & {
  signOut: () => Promise<void>;
  refreshAuth: () => void;
} {
  const queryClient = useQueryClient();

  // Fetch user data from server
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      // In development mode, just clear local storage and server session
      if (import.meta.env.DEV) {
        // Clear any local storage
        try {
          localStorage.removeItem('cognito_access_token');
          localStorage.removeItem('cognito_id_token');
          localStorage.removeItem('cognito_refresh_token');
          localStorage.removeItem('cognito_user');
        } catch (error) {
          console.warn("Error clearing storage:", error);
        }
        
        // Clear server session
        try {
          await apiRequest("POST", "/api/auth/signout", {});
        } catch (error) {
          console.warn("Server signout failed:", error);
        }
      } else {
        // In production, use Cognito signout
        if (typeof window !== 'undefined' && cognitoService.isAuthenticated()) {
          try {
            await cognitoService.signOut();
          } catch (error) {
            console.warn("Cognito signout failed:", error);
          }
        }
        
        try {
          await apiRequest("POST", "/api/auth/signout", {});
        } catch (error) {
          console.warn("Server signout failed:", error);
        }
      }
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Always redirect to home after signout
      window.location.href = '/';
    },
    onError: (error) => {
      console.error("Sign out failed:", error);
    },
  });

  const signOut = useCallback(async () => {
    await signOutMutation.mutateAsync();
  }, [signOutMutation]);

  const refreshAuth = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
  }, [queryClient]);

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error: error?.message || null,
    signOut,
    refreshAuth,
  };
}