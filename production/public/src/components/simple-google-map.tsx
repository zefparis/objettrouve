import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize2, Minimize2, AlertCircle } from "lucide-react";

interface SimpleGoogleMapProps {
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

export default function SimpleGoogleMap({ 
  items = [], 
  height = "400px", 
  showControls = true,
  onItemClick 
}: SimpleGoogleMapProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Coordonnées par défaut pour Paris, France
  const defaultCenter = { lat: 48.8566, lng: 2.3522 };

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();
        
        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          scaleControl: true,
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de Google Maps:', error);
        setError(t('map.loadError'));
        setIsLoading(false);
      }
    };

    initMap();
  }, [t]);

  // Gérer les marqueurs
  useEffect(() => {
    if (!map) return;

    // Nettoyer les marqueurs existants
    markers.forEach(marker => {
      marker.setMap(null);
    });
    setMarkers([]);

    if (items.length === 0) return;

    const newMarkers: google.maps.Marker[] = [];

    items.forEach((item) => {
      // Générer des coordonnées aléatoires autour de Paris pour la démo
      const lat = defaultCenter.lat + (Math.random() - 0.5) * 0.1;
      const lng = defaultCenter.lng + (Math.random() - 0.5) * 0.1;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: item.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: item.type === 'lost' ? '#ef4444' : '#22c55e',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: 600; color: #111827; margin: 0 0 8px 0; font-size: 16px;">${item.title}</h3>
            <div style="margin-bottom: 8px;">
              <span style="padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; ${
                item.type === 'lost' 
                  ? 'background-color: #fef2f2; color: #991b1b;' 
                  : 'background-color: #f0fdf4; color: #166534;'
              }">
                ${item.type === 'lost' ? 'Perdu' : 'Trouvé'}
              </span>
            </div>
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 8px 0;">${item.location}</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">${new Date(item.dateOccurred).toLocaleDateString()}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, items]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerOnUserLocation = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(userLocation);
          map.setZoom(14);
          
          // Ajouter un marqueur pour la position de l'utilisateur
          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: t('map.yourLocation'),
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
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
          <p className="text-gray-500 text-sm">{t('map.loadErrorDesc')}</p>
          <p className="text-xs text-gray-400 mt-2">
            API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Configurée' : '❌ Manquante'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <div 
        ref={mapRef}
        style={{ height: isFullscreen ? '100vh' : height }}
        className="w-full relative"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-700">{t('map.loading')}</p>
            </div>
          </div>
        )}
        
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