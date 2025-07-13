import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, AlertCircle, RotateCcw } from 'lucide-react';

interface MapItem {
  id: number;
  title: string;
  type: 'lost' | 'found';
  location: string;
  latitude?: number;
  longitude?: number;
  dateOccurred: string;
  category: string;
  description?: string;
}

interface UnifiedMapProps {
  items?: MapItem[];
  height?: string;
  showControls?: boolean;
  onItemClick?: (item: MapItem) => void;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  showCurrentLocation?: boolean;
  clustered?: boolean;
}

export default function UnifiedMap({
  items = [],
  height = '400px',
  showControls = true,
  onItemClick,
  className = '',
  center = { lat: 48.8566, lng: 2.3522 }, // Paris by default
  zoom = 10,
  showCurrentLocation = false,
  clustered = false
}: UnifiedMapProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key not configured');
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);

        // Get current location if requested
        if (showCurrentLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              setCurrentLocation(pos);
              
              // Add current location marker
              new google.maps.Marker({
                position: pos,
                map: mapInstance,
                title: t('map.yourLocation'),
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
                }
              });
            },
            () => {
              console.warn('Geolocation permission denied');
            }
          );
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(t('map.loadError'));
        setIsLoading(false);
      }
    };

    initMap();
  }, [center, zoom, showCurrentLocation, t]);

  // Update markers when items change
  useEffect(() => {
    if (!map || !items.length) return;

    clearMarkers();

    items.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      const marker = new google.maps.Marker({
        position: { lat: parseFloat(item.latitude.toString()), lng: parseFloat(item.longitude.toString()) },
        map,
        title: item.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: item.type === 'lost' ? '#ef4444' : '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onItemClick) {
          onItemClick(item);
        }

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-sm mb-1">${item.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${item.location}</p>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  item.type === 'lost' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }">
                  ${item.type === 'lost' ? 'Perdu' : 'Trouvé'}
                </span>
                <span class="text-xs text-gray-500">${item.category}</span>
              </div>
            </div>
          `
        });

        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [map, items, onItemClick, clearMarkers]);

  // Center map on current location
  const centerOnLocation = useCallback(() => {
    if (currentLocation && map) {
      map.setCenter(currentLocation);
      map.setZoom(15);
    }
  }, [currentLocation, map]);

  // Retry loading map
  const retryLoad = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Trigger re-initialization
    window.location.reload();
  }, []);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">{t('map.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('map.loadError')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('map.loadErrorDesc')}</p>
            <Button onClick={retryLoad} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showControls && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('map.viewOnMap')}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {items.length} {t('map.totalItems')}
              </span>
              {currentLocation && (
                <Button
                  onClick={centerOnLocation}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {t('map.centerOnLocation')}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          style={{ width: '100%', height }}
          className="rounded-b-lg"
        />
      </CardContent>
    </Card>
  );
}

// Type definitions for Google Maps (extend window interface)
declare global {
  interface Window {
    google: typeof google;
  }
}