import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Zap, Shield, Star, Users, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Pricing() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const premiumServices = [
    {
      id: "boost_listing",
      name: t("pricing.services.boost.name"),
      description: t("pricing.services.boost.description"),
      price: 9.99,
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      features: [
        t("pricing.services.boost.features.priority"),
        t("pricing.services.boost.features.highlight"),
        t("pricing.services.boost.features.duration"),
      ],
      popular: true,
    },
    {
      id: "premium_search",
      name: t("pricing.services.search.name"),
      description: t("pricing.services.search.description"),
      price: 4.99,
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      features: [
        t("pricing.services.search.features.alerts"),
        t("pricing.services.search.features.radius"),
        t("pricing.services.search.features.priority"),
      ],
    },
    {
      id: "verification",
      name: t("pricing.services.verification.name"),
      description: t("pricing.services.verification.description"),
      price: 14.99,
      icon: <Star className="w-8 h-8 text-green-500" />,
      features: [
        t("pricing.services.verification.features.badge"),
        t("pricing.services.verification.features.trust"),
        t("pricing.services.verification.features.priority"),
      ],
    },
  ];

  const subscriptionPlans = [
    {
      id: "pro",
      name: t("pricing.plans.pro.name"),
      description: t("pricing.plans.pro.description"),
      price: 29.99,
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      features: [
        t("pricing.plans.pro.features.listings"),
        t("pricing.plans.pro.features.priority"),
        t("pricing.plans.pro.features.analytics"),
        t("pricing.plans.pro.features.support"),
      ],
      popular: false,
    },
    {
      id: "advanced",
      name: t("pricing.plans.advanced.name"),
      description: t("pricing.plans.advanced.description"),
      price: 59.99,
      icon: <Users className="w-8 h-8 text-orange-500" />,
      features: [
        t("pricing.plans.advanced.features.listings"),
        t("pricing.plans.advanced.features.team"),
        t("pricing.plans.advanced.features.api"),
        t("pricing.plans.advanced.features.custom"),
      ],
      popular: true,
    },
    {
      id: "premium",
      name: t("pricing.plans.premium.name"),
      description: t("pricing.plans.premium.description"),
      price: 99.99,
      icon: <Shield className="w-8 h-8 text-red-500" />,
      features: [
        t("pricing.plans.premium.features.unlimited"),
        t("pricing.plans.premium.features.dedicated"),
        t("pricing.plans.premium.features.white_label"),
        t("pricing.plans.premium.features.training"),
      ],
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string, type: 'service' | 'subscription') => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setSelectedPlan(planId);
    setShowModal(true);
  };

  const handlePayment = (method: 'stripe' | 'paypal') => {
    if (selectedPlan) {
      window.location.href = `/checkout?plan=${selectedPlan}&method=${method}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("pricing.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("pricing.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="services" className="text-lg">
              {t("pricing.tabs.services")}
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="text-lg">
              {t("pricing.tabs.subscriptions")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="grid md:grid-cols-3 gap-8">
              {premiumServices.map((service) => (
                <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
                  {service.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                      {t("pricing.popular")}
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                    <div className="text-3xl font-bold text-primary">
                      €{service.price}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan(service.id, 'service')}
                      className="w-full"
                      variant={service.popular ? "default" : "outline"}
                    >
                      {t("pricing.select")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="grid md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                      {t("pricing.popular")}
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold text-primary">
                      €{plan.price}
                      <span className="text-sm text-gray-500">/mois</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan(plan.id, 'subscription')}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {t("pricing.subscribe")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("pricing.payment.title")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("pricing.payment.description")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handlePayment('stripe')}
                  className="w-full"
                  variant="outline"
                >
                  <img src="/stripe-logo.png" alt="Stripe" className="w-16 h-6" />
                </Button>
                <Button
                  onClick={() => handlePayment('paypal')}
                  className="w-full"
                  variant="outline"
                >
                  <img src="/paypal-logo.png" alt="PayPal" className="w-16 h-6" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}