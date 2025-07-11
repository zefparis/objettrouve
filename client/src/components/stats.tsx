import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

export default function Stats() {
  const { t } = useTranslation();
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
  });

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stats?.totalItems?.toLocaleString("fr-FR") || "0"}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{t("stats.totalItems")}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2">
                {stats?.foundItems?.toLocaleString("fr-FR") || "0"}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{t("stats.foundItems")}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mb-2">
                {stats?.users?.toLocaleString("fr-FR") || "0"}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{t("stats.users")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
