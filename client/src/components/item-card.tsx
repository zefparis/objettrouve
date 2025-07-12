import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Search, Plus } from "lucide-react";
import { CATEGORIES } from "@shared/schema";

interface ItemCardProps {
  item: {
    id: number;
    title: string;
    description: string;
    type: 'lost' | 'found';
    category: string;
    location: string;
    dateOccurred: string;
    imageUrl?: string;
    createdAt: string;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  const { t } = useTranslation();
  const category = CATEGORIES.find(c => c.id === item.category);
  const timeAgo = getTimeAgo(item.createdAt);

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      <div className="relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-40 sm:h-48 object-cover"
          />
        ) : (
          <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
            {category && <i className={`${category.icon} text-3xl sm:text-4xl text-gray-400`} />}
          </div>
        )}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <Badge variant={item.type === "lost" ? "destructive" : "secondary"} className="text-xs">
            {item.type === "lost" ? (
              <>
                <Search className="h-3 w-3 mr-1" />
                {t("search.itemType.lost")}
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                {t("search.itemType.found")}
              </>
            )}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {item.description}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 mb-3 gap-1 sm:gap-0">
          <div className="flex items-center sm:mr-4">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full text-sm sm:text-base"
          onClick={() => window.location.href = `/item/${item.id}`}
        >
          {t("common.viewDetails")}
        </Button>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return "Il y a moins d'une heure";
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return "Il y a 1 jour";
    } else if (diffInDays < 30) {
      return `Il y a ${diffInDays} jours`;
    } else {
      return date.toLocaleDateString("fr-FR");
    }
  }
}
