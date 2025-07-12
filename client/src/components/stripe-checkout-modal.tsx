import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Loader2 } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
}

interface CheckoutFormProps {
  service: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  onSuccess: () => void;
}

const CheckoutForm = ({ service, onSuccess }: CheckoutFormProps) => {
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
          return_url: `${window.location.origin}/payment-success?service=${service.id}`,
        },
      });

      if (error) {
        toast({
          title: "Erreur de paiement",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Paiement réussi",
          description: "Votre service a été activé avec succès !",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Paiement sécurisé</h3>
        </div>
        <PaymentElement />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Traitement...</span>
          </div>
        ) : (
          `Payer €${service.price.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default function StripeCheckoutModal({ isOpen, onClose, service }: StripeCheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/stripe/create-payment-intent", {
          amount: Math.round(service.price * 100), // Convert to cents
          currency: "eur",
          serviceId: service.id,
          serviceName: service.name,
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Failed to create payment intent:", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer l'intention de paiement",
          variant: "destructive",
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [isOpen, service]);

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

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paiement - {service.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <div className="text-2xl font-bold text-primary">
                €{service.price.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm 
                service={service} 
                onSuccess={() => {
                  onClose();
                  // Optional: redirect to success page
                  window.location.href = `/payment-success?service=${service.id}`;
                }}
              />
            </Elements>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Erreur lors du chargement du paiement
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}