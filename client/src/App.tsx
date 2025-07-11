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
