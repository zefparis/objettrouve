import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cognitoService } from "@/lib/cognito";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
};

type AuthStep = "login" | "register" | "forgot-password" | "otp-verification" | "new-password";

const loginSchema = z.object({
  email: z.string().email("auth.errors.invalidEmail"),
  password: z.string().min(6, "auth.errors.passwordTooShort"),
});

const registerSchema = z.object({
  email: z.string().email("auth.errors.invalidEmail"),
  password: z.string().min(8, "auth.errors.passwordTooShort"),
  confirmPassword: z.string().min(8, "auth.errors.passwordTooShort"),
  firstName: z.string().min(2, "auth.errors.firstNameRequired"),
  lastName: z.string().min(2, "auth.errors.lastNameRequired"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.errors.passwordsDoNotMatch",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("auth.errors.invalidEmail"),
});

const otpSchema = z.object({
  code: z.string().length(6, "auth.errors.otpInvalid"),
});

const newPasswordSchema = z.object({
  password: z.string().min(8, "auth.errors.passwordTooShort"),
  confirmPassword: z.string().min(8, "auth.errors.passwordTooShort"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.errors.passwordsDoNotMatch",
  path: ["confirmPassword"],
});

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState<AuthStep>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", firstName: "", lastName: "" },
  });

  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const newPasswordForm = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const result = await cognitoService.signIn(data.email, data.password);
      
      if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setEmail(data.email);
        setTempPassword(data.password);
        setStep("new-password");
      } else {
        toast({
          title: t("auth.success.loginTitle"),
          description: t("auth.success.loginDescription"),
        });
        onSuccess(result.user);
        onClose();
      }
    } catch (error: any) {
      toast({
        title: t("auth.errors.loginFailed"),
        description: t(error.code ? `auth.errors.${error.code}` : "auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await cognitoService.signUp(data.email, data.password, {
        given_name: data.firstName,
        family_name: data.lastName,
      });
      
      setEmail(data.email);
      setStep("otp-verification");
      toast({
        title: t("auth.success.registerTitle"),
        description: t("auth.success.registerDescription"),
      });
    } catch (error: any) {
      toast({
        title: t("auth.errors.registerFailed"),
        description: t(error.code ? `auth.errors.${error.code}` : "auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    try {
      await cognitoService.forgotPassword(data.email);
      setEmail(data.email);
      setStep("otp-verification");
      toast({
        title: t("auth.success.forgotPasswordTitle"),
        description: t("auth.success.forgotPasswordDescription"),
      });
    } catch (error: any) {
      toast({
        title: t("auth.errors.forgotPasswordFailed"),
        description: t(error.code ? `auth.errors.${error.code}` : "auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      if (step === "otp-verification") {
        if (registerForm.getValues("email")) {
          // Email confirmation for registration
          await cognitoService.confirmSignUp(email, data.code);
          toast({
            title: t("auth.success.otpVerificationTitle"),
            description: t("auth.success.otpVerificationDescription"),
          });
          setStep("login");
        } else {
          // OTP for password reset
          setStep("new-password");
        }
      }
    } catch (error: any) {
      toast({
        title: t("auth.errors.otpVerificationFailed"),
        description: t(error.code ? `auth.errors.${error.code}` : "auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (data: z.infer<typeof newPasswordSchema>) => {
    setIsLoading(true);
    try {
      if (tempPassword) {
        // New password required challenge
        await cognitoService.completeNewPassword(email, tempPassword, data.password);
      } else {
        // Password reset
        await cognitoService.confirmPassword(email, otpForm.getValues("code"), data.password);
      }
      
      toast({
        title: t("auth.success.newPasswordTitle"),
        description: t("auth.success.newPasswordDescription"),
      });
      setStep("login");
    } catch (error: any) {
      toast({
        title: t("auth.errors.newPasswordFailed"),
        description: t(error.code ? `auth.errors.${error.code}` : "auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await cognitoService.resendSignUp(email);
      toast({
        title: t("auth.success.resendOtpTitle"),
        description: t("auth.success.resendOtpDescription"),
      });
    } catch (error: any) {
      toast({
        title: t("auth.errors.resendOtpFailed"),
        description: t(error.code ? `auth.errors.${error.code}` : "auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    loginForm.reset();
    registerForm.reset();
    forgotPasswordForm.reset();
    otpForm.reset();
    newPasswordForm.reset();
    setEmail("");
    setTempPassword("");
    setStep("login");
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case "login":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("auth.login.title")}
              </h2>
              <p className="text-gray-600">
                {t("auth.login.subtitle")}
              </p>
            </div>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.email")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("auth.placeholders.email")}
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.placeholders.password")}
                            className="pl-10 pr-10"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.actions.signingIn") : t("auth.actions.signIn")}
                </Button>
              </form>
            </Form>

            <div className="text-center space-y-2">
              <button
                onClick={() => setStep("forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                {t("auth.actions.forgotPassword")}
              </button>
              <div className="text-sm text-gray-600">
                {t("auth.login.noAccount")}{" "}
                <button
                  onClick={() => setStep("register")}
                  className="text-primary hover:underline"
                >
                  {t("auth.actions.signUp")}
                </button>
              </div>
            </div>
          </div>
        );

      case "register":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("auth.register.title")}
              </h2>
              <p className="text-gray-600">
                {t("auth.register.subtitle")}
              </p>
            </div>

            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.fields.firstName")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("auth.placeholders.firstName")}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.fields.lastName")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("auth.placeholders.lastName")}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.email")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("auth.placeholders.email")}
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.placeholders.password")}
                            className="pl-10 pr-10"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.confirmPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.placeholders.confirmPassword")}
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.actions.signingUp") : t("auth.actions.signUp")}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                {t("auth.register.hasAccount")}{" "}
                <button
                  onClick={() => setStep("login")}
                  className="text-primary hover:underline"
                >
                  {t("auth.actions.signIn")}
                </button>
              </div>
            </div>
          </div>
        );

      case "forgot-password":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("auth.forgotPassword.title")}
              </h2>
              <p className="text-gray-600">
                {t("auth.forgotPassword.subtitle")}
              </p>
            </div>

            <Form {...forgotPasswordForm}>
              <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.email")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("auth.placeholders.email")}
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.actions.sending") : t("auth.actions.sendCode")}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <button
                onClick={() => setStep("login")}
                className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.actions.backToLogin")}
              </button>
            </div>
          </div>
        );

      case "otp-verification":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("auth.otpVerification.title")}
              </h2>
              <p className="text-gray-600">
                {t("auth.otpVerification.subtitle", { email })}
              </p>
            </div>

            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpVerification)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.otpCode")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("auth.placeholders.otpCode")}
                          className="text-center text-lg tracking-widest"
                          maxLength={6}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.actions.verifying") : t("auth.actions.verify")}
                </Button>
              </form>
            </Form>

            <div className="text-center space-y-2">
              <button
                onClick={handleResendOtp}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                {t("auth.actions.resendCode")}
              </button>
              <div>
                <button
                  onClick={() => setStep("login")}
                  className="text-sm text-gray-600 hover:underline flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("auth.actions.backToLogin")}
                </button>
              </div>
            </div>
          </div>
        );

      case "new-password":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("auth.newPassword.title")}
              </h2>
              <p className="text-gray-600">
                {t("auth.newPassword.subtitle")}
              </p>
            </div>

            <Form {...newPasswordForm}>
              <form onSubmit={newPasswordForm.handleSubmit(handleNewPassword)} className="space-y-4">
                <FormField
                  control={newPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.newPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.placeholders.newPassword")}
                            className="pl-10 pr-10"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={newPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fields.confirmPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.placeholders.confirmPassword")}
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.actions.updating") : t("auth.actions.updatePassword")}
                </Button>
              </form>
            </Form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}