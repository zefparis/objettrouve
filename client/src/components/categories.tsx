import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@shared/schema";

export default function Categories() {
  const { t } = useTranslation();
  const { data: categoryStats } = useQuery({
    queryKey: ["/api/categories/stats"],
    queryFn: async () => {
      const response = await fetch("/api/categories/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch category stats");
      }
      return response.json();
    },
  });

  const getItemCount = (categoryId: string) => {
    return categoryStats?.find((stat: any) => stat.category === categoryId)?.count || 0;
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t("categories.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("categories.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              onClick={() => window.location.href = `/search?category=${category.id}`}
            >
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <i className={`${category.icon} text-white text-sm sm:text-base lg:text-xl`} />
                </div>
                <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-1">
                  {t(`categories.${category.id}`)}
                </h3>
                <p className="text-gray-500 text-xs">
                  {getItemCount(category.id)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
