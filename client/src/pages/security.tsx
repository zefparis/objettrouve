import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Key, Smartphone, Trash2, AlertTriangle, ArrowLeft, User } from "lucide-react";
import Navbar from "@/components/navbar";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "wouter";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirmation required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function Security() {
  const { t } = useTranslation();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const { toast } = useToast();

  const changePasswordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      return await apiRequest("POST", "/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast({
        title: t("profilePage.securityTab.passwordSuccess"),
        description: t("profilePage.securityTab.passwordSuccess"),
      });
      changePasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: t("profilePage.securityTab.passwordError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/auth/delete-account");
    },
    onSuccess: () => {
      toast({
        title: t("profilePage.securityTab.deleteAccount"),
        description: t("profilePage.securityTab.deleteAccountDesc"),
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: t("profilePage.securityTab.passwordError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onChangePassword = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Profile Button */}
        <div className="mb-6">
          <Link href="/profile">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4" />
              <User className="w-4 h-4" />
              <span>{t("profilePage.backToProfile")}</span>
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("profilePage.securityTab.title")}</h1>
          <p className="text-gray-600">
            {t("profilePage.securityTab.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Changer le mot de passe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t("profilePage.securityTab.changePassword")}
              </CardTitle>
              <CardDescription>
                {t("profilePage.securityTab.changePasswordDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={changePasswordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">{t("profilePage.securityTab.currentPassword")}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...changePasswordForm.register("currentPassword")}
                    className="mt-1"
                  />
                  {changePasswordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {changePasswordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">{t("profilePage.securityTab.newPassword")}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...changePasswordForm.register("newPassword")}
                    className="mt-1"
                  />
                  {changePasswordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {changePasswordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{t("profilePage.securityTab.confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...changePasswordForm.register("confirmPassword")}
                    className="mt-1"
                  />
                  {changePasswordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {changePasswordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={changePasswordMutation.isPending}
                  className="w-full"
                >
                  {changePasswordMutation.isPending ? t("profilePage.securityTab.updating") : t("profilePage.securityTab.updatePassword")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Authentification à deux facteurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {t("profilePage.securityTab.twoFactor")}
              </CardTitle>
              <CardDescription>
                {t("profilePage.securityTab.twoFactorDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">
                    {t("profilePage.securityTab.twoFactor")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {twoFactorEnabled ? t("profilePage.securityTab.disable") : t("profilePage.securityTab.enable")}
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications de connexion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("profilePage.securityTab.loginNotifications")}
              </CardTitle>
              <CardDescription>
                {t("profilePage.securityTab.loginNotificationsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">
                    {t("profilePage.securityTab.loginNotifications")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {loginNotifications ? t("profilePage.securityTab.enable") : t("profilePage.securityTab.disable")}
                  </div>
                </div>
                <Switch
                  checked={loginNotifications}
                  onCheckedChange={setLoginNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zone de danger */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                {t("profilePage.securityTab.dangerZone")}
              </CardTitle>
              <CardDescription className="text-red-600">
                {t("profilePage.securityTab.deleteAccountDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("profilePage.securityTab.deleteAccount")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("profilePage.securityTab.deleteAccountConfirm")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("profilePage.securityTab.deleteAccountWarning")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("profilePage.personal.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {t("profilePage.securityTab.deleteAccountButton")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}