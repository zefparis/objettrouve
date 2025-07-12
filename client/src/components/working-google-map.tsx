import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize2, Minimize2, AlertCircle } from "lucide-react";

interface WorkingGoogleMapProps {
  items?: Array<{
    id: number;
    title: string;
    type: 'lost' | 'found';
    location: string;
    latitude?: number;
    longitude?: number;
    dateOccurred: string;
    category: string;
  }>;
  height?: string;
  showControls?: boolean;
  onItemClick?: (item: any) => void;
}

export default function WorkingGoogleMap({ 
  items = [], 
  height = "400px", 
  showControls = true,
  onItemClick 
}: WorkingGoogleMapProps) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Paris coordinates
  const parisCenter = { lat: 48.8566, lng: 2.3522 };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = async () => {
      try {
        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        // Wait for script to load
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Google Maps script'));
          
          // Only add script if not already loaded
          if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            document.head.appendChild(script);
          } else {
            resolve();
          }
        });

        // Wait for google object to be available
        let attempts = 0;
        while (!window.google && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not available');
        }

        // Initialize map
        const map = new window.google.maps.Map(mapContainerRef.current!, {
          center: parisCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        mapRef.current = map;

        // Add markers for items
        items.forEach((item, index) => {
          // Generate random coordinates around Paris for demo
          const lat = parisCenter.lat + (Math.random() - 0.5) * 0.1;
          const lng = parisCenter.lng + (Math.random() - 0.5) * 0.1;

          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: item.title,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: item.type === 'lost' ? '#ef4444' : '#22c55e',
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px; font-family: system-ui;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${item.title}</h4>
                <div style="margin-bottom: 4px;">
                  <span style="padding: 2px 6px; border-radius: 8px; font-size: 10px; background-color: ${item.type === 'lost' ? '#fef2f2' : '#f0fdf4'}; color: ${item.type === 'lost' ? '#991b1b' : '#166534'};">
                    ${item.type === 'lost' ? 'Perdu' : 'Trouvé'}
                  </span>
                </div>
                <p style="margin: 0; font-size: 12px; color: #666;">${item.location}</p>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">${new Date(item.dateOccurred).toLocaleDateString()}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            if (onItemClick) {
              onItemClick(item);
            }
          });
        });

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(t('map.loadError'));
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [items, onItemClick, t]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerOnUserLocation = () => {
    if (!mapRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapRef.current!.setCenter(userLocation);
          mapRef.current!.setZoom(14);
          
          new window.google.maps.Marker({
            position: userLocation,
            map: mapRef.current!,
            title: t('map.yourLocation'),
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  if (error) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2 font-semibold">{error}</p>
          <p className="text-gray-500 text-sm">Vérifiez votre connexion Internet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <div className="relative">
        <div 
          ref={mapContainerRef}
          style={{ height: isFullscreen ? '100vh' : height }}
          className="w-full"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-700">{t('map.loading')}</p>
              </div>
            </div>
          )}
        </div>
        
        {showControls && (
          <div className="absolute top-4 right-4 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={centerOnUserLocation}
              className="bg-white shadow-md hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 mr-1" />
              {t('map.myLocation')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-white shadow-md hover:bg-gray-50"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
      
      {showControls && !isFullscreen && (
        <CardContent className="p-4 bg-white border-t">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">{t('map.lostItems')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">{t('map.foundItems')}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {items.length} {t('map.totalItems')}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}