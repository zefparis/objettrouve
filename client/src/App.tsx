import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";
import "./i18n";
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
import MapPage from "@/pages/map";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/search" component={Search} />
      <Route path="/publish" component={Publish} />
      <Route path="/item/:id" component={ItemDetail} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:itemId" component={Chat} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/map" component={MapPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/" component={isLoading || !isAuthenticated ? Landing : Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>}>
          <div className="min-h-screen bg-background">
            <Router />
            <Toaster />
          </div>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
