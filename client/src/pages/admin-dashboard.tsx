import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Download, 
  RefreshCw,
  Crown,
  AlertCircle,
  CheckCircle,
  Languages,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  // Check if user is admin (you can modify this logic)
  const isAdmin = user?.email === "admin@example.com"; // Replace with your admin logic

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/admin/revenue", selectedPeriod],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: translationsData, isLoading: translationsLoading } = useQuery({
    queryKey: ["/api/admin/translations"],
    enabled: isAuthenticated && isAdmin,
  });

  const refundMutation = useMutation({
    mutationFn: async (data: { orderId: string; amount: number; reason: string }) => {
      const response = await apiRequest("POST", "/api/admin/refund", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("admin.refund.success"),
        description: t("admin.refund.successDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
    },
    onError: (error) => {
      toast({
        title: t("admin.refund.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest("GET", `/api/admin/export/${type}`);
      return response.blob();
    },
    onSuccess: (blob, type) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              {t("admin.unauthorized.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {t("admin.unauthorized.message")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("admin.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t("admin.subtitle")}
          </p>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.revenue.total")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${revenueData?.totalRevenue?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                +{revenueData?.revenueGrowth || 0}% {t("admin.revenue.growth")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.users.paying")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersData?.payingUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{usersData?.userGrowth || 0}% {t("admin.users.growth")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.orders.monthly")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ordersData?.monthlyOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{ordersData?.orderGrowth || 0}% {t("admin.orders.growth")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.translations.completion")}</CardTitle>
              <Languages className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {translationsData?.completionRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {translationsData?.missingTranslations || 0} {t("admin.translations.missing")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">{t("admin.tabs.revenue")}</TabsTrigger>
            <TabsTrigger value="users">{t("admin.tabs.users")}</TabsTrigger>
            <TabsTrigger value="orders">{t("admin.tabs.orders")}</TabsTrigger>
            <TabsTrigger value="translations">{t("admin.tabs.translations")}</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t("admin.revenue.overview")}</h3>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">{t("admin.period.7d")}</SelectItem>
                    <SelectItem value="30d">{t("admin.period.30d")}</SelectItem>
                    <SelectItem value="90d">{t("admin.period.90d")}</SelectItem>
                    <SelectItem value="1y">{t("admin.period.1y")}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => exportDataMutation.mutate("revenue")}
                  disabled={exportDataMutation.isPending}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("admin.export.pdf")}
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.revenue.daily")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">{t("admin.revenue.chartPlaceholder")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t("admin.users.paying")}</h3>
              <Button
                variant="outline"
                onClick={() => exportDataMutation.mutate("users")}
                disabled={exportDataMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("admin.export.pdf")}
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.users.email")}</TableHead>
                      <TableHead>{t("admin.users.plan")}</TableHead>
                      <TableHead>{t("admin.users.status")}</TableHead>
                      <TableHead>{t("admin.users.spent")}</TableHead>
                      <TableHead>{t("admin.users.joined")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            {t("admin.loading")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : usersData?.users?.length > 0 ? (
                      usersData.users.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.subscriptionTier === 'premium' ? 'default' : 'secondary'}>
                              <Crown className="w-3 h-3 mr-1" />
                              {user.subscriptionTier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                              {user.subscriptionStatus === 'active' ? 
                                <CheckCircle className="w-3 h-3 mr-1" /> : 
                                <AlertCircle className="w-3 h-3 mr-1" />
                              }
                              {user.subscriptionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>${(user.totalSpent / 100).toFixed(2)}</TableCell>
                          <TableCell>{format(new Date(user.createdAt), 'PP')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          {t("admin.users.noData")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t("admin.orders.recent")}</h3>
              <Button
                variant="outline"
                onClick={() => exportDataMutation.mutate("orders")}
                disabled={exportDataMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("admin.export.pdf")}
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.orders.id")}</TableHead>
                      <TableHead>{t("admin.orders.user")}</TableHead>
                      <TableHead>{t("admin.orders.product")}</TableHead>
                      <TableHead>{t("admin.orders.amount")}</TableHead>
                      <TableHead>{t("admin.orders.status")}</TableHead>
                      <TableHead>{t("admin.orders.date")}</TableHead>
                      <TableHead>{t("admin.orders.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            {t("admin.loading")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : ordersData?.orders?.length > 0 ? (
                      ordersData.orders.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.user?.email || "N/A"}</TableCell>
                          <TableCell>{order.productId}</TableCell>
                          <TableCell>${(order.amount / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'completed' ? 'default' : order.status === 'pending' ? 'secondary' : 'destructive'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(order.createdAt), 'PP')}</TableCell>
                          <TableCell>
                            {order.status === 'completed' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    {t("admin.orders.refund")}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{t("admin.refund.title")}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="refundAmount">{t("admin.refund.amount")}</Label>
                                      <Input
                                        id="refundAmount"
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        max={order.amount / 100}
                                        step="0.01"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="refundReason">{t("admin.refund.reason")}</Label>
                                      <Input
                                        id="refundReason"
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        placeholder={t("admin.refund.reasonPlaceholder")}
                                      />
                                    </div>
                                    <Button
                                      onClick={() => refundMutation.mutate({
                                        orderId: order.id,
                                        amount: parseFloat(refundAmount) * 100,
                                        reason: refundReason
                                      })}
                                      disabled={refundMutation.isPending}
                                      className="w-full"
                                    >
                                      {refundMutation.isPending ? t("admin.refund.processing") : t("admin.refund.confirm")}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          {t("admin.orders.noData")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="translations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t("admin.translations.status")}</h3>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/translations"] })}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t("admin.refresh")}
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.translations.language")}</TableHead>
                      <TableHead>{t("admin.translations.completion")}</TableHead>
                      <TableHead>{t("admin.translations.missing")}</TableHead>
                      <TableHead>{t("admin.translations.lastUpdate")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {translationsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            {t("admin.loading")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : translationsData?.languages?.length > 0 ? (
                      translationsData.languages.map((lang: any) => (
                        <TableRow key={lang.code}>
                          <TableCell className="font-medium">{lang.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${lang.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{lang.completionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={lang.missingKeys === 0 ? 'default' : 'destructive'}>
                              {lang.missingKeys}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(lang.lastUpdate), 'PP')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          {t("admin.translations.noData")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}