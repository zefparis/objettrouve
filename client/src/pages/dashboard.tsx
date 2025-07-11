import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { MapPin, Calendar, Edit, Trash2, MessageSquare, Plus } from "lucide-react";
import { CATEGORIES } from "@shared/schema";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/user/items"],
    queryFn: async () => {
      const response = await fetch("/api/user/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return response.json();
    },
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const response = await fetch("/api/conversations");
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      return response.json();
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest("DELETE", `/api/items/${itemId}`);
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Annonce supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/items"] });
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
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    },
  });

  const handleDeleteItem = (itemId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const lostItems = items?.filter((item: any) => item.type === "lost") || [];
  const foundItems = items?.filter((item: any) => item.type === "found") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-600">
              Gérez vos annonces et conversations
            </p>
          </div>
          <Button onClick={() => window.location.href = "/publier"}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle annonce
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-semibold">P</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Objets perdus</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lostItems.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">T</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Objets trouvés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {foundItems.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {conversations?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">A</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Annonces actives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {items?.filter((item: any) => item.isActive).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Mes annonces</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
          </TabsList>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes annonces</CardTitle>
              </CardHeader>
              <CardContent>
                {itemsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : items && items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item: any) => {
                      const category = CATEGORIES.find(c => c.id === item.category);
                      return (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {item.title}
                                </h3>
                                <Badge variant={item.type === "lost" ? "destructive" : "secondary"}>
                                  {item.type === "lost" ? "Perdu" : "Trouvé"}
                                </Badge>
                                {category && (
                                  <Badge variant="outline">
                                    <i className={`${category.icon} mr-1`} />
                                    {category.name}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {item.description.substring(0, 100)}...
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {item.location}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(item.dateOccurred).toLocaleDateString("fr-FR")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `/annonce/${item.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={deleteItemMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Vous n'avez pas encore publié d'annonce
                    </p>
                    <Button onClick={() => window.location.href = "/publier"}>
                      Publier votre première annonce
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : conversations && conversations.length > 0 ? (
                  <div className="space-y-4">
                    {conversations.map((conv: any) => (
                      <div key={conv.itemId} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {conv.item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {conv.lastMessage.content.substring(0, 100)}...
                            </p>
                            <div className="text-sm text-gray-500">
                              {new Date(conv.lastMessage.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/chat/${conv.itemId}`}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Aucune conversation en cours
                    </p>
                    <p className="text-gray-500 text-sm">
                      Les conversations apparaîtront ici lorsque quelqu'un vous contactera
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
