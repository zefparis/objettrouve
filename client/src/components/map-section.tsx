import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Map } from "lucide-react";
import { Link } from "wouter";

export default function MapSection() {
  const { t } = useTranslation();
  
  // Récupérer les items pour les statistiques
  const { data: items = [] } = useQuery({
    queryKey: ['/api/items'],
  });

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t("map.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("map.subtitle")}
          </p>
        </div>
        
        <Card className="shadow-lg overflow-hidden">
          <div className="h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
            <div className="text-center px-4">
              <Map className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
              <p className="text-gray-700 text-base sm:text-lg mb-2">
                {t("map.interactiveMap")}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-2">
                {t("map.integration")}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                API Google Maps: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Configurée' : '❌ Non configurée'}
              </p>
              <Link href="/map">
                <Button className="bg-primary hover:bg-primary/90">
                  {t("map.viewOnMap")}
                </Button>
              </Link>
            </div>
            
            {/* Mock map markers - responsive positioning */}
            <div className="absolute top-8 left-8 sm:top-16 sm:left-16 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute top-16 right-16 sm:top-32 sm:right-32 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute bottom-12 left-1/3 sm:bottom-24 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute bottom-16 right-8 sm:bottom-32 sm:right-16 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
          </div>
          
          <CardContent className="p-4 sm:p-6 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">{t("map.lostItems")}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">{t("map.foundItems")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {items.length} {t("map.totalItems")}
                </span>
                <Link href="/map">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    {t("map.fullscreen")}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
