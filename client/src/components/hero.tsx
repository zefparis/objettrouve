import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SearchX, SearchCode } from "lucide-react";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/rechercher?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Retrouvez vos objets perdus
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            La plateforme française pour retrouver et restituer les objets perdus. 
            Publiez, recherchez et reconnectez avec vos biens en toute sécurité.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/publier?type=lost"}
            >
              <SearchX className="h-5 w-5 mr-3" />
              J'ai perdu quelque chose
            </Button>
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-secondary text-white hover:bg-green-700"
              onClick={() => window.location.href = "/publier?type=found"}
            >
              <SearchCode className="h-5 w-5 mr-3" />
              J'ai trouvé quelque chose
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Rechercher par objet, lieu, date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 px-6 py-2 rounded-lg"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
