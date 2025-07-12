import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">ObjetsTrouvés</h3>
            <p className="text-gray-300 mb-4">
              {t("footer.description")}
            </p>
            <div className="text-sm text-gray-400">
              <p>IA-Solution</p>
              <p>Domaine privé du Cap</p>
              <p>Roquebrune-Cap-Martin 06190</p>
              <p>Alpes-Maritimes, France</p>
              <p>Email: contact@ia-solution.fr</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-orange-400 transition-colors">
                  {t("nav.search")}
                </Link>
              </li>
              <li>
                <Link href="/publish" className="hover:text-orange-400 transition-colors">
                  {t("nav.publish")}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-orange-400 transition-colors">
                  {t("nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/mentions-legales" className="hover:text-orange-400 transition-colors">
                  {t("footer.legalNotice")}
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-orange-400 transition-colors">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:text-orange-400 transition-colors">
                  {t("footer.termsOfUse")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-orange-400 transition-colors">
                  Politique relative aux cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 IA-Solution. Tous droits réservés.</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-gray-400 text-sm">
                <p>Conformité RGPD - Hébergé en France</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}