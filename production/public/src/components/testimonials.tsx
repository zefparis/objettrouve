import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

export default function Testimonials() {
  const { t } = useTranslation();
  const testimonials = [
    {
      name: t("testimonials.testimonial1.name"),
      location: t("testimonials.testimonial1.location"),
      content: t("testimonials.testimonial1.content"),
      rating: 5,
    },
    {
      name: t("testimonials.testimonial2.name"),
      location: t("testimonials.testimonial2.location"),
      content: t("testimonials.testimonial2.content"),
      rating: 5,
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("testimonials.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-50 h-full">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mr-3 sm:mr-4">
                    <AvatarFallback className="text-sm sm:text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4 text-sm sm:text-base leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
