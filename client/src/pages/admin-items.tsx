import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Eye, EyeOff, Trash2, MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function AdminItems() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["/api/admin/items"],
    queryFn: async () => {
      const response = await fetch("/api/admin/items");
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  const toggleItemStatus = useMutation({
    mutationFn: async ({ itemId, isActive }: { itemId: number; isActive: boolean }) => {
      const response = await fetch(`/api/admin/items/${itemId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to toggle item status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
      toast({
        title: "Succès",
        description: "Statut de l'objet modifié",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/items"] });
      toast({
        title: "Succès",
        description: "Objet supprimé",
      });
    },
  });

  const filteredItems = items?.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
                <h1 className="text-2xl font-bold text-gray-900">Gestion des objets</h1>
                <p className="text-gray-600">Modérer les objets perdus et trouvés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un objet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="lost">Objets perdus</SelectItem>
              <SelectItem value="found">Objets trouvés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredItems?.length > 0 ? (
            filteredItems.map((item: any) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={item.type === "lost" ? "destructive" : "default"}>
                            {item.type === "lost" ? "Perdu" : "Trouvé"}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {item.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(item.dateOccurred).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Visible" : "Masqué"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleItemStatus.mutate({ 
                          itemId: item.id, 
                          isActive: !item.isActive 
                        })}
                        disabled={toggleItemStatus.isPending}
                      >
                        {item.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Masquer
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Afficher
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Êtes-vous sûr de vouloir supprimer cet objet ?")) {
                            deleteItem.mutate(item.id);
                          }
                        }}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun objet trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
}