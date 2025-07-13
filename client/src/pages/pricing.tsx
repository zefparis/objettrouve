import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Zap, Shield, Star, Mail, ImageIcon, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { ArrowLeft, Home } from "lucide-react";
import SimpleAuthModal from "@/components/auth/simple-auth-modal";
import StripeCheckoutModal from "@/components/stripe-checkout-modal";

export default function Pricing() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const services = [
    {
      id: "boost_listing",
      name: t("pricing.services.boost.name"),
      description: t("pricing.services.boost.description"),
      price: 1.99,
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      features: [
        t("pricing.services.boost.features.priority"),
        t("pricing.services.boost.features.highlight"),
        t("pricing.services.boost.features.duration")
      ],
      popular: true,
    },
    {
      id: "verified_badge",
      name: t("pricing.services.verification.name"),
      description: t("pricing.services.verification.description"),
      price: 2.99,
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      features: [
        t("pricing.services.verification.features.badge"),
        t("pricing.services.verification.features.trust"),
        t("pricing.services.verification.features.priority")
      ],
    },
    {
      id: "extra_images",
      name: t("pricing.services.extra_images.name"),
      description: t("pricing.services.extra_images.description"),
      price: 0.50,
      icon: <ImageIcon className="w-8 h-8 text-pink-500" />,
      features: [
        t("pricing.services.extra_images.features.free"),
        t("pricing.services.extra_images.features.price"),
        t("pricing.services.extra_images.features.limit")
      ],
    },
    {
      id: "wide_search",
      name: t("pricing.services.search.name"),
      description: t("pricing.services.search.description"),
      price: 1.00,
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      features: [
        t("pricing.services.search.features.radius"),
        t("pricing.services.search.features.alerts"),
        t("pricing.services.search.features.priority")
      ],
    },
    {
      id: "priority_contact",
      name: t("pricing.services.contact.name"),
      description: t("pricing.services.contact.description"),
      price: 4.99,
      icon: <Mail className="w-8 h-8 text-red-500" />,
      features: [
        t("pricing.services.contact.features.instant"),
        t("pricing.services.contact.features.confirmation"),
        t("pricing.services.contact.features.priority")
      ],
    },
  ];

  const handleSelect = (service: any) => {
    if (!isAuthenticated) {
      setSelectedService(service);
      setShowAuthModal(true);
      return;
    }
    setSelectedService(service);
    setShowModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedService) setShowModal(true);
  };

  const handlePayment = (method: "stripe" | "paypal") => {
    if (selectedService) {
      if (method === "stripe") {
        setShowModal(false);
        setShowStripeModal(true);
      } else {
        window.location.href = `/checkout?type=service&id=${selectedService.id}&method=${method}`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Retour accueil */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <Home className="w-4 h-4" />
              <span>{t("nav.home")}</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t("pricing.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
              {service.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                  {t("pricing.popular")}
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
                <div className="text-3xl font-bold text-primary">
                  €{service.price.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((f, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => handleSelect(service)} className="w-full">
                  {t("pricing.select")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("pricing.payment.title")}</DialogTitle>
              <DialogDescription>
                {t("pricing.payment.description")} {selectedService?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => handlePayment("stripe")} variant="outline">
                  Stripe
                </Button>
                <Button onClick={() => handlePayment("paypal")} variant="outline">
                  PayPal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <SimpleAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />

        {selectedService && (
          <StripeCheckoutModal
            isOpen={showStripeModal}
            onClose={() => setShowStripeModal(false)}
            service={selectedService}
          />
        )}
      </div>
    </div>
  );
}
