import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation, useSearch } from "wouter";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { CATEGORIES } from "@shared/schema";
import { Camera, Upload, MapPin, Calendar, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

const publishSchema = z.object({
  type: z.enum(["lost", "found"]),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  dateOccurred: z.string().min(1, "La date est requise"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal("")),
});

type PublishFormData = z.infer<typeof publishSchema>;

export default function Publish() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get type and edit ID from URL parameters
  const urlParams = new URLSearchParams(search);
  const typeFromUrl = urlParams.get('type') as 'lost' | 'found' | null;
  const editId = urlParams.get('edit');
  const isEditing = !!editId;

  // Fetch existing item for editing
  const { data: existingItem, isLoading: isLoadingItem } = useQuery({
    queryKey: ['/api/items', editId],
    enabled: isEditing,
  });

  const form = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      type: typeFromUrl || "lost",
      title: "",
      description: "",
      category: "",
      location: "",
      dateOccurred: "",
      contactPhone: "",
      contactEmail: "",
    },
  });

  // Populate form with existing item data when editing
  useEffect(() => {
    if (isEditing && existingItem) {
      form.setValue('type', existingItem.type);
      form.setValue('title', existingItem.title);
      form.setValue('description', existingItem.description);
      form.setValue('category', existingItem.category);
      form.setValue('location', existingItem.location);
      form.setValue('dateOccurred', existingItem.dateOccurred.split('T')[0]);
      form.setValue('contactPhone', existingItem.contactPhone || '');
      form.setValue('contactEmail', existingItem.contactEmail || '');
      
      if (existingItem.imageUrl) {
        setPreviewUrl(existingItem.imageUrl);
      }
    }
  }, [isEditing, existingItem, form]);

  // Update form type when URL parameter changes
  useEffect(() => {
    if (typeFromUrl) {
      form.setValue('type', typeFromUrl);
    }
  }, [typeFromUrl, form]);

  const createItemMutation = useMutation({
    mutationFn: async (data: PublishFormData) => {
      const formData = new FormData();
      
      // Append all form fields explicitly
      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("location", data.location);
      formData.append("dateOccurred", data.dateOccurred);
      
      // Append optional fields only if they have values
      if (data.contactPhone) formData.append("contactPhone", data.contactPhone);
      if (data.contactEmail) formData.append("contactEmail", data.contactEmail);
      
      // Append image if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      
      // Use PUT for editing, POST for creating
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/items/${editId}` : "/api/items";
      
      return await apiRequest(method, url, formData);
    },
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: isEditing ? t("itemManagement.editSuccess") : t("publishNew.success"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/items", editId] });
      
      if (isEditing) {
        setLocation(`/item/${editId}`);
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Publication error:", error);
      let errorMessage = t("publishNew.error");
      
      // Try to extract more specific error message
      if (error.message && error.message.includes("Données invalides")) {
        errorMessage = "Veuillez vérifier que tous les champs obligatoires sont remplis correctement.";
      } else if (error.message && error.message.includes("Non authentifié")) {
        errorMessage = "Vous devez être connecté pour publier une annonce.";
      }
      
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: PublishFormData) => {
    // In development mode, allow without authentication
    const isDevelopment = import.meta.env.DEV;
    if (!isDevelopment && !isAuthenticated) {
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
    
    console.log("Form data being submitted:", data);
    createItemMutation.mutate(data);
  };

  const currentType = form.watch("type");
  const isLostType = currentType === "lost";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Authentication notice for non-authenticated users */}
        {!isAuthenticated && !isLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  {t("publishNew.loginNotice")}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className={`p-4 rounded-lg border-l-4 mb-6 ${
            isLostType 
              ? 'bg-red-50 border-red-500' 
              : 'bg-green-50 border-green-500'
          }`}>
            <h1 className={`text-3xl font-bold mb-4 ${
              isLostType ? 'text-red-900' : 'text-green-900'
            }`}>
              {isEditing 
                ? t("itemManagement.editTitle") 
                : (isLostType ? t("publishNew.lostTitle") : t("publishNew.foundTitle"))
              }
            </h1>
            <p className={`${
              isLostType ? 'text-red-700' : 'text-green-700'
            }`}>
              {isEditing 
                ? "Modifiez les détails de votre annonce ci-dessous" 
                : (isLostType ? t("publishNew.lostSubtitle") : t("publishNew.foundSubtitle"))
              }
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className={`${
            isLostType 
              ? 'bg-red-50 border-b border-red-200' 
              : 'bg-green-50 border-b border-green-200'
          }`}>
            <CardTitle className={`flex items-center ${
              isLostType ? 'text-red-900' : 'text-green-900'
            }`}>
              <span className={`w-3 h-3 rounded-full mr-3 ${
                isLostType ? 'bg-red-500' : 'bg-green-500'
              }`}></span>
              {isLostType ? t("publishNew.lostTitle") : t("publishNew.foundTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Type Selection */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("publishNew.type.label")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="lost" id="lost" />
                            <Label htmlFor="lost" className="flex items-center">
                              <span className="text-red-600 mr-2">●</span>
                              {t("publishNew.type.lost")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="found" id="found" />
                            <Label htmlFor="found" className="flex items-center">
                              <span className="text-green-600 mr-2">●</span>
                              {t("publishNew.type.found")}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("publishNew.title.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("publishNew.title.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("publishNew.category.label")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("publishNew.category.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <i className={`${category.icon} mr-2`} />
                                {t(`categories.${category.id}`)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("publishNew.description.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("publishNew.description.placeholder")}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("publishNew.location.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder={t("publishNew.location.placeholder")}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control}
                  name="dateOccurred"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("publishNew.date.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="date"
                            className="pl-10"
                            placeholder={t("publishNew.date.placeholder")}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("publishNew.contact.phone")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("publishNew.contact.phonePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("publishNew.contact.email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("publishNew.contact.emailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>{t("publishNew.image.label")}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto max-h-64 rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          {t("publishNew.image.remove")}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-primary hover:underline">
                              {t("publishNew.image.upload")}
                            </span>
                          </Label>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full ${
                    isLostType 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Modification en cours..." : t("publishNew.submit.publishing")}
                    </>
                  ) : (
                    <>
                      {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                      {isEditing ? t("itemManagement.editAd") : t("publishNew.submit.publish")}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
