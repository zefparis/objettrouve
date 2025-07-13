import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/navbar";
import ItemCard from "@/components/item-card";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, MapPin, ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@shared/schema";

export default function Search() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  
  // Get URL params
  const urlParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(urlParams.get("search") || "");
  const [selectedType, setSelectedType] = useState<string>(urlParams.get("type") || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(urlParams.get("category") || "all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["/api/items", { search, type: selectedType, category: selectedCategory }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      params.append("limit", "50");
      
      const response = await fetch(`/api/items?${params}`);
      return response.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to the dependency array
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("search.title")}
          </h1>
          <p className="text-gray-600">
            {t("search.subtitle")}
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={t("search.searchPlaceholder")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder={t("search.typeFilter")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.allTypes")}</SelectItem>
                    <SelectItem value="lost">{t("search.itemType.lost")}</SelectItem>
                    <SelectItem value="found">{t("search.itemType.found")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder={t("search.categoryFilter")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.allCategories")}</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <i className={`${category.icon} mr-2`} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Button type="submit" className="w-full md:w-auto">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  {t("search.searchButton")}
                </Button>
                {(search || selectedType !== "all" || selectedCategory !== "all") && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={() => {
                      setSearch("");
                      setSelectedType("all");
                      setSelectedCategory("all");
                    }}
                  >
                    {t("search.clearFilters")}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? t("search.loading") : t("search.resultsCount", { count: items?.length || 0 })}
            </h2>
            <div className="flex gap-2">
              {selectedType !== "all" && (
                <Badge variant="secondary">
                  {t("search.typeFilter")}: {selectedType === "lost" ? t("search.itemType.lost") : t("search.itemType.found")}
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary">
                  {t("search.categoryFilter")}: {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </Badge>
              )}
              {search && (
                <Badge variant="secondary">
                  {t("search.keywords")}: "{search}"
                </Badge>
              )}
            </div>
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
            <div className="col-span-full text-center py-12">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("search.noResults")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("search.noResultsDesc")}
              </p>
              {(search || selectedType !== "all" || selectedCategory !== "all") && (
                <Button onClick={() => {
                  setSearch("");
                  setSelectedType("all");
                  setSelectedCategory("all");
                }}>
                  {t("search.clearFilters")}
                </Button>
              )}
              
              {/* Search Tips */}
              <div className="mt-8 max-w-md mx-auto">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  {t("search.searchTips")}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t("search.tip1")}</li>
                  <li>• {t("search.tip2")}</li>
                  <li>• {t("search.tip3")}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
