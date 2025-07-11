import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <Search className="inline h-5 w-5 text-primary mr-2" />
              ObjetsTrouvés
            </h3>
            <p className="text-gray-400 mb-4">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("nav.features")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/publier" className="hover:text-white transition-colors">
                  {t("nav.publish")}
                </Link>
              </li>
              <li>
                <Link href="/rechercher" className="hover:text-white transition-colors">
                  {t("nav.search")}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.interactiveMap")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.emailAlerts")}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  {t("nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("footer.links.contact")}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.faq")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.reportIssue")}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.legalNotice")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.links.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.links.terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.cookies")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ObjetsTrouvés. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
