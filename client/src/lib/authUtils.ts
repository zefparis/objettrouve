/**
 * Authentication utility functions
 * Centralized auth-related helpers
 */

export function isUnauthorizedError(error: Error | unknown): boolean {
  if (error instanceof Error) {
    return /^401: .*Unauthorized/.test(error.message);
  }
  return false;
}

export function handleUnauthorizedError(error: Error | unknown, toast: any, t: any) {
  if (isUnauthorizedError(error)) {
    toast({
      title: t("common.unauthorized"),
      description: t("common.loginRequired"),
      variant: "destructive",
    });
    
    setTimeout(() => {
      if (import.meta.env.DEV) {
        window.location.href = "/";
      } else {
        window.location.href = "/api/login";
      }
    }, 500);
    
    return true;
  }
  return false;
}

export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

export function getRedirectUrl(): string {
  return isDevMode() ? "/" : "/api/login";
}