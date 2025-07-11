import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCognitoAuth } from "@/hooks/useCognitoAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Calendar, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  Users, 
  Search,
  Package,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home
} from "lucide-react";
import { Link } from "wouter";
import { CATEGORIES } from "@shared/schema";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useCognitoAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // In development, allow access to dashboard without authentication
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

  // Don't render dashboard if not authenticated (except in development)
  if (!isDevelopment && !isAuthenticated) {
    return null;
  }

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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
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
        title: t("common.success"),
        description: t("dashboard.deleteSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/items"] });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("dashboard.deleteError"),
        variant: "destructive",
      });
    },
  });

  const handleDeleteItem = (itemId: number) => {
    if (confirm(t("dashboard.confirmDelete"))) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const lostItems = items?.filter((item: any) => item.type === "lost") || [];
  const foundItems = items?.filter((item: any) => item.type === "found") || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lost":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "found":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t("dashboard.justNow");
    if (diffInHours < 24) return t("dashboard.hoursAgo", { hours: diffInHours });
    const diffInDays = Math.floor(diffInHours / 24);
    return t("dashboard.daysAgo", { days: diffInDays });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t("dashboard.welcome")}, {user?.firstName || user?.email?.split('@')[0] || t("dashboard.user")}!
            </h1>
            <p className="text-lg text-gray-600">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.href = "/publier?type=lost"}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {t("dashboard.reportLost")}
            </Button>
            <Button 
              onClick={() => window.location.href = "/publier?type=found"}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t("dashboard.reportFound")}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t("dashboard.lostItems")}</p>
                  <p className="text-3xl font-bold text-red-600">
                    {lostItems.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t("dashboard.yourItems")}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t("dashboard.foundItems")}</p>
                  <p className="text-3xl font-bold text-green-600">
                    {foundItems.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t("dashboard.yourItems")}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t("dashboard.conversations")}</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {conversations?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t("dashboard.active")}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t("dashboard.totalViews")}</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {items?.reduce((sum: number, item: any) => sum + (item.views || 0), 0) || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t("dashboard.allItems")}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t("dashboard.myItems")}
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("dashboard.conversations")}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t("dashboard.activity")}
            </TabsTrigger>
          </TabsList>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t("dashboard.myItems")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {itemsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="rounded-md bg-gray-200 h-20 w-20"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : items && items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <Badge variant={item.type === "lost" ? "destructive" : "secondary"}>
                              {item.type === "lost" ? t("search.itemType.lost") : t("search.itemType.found")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {item.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(item.dateOccurred).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {item.views || 0} {t("dashboard.views")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `/annonce/${item.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `/publier?edit=${item.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("dashboard.noItems")}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {t("dashboard.noItemsDesc")}
                    </p>
                    <Button onClick={() => window.location.href = "/publier"}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("dashboard.publishFirstAd")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("dashboard.conversations")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations && conversations.length > 0 ? (
                  <div className="space-y-4">
                    {conversations.map((conv: any) => (
                      <div key={conv.itemId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => window.location.href = `/chat/${conv.itemId}`}>
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {conv.item.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage.content}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {getTimeAgo(conv.lastMessage.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("dashboard.noConversations")}
                    </h3>
                    <p className="text-gray-500">
                      {t("dashboard.noConversationsDesc")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t("dashboard.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items && items.length > 0 ? (
                    items.slice(0, 10).map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {item.type === "lost" ? t("dashboard.lostItemActivity") : t("dashboard.foundItemActivity")}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {item.title}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {getTimeAgo(item.createdAt)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t("dashboard.noActivity")}
                      </h3>
                      <p className="text-gray-500">
                        {t("dashboard.noActivityDesc")}
                      </p>
                    </div>
                  )}
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