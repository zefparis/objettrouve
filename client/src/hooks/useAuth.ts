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
      // Sign out from Cognito if available
      if (typeof window !== 'undefined' && cognitoService.isAuthenticated()) {
        await cognitoService.signOut();
      }
      
      // Also sign out from server session if any
      try {
        await apiRequest("POST", "/api/auth/signout", {});
      } catch (error) {
        // Ignore server signout errors in development
        console.warn("Server signout failed:", error);
      }
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // In development, redirect to home
      if (import.meta.env.DEV) {
        window.location.href = '/';
      }
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