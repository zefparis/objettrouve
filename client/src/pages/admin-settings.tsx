import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Settings, Shield, Mail, Globe, Database } from "lucide-react";
import { Link } from "wouter";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState({
    siteName: "Objets Perdus",
    siteDescription: "Plateforme communautaire pour retrouver les objets perdus",
    adminEmail: "admin@example.com",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    maxFileSize: 5,
    autoDeleteDays: 90,
    moderationEnabled: true,
    contactEmail: "contact@example.com",
    supportPhone: "",
    privacyPolicy: "",
    termsOfService: "",
    backupEnabled: true,
    backupFrequency: "daily",
  });

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
    onSuccess: (data) => {
      setSettings(data);
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Succès",
        description: "Paramètres mis à jour avec succès",
      });
    },
  });

  const handleSave = () => {
    updateSettings.mutate(settings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres système</h1>
                <p className="text-gray-600">Configuration générale de la plateforme</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={updateSettings.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateSettings.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="Nom de votre site"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  placeholder="Description de votre site"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                  <p className="text-sm text-gray-500">Désactiver temporairement le site</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="userRegistration">Inscriptions utilisateur</Label>
                  <p className="text-sm text-gray-500">Autoriser les nouvelles inscriptions</p>
                </div>
                <Switch
                  id="userRegistration"
                  checked={settings.userRegistration}
                  onCheckedChange={(checked) => handleInputChange("userRegistration", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Sécurité et modération
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminEmail">Email administrateur</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <Label htmlFor="maxFileSize">Taille max des fichiers (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange("maxFileSize", parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <Label htmlFor="autoDeleteDays">Suppression automatique (jours)</Label>
                <Input
                  id="autoDeleteDays"
                  type="number"
                  value={settings.autoDeleteDays}
                  onChange={(e) => handleInputChange("autoDeleteDays", parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="moderationEnabled">Modération activée</Label>
                  <p className="text-sm text-gray-500">Vérifier les contenus avant publication</p>
                </div>
                <Switch
                  id="moderationEnabled"
                  checked={settings.moderationEnabled}
                  onCheckedChange={(checked) => handleInputChange("moderationEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Communication Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="supportPhone">Téléphone support</Label>
                <Input
                  id="supportPhone"
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Notifications email</Label>
                  <p className="text-sm text-gray-500">Envoyer des notifications aux utilisateurs</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Sauvegarde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backupEnabled">Sauvegarde automatique</Label>
                  <p className="text-sm text-gray-500">Activer les sauvegardes régulières</p>
                </div>
                <Switch
                  id="backupEnabled"
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => handleInputChange("backupEnabled", checked)}
                />
              </div>
              <div>
                <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                <select
                  id="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Créer une sauvegarde maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Documents */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Documents légaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="privacyPolicy">Politique de confidentialité</Label>
              <Textarea
                id="privacyPolicy"
                value={settings.privacyPolicy}
                onChange={(e) => handleInputChange("privacyPolicy", e.target.value)}
                placeholder="Politique de confidentialité..."
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="termsOfService">Conditions d'utilisation</Label>
              <Textarea
                id="termsOfService"
                value={settings.termsOfService}
                onChange={(e) => handleInputChange("termsOfService", e.target.value)}
                placeholder="Conditions d'utilisation..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}