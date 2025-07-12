import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth(): AuthState & {
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
} {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
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
    },
    retry: false,
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/signout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/user'], null);
      queryClient.removeQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const signOut = async () => {
    await signOutMutation.mutateAsync();
  };

  const refetchUser = async () => {
    await refetch();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error: error?.message || null,
    signOut,
    refetch: refetchUser,
  };
}