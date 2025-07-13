import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Phone, Building } from "lucide-react";

export default function MentionsLegales() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mentions légales
          </h1>
          <p className="text-gray-600">
            Informations légales relatives au site ObjetTrouvé
          </p>
        </div>

        <div className="space-y-6">
          {/* Éditeur du site */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Éditeur du site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">IA-Solution</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Domaine privé du Cap<br />
                      Roquebrune-Cap-Martin 06190<br />
                      Alpes-Maritimes, France
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:text-blue-800">
                      contact@ia-solution.fr
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href="tel:+33620478241" className="text-blue-600 hover:text-blue-800">
                      +33 620 478 241
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hébergement */}
          <Card>
            <CardHeader>
              <CardTitle>Hébergement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ce site est hébergé par Replit, Inc.<br />
                767 Bryant Street<br />
                San Francisco, CA 94107<br />
                États-Unis
              </p>
            </CardContent>
          </Card>

          {/* Objet du site */}
          <Card>
            <CardHeader>
              <CardTitle>Objet du site</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                ObjetTrouvé est une plateforme numérique permettant la mise en relation entre 
                personnes ayant perdu des objets et personnes les ayant trouvés. Le service 
                s'adresse exclusivement aux utilisateurs situés en France et est conforme 
                aux réglementations françaises en vigueur.
              </p>
            </CardContent>
          </Card>

          {/* Propriété intellectuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, 
                sons, logiciels, etc.) est protégé par les lois françaises et internationales 
                relatives à la propriété intellectuelle.
              </p>
              <p className="text-gray-600">
                Toute reproduction, représentation, modification, publication, transmission, 
                dénaturation, totale ou partielle du site ou de son contenu, par quelque 
                procédé que ce soit, et sur quelque support que ce soit, est interdite sans 
                autorisation expresse préalable de IA-Solution.
              </p>
            </CardContent>
          </Card>

          {/* Responsabilité */}
          <Card>
            <CardHeader>
              <CardTitle>Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                IA-Solution s'efforce de fournir des informations exactes et à jour sur le site 
                ObjetTrouvé. Cependant, nous ne pouvons garantir l'exactitude, la complétude 
                ou l'actualité des informations mises à disposition.
              </p>
              <p className="text-gray-600">
                IA-Solution ne pourra être tenu responsable des dommages directs ou indirects 
                résultant de l'utilisation du site ou de l'impossibilité d'y accéder.
              </p>
              <p className="text-gray-600">
                Les utilisateurs sont responsables de l'exactitude des informations qu'ils 
                publient et s'engagent à respecter la législation française en vigueur.
              </p>
            </CardContent>
          </Card>

          {/* Données personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Données personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, 
                aux fichiers et aux libertés, modifiée par la loi n° 2004-801 du 6 août 2004 
                et au Règlement Général sur la Protection des Données (RGPD), vous bénéficiez 
                d'un droit d'accès, de rectification, de portabilité et d'effacement de vos 
                données personnelles.
              </p>
              <p className="text-gray-600 mt-4">
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse : 
                <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:text-blue-800 ml-1">
                  contact@ia-solution.fr
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Droit applicable */}
          <Card>
            <CardHeader>
              <CardTitle>Droit applicable et juridiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Les présentes mentions légales sont soumises au droit français. 
                En cas de litige, et à défaut de résolution amiable, les tribunaux 
                français seront seuls compétents.
              </p>
            </CardContent>
          </Card>

          {/* Mise à jour */}
          <Card>
            <CardHeader>
              <CardTitle>Mise à jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Les présentes mentions légales peuvent être modifiées à tout moment. 
                La version en vigueur est celle accessible en ligne à l'adresse du site.
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Dernière mise à jour :</strong> 13 juillet 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}