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
import { Settings, Bell, Eye, Globe, Moon, Sun } from "lucide-react";
import Navbar from "@/components/navbar";
import { useTranslation } from "react-i18next";

const preferencesSchema = z.object({
  language: z.string(),
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  profileVisibility: z.enum(["public", "private", "contacts"]),
  autoLocation: z.boolean(),
  newsletter: z.boolean(),
  bio: z.string().max(500, "La biographie ne peut pas dépasser 500 caractères").optional(),
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
      return await apiRequest("/api/preferences", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été sauvegardées avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PreferencesForm) => {
    updatePreferencesMutation.mutate(data);
  };

  const handleLanguageChange = (language: string) => {
    form.setValue("language", language);
    i18n.changeLanguage(language);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    form.setValue("theme", newTheme);
    
    // Appliquer le thème immédiatement
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Préférences</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Personnalisez votre expérience sur la plateforme
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Général */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configurez les paramètres de base de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Langue</Label>
                <Select value={form.watch("language")} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="mt-1">
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
              </div>

              <div>
                <Label htmlFor="theme">Thème</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Clair
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Sombre
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Système
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  placeholder="Décrivez-vous en quelques mots..."
                  className="mt-1"
                  {...form.register("bio")}
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être informé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">Notifications par email</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Recevez des notifications pour les nouveaux messages et activités
                  </p>
                </div>
                <Switch
                  checked={form.watch("emailNotifications")}
                  onCheckedChange={(checked) => form.setValue("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">Notifications SMS</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Recevez des SMS pour les messages urgents
                  </p>
                </div>
                <Switch
                  checked={form.watch("smsNotifications")}
                  onCheckedChange={(checked) => form.setValue("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">Emails marketing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Recevez des conseils et promotions par email
                  </p>
                </div>
                <Switch
                  checked={form.watch("marketingEmails")}
                  onCheckedChange={(checked) => form.setValue("marketingEmails", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">Newsletter</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Recevez notre newsletter mensuelle
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
                Confidentialité
              </CardTitle>
              <CardDescription>
                Contrôlez la visibilité de vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Visibilité du profil</Label>
                <Select 
                  value={form.watch("profileVisibility")} 
                  onValueChange={(value: "public" | "private" | "contacts") => 
                    form.setValue("profileVisibility", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Visible par tous</SelectItem>
                    <SelectItem value="contacts">Contacts uniquement</SelectItem>
                    <SelectItem value="private">Privé - Invisible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">Localisation automatique</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Autoriser la détection automatique de votre position
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
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updatePreferencesMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updatePreferencesMutation.isPending ? "Sauvegarde..." : "Sauvegarder les préférences"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}