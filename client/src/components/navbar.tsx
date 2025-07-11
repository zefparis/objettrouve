import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Search, Plus, User, Settings, LogOut, X } from "lucide-react";
import LanguageSelector from "./language-selector";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.search"), href: "/search" },
    { name: t("nav.howItWorks"), href: "/how-it-works" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const authenticatedNavigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.search"), href: "/search" },
    { name: t("nav.dashboard"), href: "/dashboard" },
    { name: t("nav.chat"), href: "/chat" },
  ];

  const currentNavigation = isAuthenticated ? authenticatedNavigation : navigation;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                <Search className="inline h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1 sm:mr-2" />
                <span className="hidden xs:inline">ObjetsTrouvés</span>
                <span className="xs:hidden">OT</span>
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    location === item.href
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-16 sm:w-20 bg-gray-200 rounded"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  className="hidden sm:flex"
                  onClick={() => window.location.href = "/publier"}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">{t("nav.publish")}</span>
                  <span className="md:hidden">+</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative p-1">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback className="text-xs">
                          {user?.firstName?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                      <User className="h-4 w-4 mr-2" />
                      {t("nav.dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = "/chat"}>
                      <Search className="h-4 w-4 mr-2" />
                      {t("nav.chat")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="sm:hidden" onClick={() => window.location.href = "/publier"}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("nav.publish")}
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
                size="sm"
                onClick={() => window.location.href = "/api/login"}
                className="text-white px-3 py-2"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t("nav.login")}</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
            
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 text-base font-medium transition-colors rounded-md ${
                    location === item.href
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile-only items */}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="px-3 py-2">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
