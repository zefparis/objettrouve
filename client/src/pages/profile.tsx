import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Camera, 
  Edit, 
  Save, 
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Bell,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  Upload,
  Trash2
} from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(data).forEach(key => {
        if (key !== 'profileImage' && data[key]) {
          formDataToSend.append(key, data[key]);
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
      
      return await apiRequest("PUT", "/api/profile", formDataToSend);
    },
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("profilePage.personal.success"),
      });
      setIsEditing(false);
      setProfileImage(null);
      setProfileImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("profilePage.personal.error"),
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: t("common.error"),
          description: t("common.imageTooLarge"),
          variant: "destructive",
        });
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    setProfileImagePreview(null);
    // Reset form data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || ""
      });
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("common.accessRestricted")}</h1>
          <p className="text-gray-600 mb-6">{t("common.loginRequired")}</p>
          <Link href="/">
            <Button>{t("nav.home")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getUserInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
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
        <Card className="bg-white shadow-lg border-0 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={profileImagePreview || user?.profileImageUrl || ""} 
                    alt={t("profilePage.personal.photo")}
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full w-10 h-10 p-0 bg-white border-2 border-gray-300 hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email?.split('@')[0]
                      }
                    </h1>
                    <p className="text-gray-600 mb-2">{user?.email}</p>
                    {user?.location && (
                      <div className="flex items-center gap-1 text-gray-500 justify-center md:justify-start">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        {t("profilePage.personal.edit")}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSubmit}
                          disabled={updateProfileMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {t("profilePage.personal.save")}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleCancel}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          {t("profilePage.personal.cancel")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-2 text-sm text-gray-500 justify-center md:justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>{t("common.memberSince")} {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("profilePage.tabs.personal")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("profilePage.tabs.security")}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("profilePage.tabs.preferences")}
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("profilePage.personal.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("profilePage.personal.firstName")}</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder={t("profilePage.personal.firstName")}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user?.firstName || "-"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("profilePage.personal.lastName")}</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder={t("profilePage.personal.lastName")}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user?.lastName || "-"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("profilePage.personal.email")}</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("profilePage.personal.phone")}</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={t("profilePage.personal.phone")}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900">{user?.phone || "-"}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">{t("profilePage.personal.location")}</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder={t("profilePage.personal.location")}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900">{user?.location || "-"}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">{t("profilePage.personal.bio")}</Label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder={t("profilePage.personal.bioPlaceholder")}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user?.bio || "-"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("profilePage.securityTab.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{t("profilePage.securityTab.changePassword")}</h3>
                      <p className="text-sm text-gray-600">{t("profilePage.securityTab.changePasswordDesc")}</p>
                    </div>
                    <Link href="/security">
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        {t("profilePage.securityTab.enable")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t("profilePage.preferences.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{t("profilePage.preferences.language")}</h3>
                      <p className="text-sm text-gray-600">{t("profilePage.preferences.languageDesc")}</p>
                    </div>
                    <Link href="/preferences">
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        {t("profilePage.preferences.save")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}