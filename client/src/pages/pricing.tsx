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
      name: "Mise en avant",
      description: "Votre annonce apparaît en haut de la liste pendant 48h.",
      price: 1.99,
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      features: ["Visibilité prioritaire", "Badge visible", "Durée 48h"],
      popular: true,
    },
    {
      id: "verified_badge",
      name: "Badge vérifié",
      description: "Ajoute un badge de confiance à votre annonce.",
      price: 2.99,
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      features: ["Vérification email/téléphone", "Annonces mises en avant", "Plus de confiance"],
    },
    {
      id: "extra_images",
      name: "Photos supplémentaires",
      description: "Ajoutez jusqu'à 5 photos en plus (0.50€ / photo).",
      price: 0.50,
      icon: <ImageIcon className="w-8 h-8 text-pink-500" />,
      features: ["3 gratuites", "0.50€ par photo supplémentaire", "Maximum 5 en plus"],
    },
    {
      id: "wide_search",
      name: "Zone de recherche élargie",
      description: "Permet de rechercher dans un rayon étendu.",
      price: 1.00,
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      features: ["Rayon de 50km+", "Filtres plus puissants", "Alertes élargies"],
    },
    {
      id: "priority_contact",
      name: "Transmission prioritaire",
      description: "Envoi prioritaire aux autorités ou gestionnaires.",
      price: 4.99,
      icon: <Mail className="w-8 h-8 text-red-500" />,
      features: ["Envoi instantané", "Confirmation email", "Accès prioritaire"],
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
            Services Premium
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Améliorez la visibilité et l'efficacité de vos annonces avec nos options à la carte.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
              {service.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                  Populaire
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
                  Acheter
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choisissez un mode de paiement</DialogTitle>
              <DialogDescription>
                Sélectionnez votre méthode de paiement préférée pour {selectedService?.name}
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
