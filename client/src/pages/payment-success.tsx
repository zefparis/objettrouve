import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowRight, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";
import { useCognitoAuth } from "@/hooks/useCognitoAuth";

export default function PaymentSuccess() {
  const { t } = useTranslation();
  const { isAuthenticated } = useCognitoAuth();
  const [, setLocation] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    // Get payment details from URL params
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get('payment_intent');
    const paymentIntentClientSecret = params.get('payment_intent_client_secret');

    if (paymentIntent) {
      // Verify payment with server
      fetch(`/api/payment/verify?payment_intent=${paymentIntent}`)
        .then(response => response.json())
        .then(data => {
          setPaymentDetails(data);
        })
        .catch(error => {
          console.error('Error verifying payment:', error);
          setLocation("/pricing");
        });
    } else {
      // Handle PayPal success or other payment methods
      setPaymentDetails({
        status: 'succeeded',
        amount: 0,
        currency: 'eur',
        product: 'Unknown'
      });
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              {t("payment.success.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("payment.success.message")}
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t("payment.success.details")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t("payment.success.amount")}</span>
                    <span>${(paymentDetails.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("payment.success.currency")}</span>
                    <span>{paymentDetails.currency.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("payment.success.product")}</span>
                    <span>{paymentDetails.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("payment.success.status")}</span>
                    <span className="text-green-600 font-semibold">
                      {t("payment.success.completed")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("payment.success.download")}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setLocation("/dashboard")}
                  variant="outline"
                >
                  {t("payment.success.dashboard")}
                </Button>
                <Button
                  onClick={() => setLocation("/profile")}
                  className="flex items-center"
                >
                  {t("payment.success.profile")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                {t("payment.success.next_steps.title")}
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• {t("payment.success.next_steps.step1")}</li>
                <li>• {t("payment.success.next_steps.step2")}</li>
                <li>• {t("payment.success.next_steps.step3")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}