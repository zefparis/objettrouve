import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Stats from "@/components/stats";
import ItemCard from "@/components/item-card";
import HowItWorks from "@/components/how-it-works";
import MapSection from "@/components/map-section";
import Testimonials from "@/components/testimonials";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

export default function Landing() {
  const { data: items, isLoading } = useQuery({
    queryKey: ["/api/items"],
    queryFn: async () => {
      const response = await fetch("/api/items?limit=6");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Stats />
      
      {/* Recent Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Objets récemment déclarés
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les derniers objets perdus et trouvés dans votre région
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-sm">
              <Button variant="default" className="px-6 py-2 rounded-lg">
                Tous
              </Button>
              <Button variant="ghost" className="px-6 py-2 rounded-lg">
                Objets perdus
              </Button>
              <Button variant="ghost" className="px-6 py-2 rounded-lg">
                Objets trouvés
              </Button>
            </div>
          </div>
          
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : items && items.length > 0 ? (
              items.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Aucun objet déclaré pour le moment</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="px-8 py-3">
              Voir tous les objets
            </Button>
          </div>
        </div>
      </section>

      <HowItWorks />
      <MapSection />
      <Testimonials />
      <Categories />
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à retrouver vos objets ?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à ObjetsTrouvés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-8 py-3"
              onClick={() => window.location.href = "/api/login"}
            >
              Créer un compte gratuit
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-primary"
            >
              Publier une annonce
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
