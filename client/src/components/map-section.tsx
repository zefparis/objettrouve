import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Map } from "lucide-react";

export default function MapSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Carte interactive
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visualisez les objets perdus et trouvés près de chez vous
          </p>
        </div>
        
        <Card className="shadow-lg overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
            <div className="text-center">
              <Map className="h-16 w-16 text-primary mx-auto mb-4" />
              <p className="text-gray-700 text-lg mb-2">
                Carte interactive avec géolocalisation
              </p>
              <p className="text-gray-500 text-sm">
                Intégration avec Google Maps ou OpenStreetMap
              </p>
            </div>
            
            {/* Mock map markers */}
            <div className="absolute top-16 left-16 w-4 h-4 bg-accent rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute top-32 right-32 w-4 h-4 bg-secondary rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute bottom-24 left-1/3 w-4 h-4 bg-accent rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-4 h-4 bg-secondary rounded-full shadow-lg animate-pulse"></div>
          </div>
          
          <CardContent className="p-6 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Objets perdus</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Objets trouvés</span>
                </div>
              </div>
              <Button variant="outline">
                Voir en plein écran
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
