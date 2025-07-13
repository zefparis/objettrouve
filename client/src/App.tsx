import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
// Removed Suspense import as it's not needed with useSuspense: false
import "./i18n";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Publish from "@/pages/publish";
import ItemDetail from "@/pages/item-detail";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Conversations from "@/pages/conversations";
import HowItWorks from "@/pages/how-it-works";
import Contact from "@/pages/contact";
import Profile from "@/pages/profile";
// AdminDashboard removed - consolidated into Admin component
import Admin from "@/pages/admin";
import AdminUsers from "@/pages/admin-users";
import AdminItems from "@/pages/admin-items";
import AdminOrders from "@/pages/admin-orders";
import AdminRevenue from "@/pages/admin-revenue";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminSettings from "@/pages/admin-settings";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import PaymentSuccess from "@/pages/payment-success";
import MapPage from "@/pages/map";
import MentionsLegales from "@/pages/mentions-legales";
import PolitiqueConfidentialite from "@/pages/politique-confidentialite";
import ConditionsUtilisation from "@/pages/conditions-utilisation";
import PolitiqueCookies from "@/pages/politique-cookies";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/search" component={Search} />
      <Route path="/publish" component={Publish} />
      <Route path="/item/:id" component={ItemDetail} />
      <Route path="/chat" component={Conversations} />
      <Route path="/chat/:itemId" component={Chat} />
      <Route path="/conversations" component={Conversations} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/map" component={MapPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/items" component={AdminItems} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/revenue" component={AdminRevenue} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin-dashboard" component={() => <Admin />} />
      
      {/* Pages légales */}
      <Route path="/mentions-legales" component={MentionsLegales} />
      <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
      <Route path="/conditions-utilisation" component={ConditionsUtilisation} />
      <Route path="/politique-cookies" component={PolitiqueCookies} />
      
      <Route path="/" component={isLoading || !isAuthenticated ? Landing : Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
