import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const signUpSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const confirmSchema = z.object({
  email: z.string().email("Email invalide"),
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
  newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormMode = 'signin' | 'signup' | 'confirm' | 'forgot' | 'reset' | 'newPassword';

interface AuthFormProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<FormMode>('signin');
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async (data: z.infer<typeof signUpSchema>) => {
      const response = await apiRequest('POST', '/api/auth/signup', data);
      return response.json();
    },
    onSuccess: (data) => {
      setEmail(signUpForm.getValues('email'));
      setMode('confirm');
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour le code de confirmation",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async (data: z.infer<typeof signInSchema>) => {
      const response = await apiRequest('POST', '/api/auth/signin', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresPasswordChange) {
        setEmail(signInForm.getValues('email'));
        setSession(data.session);
        setMode('newPassword');
        toast({
          title: "Changement de mot de passe requis",
          description: "Vous devez définir un nouveau mot de passe",
        });
      } else {
        onSuccess();
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Confirm signup mutation
  const confirmMutation = useMutation({
    mutationFn: async (data: z.infer<typeof confirmSchema>) => {
      const response = await apiRequest('POST', '/api/auth/confirm-signup', data);
      return response.json();
    },
    onSuccess: () => {
      setMode('signin');
      toast({
        title: "Compte confirmé",
        description: "Vous pouvez maintenant vous connecter",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de confirmation",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Resend code mutation
  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/resend-code', { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Code renvoyé",
        description: "Un nouveau code a été envoyé à votre email",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Forgot password mutation
  const forgotMutation = useMutation({
    mutationFn: async (data: z.infer<typeof forgotPasswordSchema>) => {
      const response = await apiRequest('POST', '/api/auth/forgot-password', data);
      return response.json();
    },
    onSuccess: (data) => {
      setEmail(forgotForm.getValues('email'));
      setMode('reset');
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre email pour le code de réinitialisation",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetMutation = useMutation({
    mutationFn: async (data: z.infer<typeof resetPasswordSchema>) => {
      const response = await apiRequest('POST', '/api/auth/confirm-forgot-password', data);
      return response.json();
    },
    onSuccess: () => {
      setMode('signin');
      toast({
        title: "Mot de passe réinitialisé",
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Complete new password mutation
  const newPasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string }) => {
      const response = await apiRequest('POST', '/api/auth/complete-new-password', {
        email,
        newPassword: data.newPassword,
        session,
      });
      return response.json();
    },
    onSuccess: () => {
      onSuccess();
      toast({
        title: "Mot de passe mis à jour",
        description: "Connexion réussie !",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  // Forms
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const confirmForm = useForm<z.infer<typeof confirmSchema>>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      email: email,
      code: '',
    },
  });

  const forgotForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordForm = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(z.object({
      newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
      confirmPassword: z.string(),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    })),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update confirm form email when email changes
  useEffect(() => {
    confirmForm.setValue('email', email);
    resetForm.setValue('email', email);
  }, [email, confirmForm, resetForm]);

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>Créez votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signUpForm.handleSubmit(signUpMutation.mutate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...signUpForm.register('email')}
                    placeholder="votre@email.com"
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    {...signUpForm.register('firstName')}
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    {...signUpForm.register('lastName')}
                    placeholder="Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    {...signUpForm.register('phone')}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...signUpForm.register('password')}
                      placeholder="Minimum 8 caractères"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...signUpForm.register('confirmPassword')}
                      placeholder="Répétez votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('signin')}
                  >
                    Déjà un compte ? Se connecter
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );

      case 'signin':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>Connectez-vous à votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signInForm.handleSubmit(signInMutation.mutate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...signInForm.register('email')}
                    placeholder="votre@email.com"
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...signInForm.register('password')}
                      placeholder="Votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('forgot')}
                  >
                    Mot de passe oublié ?
                  </Button>
                  <br />
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('signup')}
                  >
                    Pas encore de compte ? S'inscrire
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );

      case 'confirm':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirmation</CardTitle>
              <CardDescription>Entrez le code reçu par email</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertDescription>
                  Un code de confirmation a été envoyé à <strong>{email}</strong>
                </AlertDescription>
              </Alert>

              <form onSubmit={confirmForm.handleSubmit(confirmMutation.mutate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code de confirmation</Label>
                  <Input
                    id="code"
                    {...confirmForm.register('code')}
                    placeholder="123456"
                    maxLength={6}
                  />
                  {confirmForm.formState.errors.code && (
                    <p className="text-sm text-red-500">{confirmForm.formState.errors.code.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={confirmMutation.isPending}
                >
                  {confirmMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmation en cours...
                    </>
                  ) : (
                    "Confirmer"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => resendMutation.mutate()}
                    disabled={resendMutation.isPending}
                  >
                    {resendMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Renvoyer le code"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );

      case 'forgot':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Mot de passe oublié</CardTitle>
              <CardDescription>Entrez votre email pour réinitialiser votre mot de passe</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={forgotForm.handleSubmit(forgotMutation.mutate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...forgotForm.register('email')}
                    placeholder="votre@email.com"
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{forgotForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotMutation.isPending}
                >
                  {forgotMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le code"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('signin')}
                  >
                    Retour à la connexion
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );

      case 'reset':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nouveau mot de passe</CardTitle>
              <CardDescription>Entrez le code reçu et votre nouveau mot de passe</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertDescription>
                  Un code de réinitialisation a été envoyé à <strong>{email}</strong>
                </AlertDescription>
              </Alert>

              <form onSubmit={resetForm.handleSubmit(resetMutation.mutate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code de réinitialisation</Label>
                  <Input
                    id="code"
                    {...resetForm.register('code')}
                    placeholder="123456"
                    maxLength={6}
                  />
                  {resetForm.formState.errors.code && (
                    <p className="text-sm text-red-500">{resetForm.formState.errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      {...resetForm.register('newPassword')}
                      placeholder="Minimum 8 caractères"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{resetForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...resetForm.register('confirmPassword')}
                      placeholder="Répétez votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetMutation.isPending}
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Réinitialisation en cours...
                    </>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 'newPassword':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nouveau mot de passe</CardTitle>
              <CardDescription>Définissez votre nouveau mot de passe</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertDescription>
                  Vous devez définir un nouveau mot de passe pour continuer
                </AlertDescription>
              </Alert>

              <form onSubmit={newPasswordForm.handleSubmit(newPasswordMutation.mutate)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      {...newPasswordForm.register('newPassword')}
                      placeholder="Minimum 8 caractères"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {newPasswordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{newPasswordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...newPasswordForm.register('confirmPassword')}
                      placeholder="Répétez votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {newPasswordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{newPasswordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={newPasswordMutation.isPending}
                >
                  {newPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour en cours...
                    </>
                  ) : (
                    "Mettre à jour le mot de passe"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {renderForm()}
    </div>
  );
}