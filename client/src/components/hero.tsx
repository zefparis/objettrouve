import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SearchX, SearchCode } from "lucide-react";

export default function Hero() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-blue-100 max-w-3xl mx-auto px-4">
            {t("hero.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
              onClick={() => window.location.href = "/publish?type=lost"}
            >
              <SearchX className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
              <span className="truncate">{t("hero.iLostSomething")}</span>
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-secondary text-white hover:bg-green-700"
              onClick={() => window.location.href = "/publish?type=found"}
            >
              <SearchCode className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
              <span className="truncate">{t("hero.iFoundSomething")}</span>
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t("hero.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 rounded-xl text-gray-900 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 sm:right-2 sm:top-2 px-3 sm:px-6 py-2 rounded-lg h-auto"
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
