import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Authentication guard component
 * Protects routes that require authentication
 * Provides loading states and error handling
 */
export default function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = "/", 
  requireAuth = true 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, error } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      toast({
        title: t("common.unauthorized"),
        description: t("common.loginRequired"),
        variant: "destructive",
      });
      
      // In development, redirect to home
      if (import.meta.env.DEV) {
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);
      } else {
        // In production, redirect to login
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, toast, t, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("common.loading")}</p>
          </div>
        </div>
      )
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // If auth is not required, always show children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If auth is required and user is authenticated, show children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If auth is required but user is not authenticated, show nothing (redirect will happen)
  return null;
}