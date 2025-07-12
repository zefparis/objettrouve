import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';

export default function MapPage() {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/items'],
  });

  const loadGoogleMaps = () => {
    if (window.google?.maps) return initMap();

    const existingScript = document.getElementById('googleMaps');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.id = 'googleMaps';
    script.async = true;
    script.defer = true;

    script.onload = () => initMap();
    document.body.appendChild(script);
  };

  const map = new window.google.maps.Map(mapRef.current, {
  center: { lat: 48.8566, lng: 2.3522 }, // Paris
  zoom: 12,
  scrollwheel: false,
  gestureHandling: "greedy", // ou "cooperative" selon ton besoin
  disableDefaultUI: false,   // optionnel : true pour retirer tous les boutons natifs
  zoomControl: true,
  mapTypeControl: false,
});


    // 🔴 Marqueurs de test
    const markers = [
      { lat: 48.857, lng: 2.355, color: 'red' },
      { lat: 48.860, lng: 2.350, color: 'green' },
      { lat: 48.853, lng: 2.358, color: 'blue' },
    ];

    markers.forEach(({ lat, lng, color }) => {
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          scale: 6,
          strokeColor: 'white',
          strokeWeight: 1,
        },
      });
    });

    setMapLoaded(true);
  };

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <span className="text-sm text-gray-500">
              {isLoading ? t('common.loading') : `${items.length} ${t('map.totalItems')}`}
            </span>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] p-4">
        <Card className="h-full shadow-lg">
          <div className="h-full rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}
