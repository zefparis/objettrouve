import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Stats from "@/components/stats";
import ItemCard from "@/components/item-card";
import HowItWorks from "@/components/how-it-works";
import MapSection from "@/components/map-section";
import Testimonials from "@/components/testimonials";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Crown, CreditCard, DollarSign, Settings, ShoppingCart, Star } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Removed automatic redirect logic - let the App router handle authentication routing

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/items"],
    queryFn: async () => {
      const response = await fetch("/api/items?limit=6");
      return response.json();
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Stats />
      
      {/* Recent Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.recentItems")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.recentItemsDesc")}
            </p>
          </div>
          
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : items && items.length > 0 ? (
              items.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">{t("home.noItemsYet")}</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="px-8 py-3">
              {t("home.viewAllItems")}
            </Button>
          </div>
        </div>
      </section>

      {/* Monetization Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">{t("home.premium.badge")}</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.premium.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.premium.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pricing Page */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  {t("home.premium.pricing")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("home.premium.pricingDesc")}
                </p>
                <Link href="/pricing">
                  <Button className="w-full">
                    {t("home.premium.viewPricing")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Checkout System */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
                  {t("home.premium.paymentSystem")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("home.premium.paymentSystemDesc")}
                </p>
                <Link href="/checkout">
                  <Button className="w-full">
                    {t("home.premium.viewCheckout")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Dashboard */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-purple-500" />
                  {t("home.premium.adminDashboard")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("home.premium.adminDashboardDesc")}
                </p>
                <Link href="/admin">
                  <Button className="w-full">
                    {t("home.premium.viewAdmin")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Payment Success */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                  {t("home.premium.paymentConfirm")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("home.premium.paymentConfirmDesc")}
                </p>
                <Link href="/payment-success">
                  <Button className="w-full">
                    {t("home.premium.viewConfirm")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* API Documentation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-500" />
                  {t("home.premium.apiPayment")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("home.premium.apiPaymentDesc")}
                </p>
                <Button className="w-full" variant="outline">
                  {t("home.premium.viewDocs")}
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  {t("home.premium.revenueAnalytics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("home.premium.revenueAnalyticsDesc")}
                </p>
                <Link href="/admin">
                  <Button className="w-full" variant="outline">
                    {t("home.premium.viewAnalytics")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <HowItWorks />
      <MapSection />
      <Testimonials />
      <Categories />
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.ctaTitle")}</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            {t("home.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-8 py-3"
              onClick={() => window.location.href = "/publish"}
            >
              {t("home.publishAd")}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => window.location.href = "/dashboard"}
            >
              {t("home.myDashboard")}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
