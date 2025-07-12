import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Plus, Search, Handshake } from "lucide-react";

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("howItWorks.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                1. {t("howItWorks.step1.title")}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {t("howItWorks.step1.description")}
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                2. {t("howItWorks.step2.title")}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {t("howItWorks.step2.description")}
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                3. {t("howItWorks.step3.title")}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {t("howItWorks.step3.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
