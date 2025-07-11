import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const category = CATEGORIES.find(c => c.id === item.category);
  const timeAgo = getTimeAgo(item.createdAt);

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            {category && <i className={`${category.icon} text-4xl text-gray-400`} />}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={item.type === "lost" ? "destructive" : "secondary"}>
            {item.type === "lost" ? (
              <>
                <Search className="h-3 w-3 mr-1" />
                Perdu
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Trouvé
              </>
            )}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="mr-4">{item.location}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{timeAgo}</span>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = `/annonce/${item.id}`}
        >
          Voir les détails
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
