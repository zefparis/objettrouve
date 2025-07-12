import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Map } from 'lucide-react';

export default function MapPage() {
  const { t } = useTranslation();
  
  // Récupérer les items pour les statistiques
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/items'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('map.title')}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('map.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {isLoading ? t('common.loading') : `${items.length} ${t('map.totalItems')}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Carte pleine page - Version de démonstration */}
      <div className="h-[calc(100vh-64px)] p-4">
        <Card className="h-full shadow-lg">
          <div className="h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative rounded-lg">
            <div className="text-center px-4">
              <Map className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('map.title')}
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                {t('map.interactiveMap')}
              </p>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  🗺️ {t('map.integration')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Configurée' : '❌ Manquante'}
                </p>
              </div>
              
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">{t('map.lostItems')}</span>
                </div>
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">{t('map.foundItems')}</span>
                </div>
              </div>
            </div>
            
            {/* Marqueurs de démonstration */}
            <div className="absolute top-16 left-16 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute top-32 right-32 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute bottom-24 left-1/3 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg">
              <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}