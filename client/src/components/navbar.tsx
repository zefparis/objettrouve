import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Search, Plus, User, Settings, LogOut } from "lucide-react";
import LanguageSelector from "./language-selector";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.search"), href: "/rechercher" },
    { name: t("nav.howItWorks"), href: "/how-it-works" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const authenticatedNavigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.search"), href: "/rechercher" },
    { name: t("nav.dashboard"), href: "/dashboard" },
    { name: t("nav.chat"), href: "/chat" },
  ];

  const currentNavigation = isAuthenticated ? authenticatedNavigation : navigation;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                <Search className="inline h-5 w-5 text-primary mr-2" />
                ObjetsTrouvés
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  onClick={() => window.location.href = "/publier"}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("nav.publish")}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                      <User className="h-4 w-4 mr-2" />
                      {t("nav.dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = "/chat"}>
                      <Search className="h-4 w-4 mr-2" />
                      {t("nav.chat")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="text-white"
              >
                <User className="h-4 w-4 mr-2" />
                {t("nav.login")}
              </Button>
            )}
            
            <LanguageSelector />
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location === item.href
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
