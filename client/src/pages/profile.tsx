import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  Shield,
  Bell,
  Globe,
  Eye,
  Lock,
  ArrowLeft,
  Home
} from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { t } = useTranslation();
  // Use the standard API endpoint for user data
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });
  
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImage: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // In development, allow access to profile without authentication
  const isDevelopment = import.meta.env.DEV;

  // Redirect to login if not authenticated (except in development)
  useEffect(() => {
    if (!isDevelopment && !isLoading && !isAuthenticated) {
      toast({
        title: t("common.unauthorized"),
        description: t("common.loginRequired"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, t, isDevelopment]);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        profileImage: user.profileImageUrl || ""
      });
    }
  }, [user]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t("profile.imageError"),
          description: t("profile.imageTypeError"),
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("profile.imageError"),
          description: t("profile.imageSizeError"),
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: t("profile.updateSuccess"),
        description: t("profile.updateSuccessDesc"),
      });
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Update profile data with the returned data to preserve photo
      setProfileData(prev => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        profileImage: data.profileImageUrl || prev.profileImage
      }));
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: t("profile.updateError"),
        description: t("profile.updateErrorDesc"),
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    formData.append("location", profileData.location);
    formData.append("bio", profileData.bio);
    
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    
    updateProfileMutation.mutate(formData);
  };

  // Show loading state while checking authentication (except in development)
  if (!isDevelopment && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Don't render profile if not authenticated (except in development)
  if (!isDevelopment && !isAuthenticated) {
    return null;
  }

  // Mock data for development
  const mockUser = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    bio: "Passionné de technologie et d'innovation",
    profileImageUrl: "",
    createdAt: "2024-01-15T10:00:00Z",
    itemsCount: 12,
    foundItemsCount: 5,
    conversationsCount: 8
  };

  const displayUser = user || (isDevelopment ? mockUser : null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour à l'accueil */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4" />
                <Home className="w-4 h-4" />
                <span>{t("nav.home")}</span>
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <CardContent className="relative pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src={previewUrl || profileData.profileImage || displayUser?.profileImageUrl} 
                      alt={t("profile.profilePicture")}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {displayUser?.firstName?.[0]}{displayUser?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <Label htmlFor="profileImage" className="cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                          <Camera className="w-5 h-5" />
                        </div>
                      </Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="mt-4 md:mt-0 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {displayUser?.firstName} {displayUser?.lastName}
                      </h1>
                      <p className="text-gray-600 mt-1">{displayUser?.email}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {t("profile.memberSince")} {new Date(displayUser?.createdAt || "2024-01-01").toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          {t("profile.editProfile")}
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleSubmit}
                            disabled={updateProfileMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {t("profile.save")}
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsEditing(false);
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            variant="outline"
                          >
                            <X className="w-4 h-4 mr-2" />
                            {t("profile.cancel")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{displayUser?.itemsCount || 0}</div>
                  <div className="text-sm text-gray-600">{t("profile.itemsPosted")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{displayUser?.foundItemsCount || 0}</div>
                  <div className="text-sm text-gray-600">{t("profile.itemsFound")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{displayUser?.conversationsCount || 0}</div>
                  <div className="text-sm text-gray-600">{t("profile.conversations")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">{t("profile.personalInfo")}</TabsTrigger>
              <TabsTrigger value="preferences">{t("profile.preferences")}</TabsTrigger>
              <TabsTrigger value="privacy">{t("profile.privacy")}</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {t("profile.personalInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">{t("profile.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("profile.phone")}</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">{t("profile.location")}</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">{t("profile.bio")}</Label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        placeholder={t("profile.bioPlaceholder")}
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    {t("profile.preferences")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{t("profile.notifications")}</p>
                        <p className="text-sm text-gray-500">{t("profile.notificationsDesc")}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{t("profile.enabled")}</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{t("profile.language")}</p>
                        <p className="text-sm text-gray-500">{t("profile.languageDesc")}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{t("profile.currentLanguage")}</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{t("profile.visibility")}</p>
                        <p className="text-sm text-gray-500">{t("profile.visibilityDesc")}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{t("profile.public")}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy & Security */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {t("profile.privacy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{t("profile.changePassword")}</p>
                        <p className="text-sm text-gray-500">{t("profile.changePasswordDesc")}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t("profile.change")}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{t("profile.twoFactor")}</p>
                        <p className="text-sm text-gray-500">{t("profile.twoFactorDesc")}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t("profile.enable")}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{t("profile.dataExport")}</p>
                        <p className="text-sm text-gray-500">{t("profile.dataExportDesc")}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t("profile.export")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}