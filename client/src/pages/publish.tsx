import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
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
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { CATEGORIES } from "@shared/schema";
import { Camera, Upload, MapPin, Calendar } from "lucide-react";

const publishSchema = z.object({
  type: z.enum(["lost", "found"]),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  dateOccurred: z.string().min(1, "La date est requise"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional(),
});

type PublishFormData = z.infer<typeof publishSchema>;

export default function Publish() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      type: "lost",
      title: "",
      description: "",
      category: "",
      location: "",
      dateOccurred: "",
      contactPhone: "",
      contactEmail: "",
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: PublishFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      
      return await apiRequest("POST", "/api/items", formData);
    },
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("publish.success"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setLocation("/dashboard");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Non autorisé",
          description: "Vous devez être connecté. Redirection...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
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
    createItemMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("publish.title")}
          </h1>
          <p className="text-gray-600">
            {t("publish.subtitle")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations sur l'objet</CardTitle>
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
                      <FormLabel>Type d'annonce</FormLabel>
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
                              J'ai perdu cet objet
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="found" id="found" />
                            <Label htmlFor="found" className="flex items-center">
                              <span className="text-green-600 mr-2">●</span>
                              J'ai trouvé cet objet
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
                      <FormLabel>Titre de l'annonce</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: iPhone 14 Pro bleu"
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
                      <FormLabel>Catégorie</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <i className={`${category.icon} mr-2`} />
                                {category.name}
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
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez l'objet en détail (couleur, marque, particularités...)"
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
                      <FormLabel>Lieu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="ex: Métro République, Paris 11e"
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
                      <FormLabel>
                        Date de {form.watch("type") === "lost" ? "perte" : "découverte"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="date"
                            className="pl-10"
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
                        <FormLabel>Téléphone (optionnel)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="06 00 00 00 00"
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
                        <FormLabel>Email (optionnel)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="votre@email.com"
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
                  <Label>Photo de l'objet</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Aperçu"
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
                          Supprimer la photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-primary hover:underline">
                              Cliquez pour ajouter une photo
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
                        <p className="text-sm text-gray-500">
                          JPG, PNG, GIF jusqu'à 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Publier l'annonce
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
