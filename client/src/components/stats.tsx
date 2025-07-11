import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function Stats() {
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
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {stats?.totalItems?.toLocaleString("fr-FR") || "0"}
              </div>
              <p className="text-gray-600">Objets déclarés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">
                {stats?.foundItems?.toLocaleString("fr-FR") || "0"}
              </div>
              <p className="text-gray-600">Objets trouvés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-accent mb-2">
                {stats?.users?.toLocaleString("fr-FR") || "0"}
              </div>
              <p className="text-gray-600">Utilisateurs actifs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
