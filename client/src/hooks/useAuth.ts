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
    throwOnError: false, // Don't throw on 401 errors
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      // In development mode, just clear everything 
      if (import.meta.env.DEV) {
        // Clear any local storage
        try {
          localStorage.clear();
        } catch (error) {
          console.warn("Error clearing storage:", error);
        }
        
        // Clear server session without waiting
        fetch("/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        }).catch(() => {
          // Ignore errors in development
        });
        
        return;
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
      
      // Don't redirect automatically - let the caller handle it
    },
    onError: (error) => {
      console.error("Sign out failed:", error);
      // Clear cache even on error
      queryClient.clear();
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