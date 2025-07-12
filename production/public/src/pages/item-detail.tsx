import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Calendar, Phone, Mail, MessageCircle, User, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";
import { CATEGORIES } from "@shared/schema";

export default function ItemDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [showContact, setShowContact] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ["/api/items", id],
    queryFn: async () => {
      const response = await fetch(`/api/items/${id}`);
      if (!response.ok) {
        throw new Error("Item not found");
      }
      return response.json();
    },
    enabled: !!id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/messages", {
        itemId: parseInt(id!),
        receiverId: item.userId,
        content,
      });
    },
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("itemDetail.messageSent"),
      });
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("itemDetail.messageError"),
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleContactReveal = () => {
    setShowContact(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Annonce non trouvée
              </h2>
              <p className="text-gray-600 mb-6">
                L'annonce que vous recherchez n'existe pas ou a été supprimée.
              </p>
              <Button onClick={() => window.history.back()}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === item.category);
  const isOwnItem = user?.id === item.userId;

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={item.type === "lost" ? "destructive" : "secondary"}>
                        {item.type === "lost" ? t("search.itemType.lost") : t("search.itemType.found")}
                      </Badge>
                      {category && (
                        <Badge variant="outline">
                          <i className={`${category.icon} mr-1`} />
                          {category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Image */}
                {item.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {item.type === "lost" ? t("itemDetail.lostOn") : t("itemDetail.foundOn")}{" "}
                      {new Date(item.dateOccurred).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span>
                      Publié le {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            {!isOwnItem && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("itemDetail.contactOwner")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showContact ? (
                    <Button
                      onClick={handleContactReveal}
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Cet objet m'appartient
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {/* Contact Information */}
                      {item.contactPhone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{item.contactPhone}</span>
                        </div>
                      )}
                      {item.contactEmail && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{item.contactEmail}</span>
                        </div>
                      )}

                      <Separator />

                      {/* Message Form */}
                      <div className="space-y-3">
                        <h4 className="font-medium">{t("itemDetail.sendMessage")}</h4>
                        <Textarea
                          placeholder={t("itemDetail.messagePlaceholder")}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || sendMessageMutation.isPending}
                          className="w-full"
                        >
                          {sendMessageMutation.isPending ? t("itemDetail.sending") : t("itemDetail.send")}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Owner Actions */}
            {isOwnItem && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("itemDetail.manageAd")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
{t("itemDetail.editAd")}
                  </Button>
                  <Button variant="outline" className="w-full">
{t("itemDetail.markAsFound")}
                  </Button>
                  <Button variant="destructive" className="w-full">
{t("itemDetail.deleteAd")}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Similar Items */}
            <Card>
              <CardHeader>
                <CardTitle>{t("itemDetail.similarItems")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
{t("itemDetail.alertDescription")}
                </p>
                <Button variant="outline" className="w-full mt-3">
{t("itemDetail.createAlert")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
