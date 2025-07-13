import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function AdminRevenue() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("30d");

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["/api/admin/revenue", period],
    queryFn: async () => {
      const response = await fetch(`/api/admin/revenue?period=${period}`);
      if (!response.ok) throw new Error("Failed to fetch revenue data");
      return response.json();
    },
  });

  const { data: payingUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/paying-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/paying-users");
      if (!response.ok) throw new Error("Failed to fetch paying users");
      return response.json();
    },
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
                <h1 className="text-2xl font-bold text-gray-900">Analyse des revenus</h1>
                <p className="text-gray-600">Suivez les revenus et performances financières</p>
              </div>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">90 derniers jours</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{isLoading ? "..." : (revenueData?.totalRevenue || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {isLoading ? "..." : (
                  <>
                    {revenueData?.revenueGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                    )}
                    {Math.abs(revenueData?.revenueGrowth || 0)}% par rapport à la période précédente
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs payants</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersLoading ? "..." : payingUsers?.payingUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {usersLoading ? "..." : (
                  <>
                    {payingUsers?.userGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                    )}
                    {Math.abs(payingUsers?.userGrowth || 0)}% ce mois
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus moyens par utilisateur</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{isLoading || usersLoading ? "..." : (
                  payingUsers?.payingUsers > 0 
                    ? ((revenueData?.totalRevenue || 0) / payingUsers.payingUsers).toFixed(2)
                    : "0.00"
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Par utilisateur payant
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Évolution des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Graphique des revenus</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {revenueData?.dailyRevenue?.length || 0} points de données pour la période sélectionnée
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Paying Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top utilisateurs payants</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : payingUsers?.users?.length > 0 ? (
              <div className="space-y-4">
                {payingUsers.users.slice(0, 10).map((user: any, index: number) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Nom non renseigné"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">€{(user.totalSpent / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{user.orderCount} commandes</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun utilisateur payant pour le moment
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}