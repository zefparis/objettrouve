import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { simpleCognitoService } from "@/lib/cognito-simple";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
};

type AuthStep = "login" | "register" | "forgot-password" | "otp-verification" | "new-password";

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<AuthStep>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  
  // Form data states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    otpCode: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    switch (step) {
      case "login":
        if (!formData.email) newErrors.email = t("auth.errors.emailRequired");
        else if (!validateEmail(formData.email)) newErrors.email = t("auth.errors.invalidEmail");
        if (!formData.password) newErrors.password = t("auth.errors.passwordRequired");
        break;
        
      case "register":
        if (!formData.email) newErrors.email = t("auth.errors.emailRequired");
        else if (!validateEmail(formData.email)) newErrors.email = t("auth.errors.invalidEmail");
        if (!formData.password) newErrors.password = t("auth.errors.passwordRequired");
        else if (formData.password.length < 8) newErrors.password = t("auth.errors.passwordTooShort");
        if (!formData.confirmPassword) newErrors.confirmPassword = t("auth.errors.confirmPasswordRequired");
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t("auth.errors.passwordsDoNotMatch");
        if (!formData.firstName) newErrors.firstName = t("auth.errors.firstNameRequired");
        if (!formData.lastName) newErrors.lastName = t("auth.errors.lastNameRequired");
        break;
        
      case "forgot-password":
        if (!formData.email) newErrors.email = t("auth.errors.emailRequired");
        else if (!validateEmail(formData.email)) newErrors.email = t("auth.errors.invalidEmail");
        break;
        
      case "otp-verification":
        if (!formData.otpCode) newErrors.otpCode = t("auth.errors.otpRequired");
        else if (formData.otpCode.length !== 6) newErrors.otpCode = t("auth.errors.otpInvalid");
        break;
        
      case "new-password":
        if (!formData.password) newErrors.password = t("auth.errors.passwordRequired");
        else if (formData.password.length < 8) newErrors.password = t("auth.errors.passwordTooShort");
        if (!formData.confirmPassword) newErrors.confirmPassword = t("auth.errors.confirmPasswordRequired");
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t("auth.errors.passwordsDoNotMatch");
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // In development mode, use simple endpoint
      if (import.meta.env.DEV) {
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        
        if (response.ok) {
          // Invalidate auth cache to trigger re-fetch
          queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
          
          toast({
            title: t("auth.success.loginTitle"),
            description: t("auth.success.loginDescription"),
          });
          onSuccess({ email: formData.email });
          onClose();
        } else {
          throw new Error("Login failed");
        }
      } else {
        // Production mode - use Cognito
        const result = await simpleCognitoService.signIn(formData.email, formData.password);
        
        if (result.success && result.user) {
          toast({
            title: t("auth.success.loginTitle"),
            description: t("auth.success.loginDescription"),
          });
          onSuccess(result.user);
          onClose();
        } else if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
          setEmail(formData.email);
          setTempPassword(formData.password);
          setStep("new-password");
        } else {
          throw new Error(result.message || "Erreur de connexion");
        }
      }
    } catch (error: any) {
      console.error("SignIn error:", error);
      toast({
        title: t("auth.errors.loginFailed"),
        description: error.message || t("auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await simpleCognitoService.signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      
      if (result.success) {
        toast({
          title: t("auth.success.registerTitle"),
          description: result.message,
        });
        setStep("login");
      } else {
        throw new Error(result.message || "Erreur lors de l'inscription");
      }
    } catch (error: any) {
      console.error("SignUp error:", error);
      toast({
        title: t("auth.errors.registerFailed"),
        description: error.message || t("auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await simpleCognitoService.forgotPassword(formData.email);
      
      if (result.success) {
        setEmail(formData.email);
        setStep("otp-verification");
        toast({
          title: t("auth.success.forgotPasswordTitle"),
          description: result.message,
        });
      } else {
        throw new Error(result.message || "Erreur lors de l'envoi du code");
      }
    } catch (error: any) {
      console.error("ForgotPassword error:", error);
      toast({
        title: t("auth.errors.forgotPasswordFailed"),
        description: error.message || t("auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await cognitoService.confirmSignUp(email, formData.otpCode);
      toast({
        title: t("auth.success.otpVerificationTitle"),
        description: t("auth.success.otpVerificationDescription"),
      });
      setStep("login");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: t("auth.errors.otpVerificationFailed"),
        description: error.message || t("auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (tempPassword) {
        await cognitoService.completeNewPassword(email, tempPassword, formData.password);
      } else {
        await cognitoService.confirmPassword(email, formData.otpCode, formData.password);
      }
      
      toast({
        title: t("auth.success.newPasswordTitle"),
        description: t("auth.success.newPasswordDescription"),
      });
      setStep("login");
    } catch (error: any) {
      console.error("New password error:", error);
      toast({
        title: t("auth.errors.newPasswordFailed"),
        description: error.message || t("auth.errors.general"),
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
      console.error("Resend OTP error:", error);
      toast({
        title: t("auth.errors.resendOtpFailed"),
        description: error.message || t("auth.errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      otpCode: ""
    });
    setErrors({});
    setEmail("");
    setTempPassword("");
    setStep("login");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getDialogTitle = () => {
    switch (step) {
      case "login": return t("auth.login.title");
      case "register": return t("auth.register.title");
      case "forgot-password": return t("auth.forgotPassword.title");
      case "otp-verification": return t("auth.otpVerification.title");
      case "new-password": return t("auth.newPassword.title");
      default: return t("auth.login.title");
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case "login": return t("auth.login.subtitle");
      case "register": return t("auth.register.subtitle");
      case "forgot-password": return t("auth.forgotPassword.subtitle");
      case "otp-verification": return t("auth.otpVerification.subtitle");
      case "new-password": return t("auth.newPassword.subtitle");
      default: return t("auth.login.subtitle");
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("auth.login.title")}
        </h2>
        <p className="text-gray-600">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.fields.email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("auth.placeholders.email")}
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.fields.password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.password")}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.actions.signingIn") : t("auth.actions.signIn")}
        </Button>
      </form>

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

  const renderRegisterForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("auth.register.title")}
        </h2>
        <p className="text-gray-600">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("auth.fields.firstName")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                type="text"
                placeholder={t("auth.placeholders.firstName")}
                className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{t("auth.fields.lastName")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="lastName"
                type="text"
                placeholder={t("auth.placeholders.lastName")}
                className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.fields.email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("auth.placeholders.email")}
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.fields.password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.password")}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("auth.fields.confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.confirmPassword")}
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.actions.signingUp") : t("auth.actions.signUp")}
        </Button>
      </form>

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

  const renderForgotPasswordForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("auth.forgotPassword.title")}
        </h2>
        <p className="text-gray-600">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.fields.email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("auth.placeholders.email")}
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.actions.sending") : t("auth.actions.sendCode")}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setStep("login")}
          className="text-sm text-gray-600 hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("auth.actions.backToLogin")}
        </button>
      </div>
    </div>
  );

  const renderOtpForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("auth.otpVerification.title")}
        </h2>
        <p className="text-gray-600">
          {t("auth.otpVerification.subtitle")}
        </p>
      </div>

      <form onSubmit={handleOtpVerification} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otpCode">{t("auth.fields.otpCode")}</Label>
          <Input
            id="otpCode"
            type="text"
            placeholder={t("auth.placeholders.otpCode")}
            className={`text-center text-lg tracking-widest ${errors.otpCode ? 'border-red-500' : ''}`}
            maxLength={6}
            value={formData.otpCode}
            onChange={(e) => handleInputChange('otpCode', e.target.value)}
            disabled={isLoading}
          />
          {errors.otpCode && <p className="text-sm text-red-500">{errors.otpCode}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.actions.verifying") : t("auth.actions.verify")}
        </Button>
      </form>

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

  const renderNewPasswordForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("auth.newPassword.title")}
        </h2>
        <p className="text-gray-600">
          {t("auth.newPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleNewPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.fields.newPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.newPassword")}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("auth.fields.confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.confirmPassword")}
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.actions.updating") : t("auth.actions.updatePassword")}
        </Button>
      </form>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case "login":
        return renderLoginForm();
      case "register":
        return renderRegisterForm();
      case "forgot-password":
        return renderForgotPasswordForm();
      case "otp-verification":
        return renderOtpForm();
      case "new-password":
        return renderNewPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}