import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield } from "lucide-react";
import { useCognitoAuth } from "@/hooks/useCognitoAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PayPalButton from "@/components/PayPalButton";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  planDetails: any;
  method: string;
}

const CheckoutForm = ({ planDetails, method }: CheckoutFormProps) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || isProcessing) return;
    
    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast({
          title: t("checkout.error.title"),
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("checkout.error.title"),
        description: t("checkout.error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (method === 'paypal') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{t("checkout.paypal.title")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("checkout.paypal.description")}
          </p>
        </div>
        <PayPalButton
          amount={planDetails.price.toString()}
          currency="EUR"
          intent="CAPTURE"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">{t("checkout.stripe.title")}</h3>
        </div>
        <PaymentElement />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? t("checkout.processing") : t("checkout.pay", { amount: `€${planDetails.price}` })}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { t } = useTranslation();
  const { isAuthenticated } = useCognitoAuth();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [method, setMethod] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const planId = params.get('plan');
    const paymentMethod = params.get('method');

    if (!planId || !paymentMethod) {
      setLocation("/pricing");
      return;
    }

    setMethod(paymentMethod);

    // Get plan details and create payment intent
    const initializePayment = async () => {
      try {
        const response = await apiRequest("POST", "/api/checkout/initialize", {
          planId,
          paymentMethod,
        });
        
        const data = await response.json();
        setPlanDetails(data.plan);
        
        if (paymentMethod === 'stripe') {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        setLocation("/pricing");
      }
    };

    initializePayment();
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (!planDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      borderRadius: '8px',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/pricing")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("checkout.back")}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("checkout.title")}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                {t("checkout.summary.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{planDetails.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {planDetails.description}
                  </p>
                </div>
                {planDetails.popular && (
                  <Badge variant="secondary">{t("pricing.popular")}</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("checkout.summary.subtotal")}</span>
                  <span>€{planDetails.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout.summary.tax")}</span>
                  <span>€0.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t("checkout.summary.total")}</span>
                    <span>€{planDetails.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">{t("checkout.summary.features")}</h4>
                <ul className="space-y-1">
                  {planDetails.features?.map((feature: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("checkout.payment.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              {method === 'stripe' && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                  <CheckoutForm planDetails={planDetails} method={method} />
                </Elements>
              ) : method === 'paypal' ? (
                <CheckoutForm planDetails={planDetails} method={method} />
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}