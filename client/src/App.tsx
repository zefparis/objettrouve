import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Publish from "@/pages/publish";
import ItemDetail from "@/pages/item-detail";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import HowItWorks from "@/pages/how-it-works";
import Contact from "@/pages/contact";
import Profile from "@/pages/profile";
import AdminDashboard from "@/pages/admin-dashboard";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import PaymentSuccess from "@/pages/payment-success";
import MentionsLegales from "@/pages/legal/mentions-legales";
import PolitiqueConfidentialite from "@/pages/legal/politique-confidentialite";
import CGU from "@/pages/legal/cgu";
import Cookies from "@/pages/legal/cookies";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/search" component={Search} />
      <Route path="/rechercher" component={Search} />
      <Route path="/publier" component={Publish} />
      <Route path="/annonce/:id" component={ItemDetail} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:itemId" component={Chat} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/profil" component={Profile} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/mentions-legales" component={MentionsLegales} />
      <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
      <Route path="/cgu" component={CGU} />
      <Route path="/cookies" component={Cookies} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
