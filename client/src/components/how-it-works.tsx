import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Handshake } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Retrouvez vos objets perdus en 3 étapes simples
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Déclarez
              </h3>
              <p className="text-gray-600">
                Publiez une annonce avec photo, description et lieu de perte ou de découverte
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Recherchez
              </h3>
              <p className="text-gray-600">
                Parcourez les annonces ou créez des alertes pour être notifié automatiquement
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Reconnectez
              </h3>
              <p className="text-gray-600">
                Contactez le propriétaire via notre chat sécurisé et organisez la restitution
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
