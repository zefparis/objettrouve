import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Bell, Eye, Globe, Moon, Sun, ArrowLeft, User } from "lucide-react";
import Navbar from "@/components/navbar";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

const preferencesSchema = z.object({
  language: z.string(),
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  profileVisibility: z.enum(["public", "private", "contacts"]),
  autoLocation: z.boolean(),
  newsletter: z.boolean(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function Preferences() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const { toast } = useToast();

  const form = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      language: i18n.language,
      theme: "system",
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      profileVisibility: "public",
      autoLocation: true,
      newsletter: false,
      bio: "",
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesForm) => {
      return await apiRequest("PUT", "/api/preferences", data);
    },
    onSuccess: () => {
      toast({
        title: t("profilePage.preferences.success"),
        description: t("profilePage.preferences.success"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("profilePage.preferences.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PreferencesForm) => {
    updatePreferencesMutation.mutate(data);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    form.setValue("language", language);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    form.setValue("theme", newTheme);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("profilePage.preferences.title")}</h1>
          <p className="text-gray-600">
            {t("profilePage.preferences.subtitle")}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Langue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t("profilePage.preferences.language")}
              </CardTitle>
              <CardDescription>
                {t("profilePage.preferences.languageDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={form.watch("language")} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="pt">🇵🇹 Português</SelectItem>
                  <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                  <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                  <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                  <SelectItem value="zh">🇨🇳 中文</SelectItem>
                  <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                  <SelectItem value="ko">🇰🇷 한국어</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Thème */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                {t("profilePage.preferences.theme")}
              </CardTitle>
              <CardDescription>
                {t("profilePage.preferences.themeDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {t("profilePage.preferences.themeLight")}
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      {t("profilePage.preferences.themeDark")}
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t("profilePage.preferences.themeSystem")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("profilePage.preferences.notifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profilePage.preferences.emailNotifications")}</Label>
                  <p className="text-sm text-gray-500">
                    {t("profilePage.preferences.emailNotificationsDesc")}
                  </p>
                </div>
                <Switch
                  checked={form.watch("emailNotifications")}
                  onCheckedChange={(checked) => form.setValue("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profilePage.preferences.smsNotifications")}</Label>
                  <p className="text-sm text-gray-500">
                    {t("profilePage.preferences.smsNotificationsDesc")}
                  </p>
                </div>
                <Switch
                  checked={form.watch("smsNotifications")}
                  onCheckedChange={(checked) => form.setValue("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profilePage.preferences.marketingEmails")}</Label>
                  <p className="text-sm text-gray-500">
                    {t("profilePage.preferences.marketingEmailsDesc")}
                  </p>
                </div>
                <Switch
                  checked={form.watch("marketingEmails")}
                  onCheckedChange={(checked) => form.setValue("marketingEmails", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profilePage.preferences.newsletter")}</Label>
                  <p className="text-sm text-gray-500">
                    {t("profilePage.preferences.newsletterDesc")}
                  </p>
                </div>
                <Switch
                  checked={form.watch("newsletter")}
                  onCheckedChange={(checked) => form.setValue("newsletter", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t("profilePage.preferences.privacy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("profilePage.preferences.profileVisibility")}</Label>
                <p className="text-sm text-gray-500">
                  {t("profilePage.preferences.profileVisibilityDesc")}
                </p>
                <Select
                  value={form.watch("profileVisibility")}
                  onValueChange={(value) => form.setValue("profileVisibility", value as "public" | "private" | "contacts")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">{t("profilePage.preferences.visibilityPublic")}</SelectItem>
                    <SelectItem value="private">{t("profilePage.preferences.visibilityPrivate")}</SelectItem>
                    <SelectItem value="contacts">{t("profilePage.preferences.visibilityContacts")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profilePage.preferences.autoLocation")}</Label>
                  <p className="text-sm text-gray-500">
                    {t("profilePage.preferences.autoLocationDesc")}
                  </p>
                </div>
                <Switch
                  checked={form.watch("autoLocation")}
                  onCheckedChange={(checked) => form.setValue("autoLocation", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                type="submit" 
                className="w-full"
                disabled={updatePreferencesMutation.isPending}
              >
                {updatePreferencesMutation.isPending ? t("profilePage.preferences.saving") : t("profilePage.preferences.save")}
              </Button>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}