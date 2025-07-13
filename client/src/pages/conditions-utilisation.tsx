import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, CreditCard, Shield } from "lucide-react";

export default function ConditionsUtilisation() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Conditions d'utilisation
          </h1>
          <p className="text-gray-600">
            Règles et conditions régissant l'utilisation du service ObjetTrouvé
          </p>
        </div>

        <div className="space-y-6">
          {/* Acceptation des conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Acceptation des conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                En accédant au site ObjetTrouvé et en utilisant ses services, vous acceptez 
                sans réserve les présentes conditions d'utilisation. Si vous n'acceptez pas 
                ces conditions, vous devez cesser immédiatement d'utiliser le service.
              </p>
              <p className="text-gray-600 mt-3">
                Ces conditions constituent un contrat entre vous et IA-Solution, société 
                éditrice du site ObjetTrouvé.
              </p>
            </CardContent>
          </Card>

          {/* Présentation du service */}
          <Card>
            <CardHeader>
              <CardTitle>Présentation du service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                ObjetTrouvé est une plateforme en ligne permettant aux utilisateurs de :
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
                <li>Publier des annonces d'objets perdus ou trouvés</li>
                <li>Rechercher des objets dans la base de données</li>
                <li>Communiquer avec d'autres utilisateurs via un système de messagerie</li>
                <li>Accéder à des services premium (boost d'annonces, badges vérifiés)</li>
                <li>Géolocaliser les objets sur une carte interactive</li>
              </ul>
              <p className="text-gray-600 mt-3">
                Le service est exclusivement destiné aux utilisateurs résidant en France 
                et respecte la législation française en vigueur.
              </p>
            </CardContent>
          </Card>

          {/* Inscription et compte utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Inscription et compte utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Conditions d'inscription</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Être âgé d'au moins 16 ans</li>
                  <li>Fournir des informations exactes et complètes</li>
                  <li>Maintenir la confidentialité de vos identifiants</li>
                  <li>Résider en France</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Responsabilités</h3>
                <p className="text-gray-600">
                  Vous êtes responsable de toutes les activités réalisées sous votre compte. 
                  Vous devez nous informer immédiatement de toute utilisation non autorisée 
                  de votre compte.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Suspension ou suppression</h3>
                <p className="text-gray-600">
                  Nous nous réservons le droit de suspendre ou supprimer votre compte en cas 
                  de violation des présentes conditions d'utilisation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Utilisation du service */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisation du service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usages autorisés</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Publier des annonces d'objets réellement perdus ou trouvés</li>
                  <li>Rechercher des objets de manière légitime</li>
                  <li>Communiquer de manière respectueuse avec les autres utilisateurs</li>
                  <li>Utiliser les fonctionnalités dans le cadre prévu</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usages interdits</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Publier des annonces frauduleuses ou mensongères</li>
                  <li>Utiliser le service à des fins commerciales non autorisées</li>
                  <li>Harceler, menacer ou insulter d'autres utilisateurs</li>
                  <li>Publier du contenu illégal, offensant ou inapproprié</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Utiliser des bots ou scripts automatisés</li>
                  <li>Collecter des données personnelles d'autres utilisateurs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contenu utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vos responsabilités</h3>
                <p className="text-gray-600">
                  Vous êtes seul responsable du contenu que vous publiez (textes, images, 
                  informations de contact). Vous garantissez que ce contenu :
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li>Est exact et véridique</li>
                  <li>Ne viole aucun droit de propriété intellectuelle</li>
                  <li>N'est pas diffamatoire, obscène ou illégal</li>
                  <li>Ne contient pas de virus ou code malveillant</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Licence d'utilisation</h3>
                <p className="text-gray-600">
                  En publiant du contenu sur ObjetTrouvé, vous nous accordez une licence 
                  non exclusive pour afficher, stocker et traiter ce contenu dans le cadre 
                  du service.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Modération</h3>
                <p className="text-gray-600">
                  Nous nous réservons le droit de modérer, modifier ou supprimer tout contenu 
                  qui ne respecterait pas les présentes conditions ou la législation en vigueur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Services premium */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Services premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description des services</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>Boost d'annonce (1,99€) :</strong> Mise en avant de votre annonce pendant 7 jours</li>
                  <li><strong>Badge vérifié (2,99€) :</strong> Certification de votre profil utilisateur</li>
                  <li><strong>Images supplémentaires (0,50€/image) :</strong> Ajout de photos supplémentaires</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Paiement</h3>
                <p className="text-gray-600">
                  Les paiements sont traités via Stripe et PayPal. Tous les prix sont en euros TTC. 
                  Le paiement est immédiat et non remboursable sauf disposition légale contraire.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Droit de rétractation</h3>
                <p className="text-gray-600">
                  Conformément à l'article L221-28 du Code de la consommation, vous bénéficiez 
                  d'un droit de rétractation de 14 jours pour les services premium, sauf si 
                  l'exécution a commencé avec votre accord préalable.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Propriété intellectuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tous les éléments du site ObjetTrouvé (design, code, logos, textes) sont 
                protégés par les lois sur la propriété intellectuelle. Toute reproduction 
                sans autorisation est interdite.
              </p>
              <p className="text-gray-600 mt-3">
                Les marques, logos et noms de domaine sont la propriété de leurs détenteurs respectifs.
              </p>
            </CardContent>
          </Card>

          {/* Responsabilité et garanties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Responsabilité et garanties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limitation de responsabilité</h3>
                <p className="text-gray-600">
                  ObjetTrouvé est un service d'intermédiation. Nous ne sommes pas responsables :
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li>De l'exactitude des informations publiées par les utilisateurs</li>
                  <li>Des relations entre utilisateurs</li>
                  <li>De la restitution effective des objets</li>
                  <li>Des dommages indirects ou perte de profits</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Disponibilité du service</h3>
                <p className="text-gray-600">
                  Nous nous efforçons d'assurer la disponibilité du service 24h/24 et 7j/7, 
                  mais ne pouvons garantir une absence totale d'interruption.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Force majeure</h3>
                <p className="text-gray-600">
                  Nous ne saurions être tenus responsables des manquements dus à des cas de 
                  force majeure tels que définis par la jurisprudence française.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Résiliation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Résiliation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Résiliation par l'utilisateur :</strong> Vous pouvez supprimer votre 
                  compte à tout moment depuis votre profil ou en nous contactant.
                </p>
                <p className="text-gray-600">
                  <strong>Résiliation par IA-Solution :</strong> Nous pouvons suspendre ou 
                  résilier votre accès en cas de violation des présentes conditions, avec 
                  ou sans préavis selon la gravité.
                </p>
                <p className="text-gray-600">
                  <strong>Effets de la résiliation :</strong> La résiliation entraîne la 
                  suppression de votre compte et de vos données, sous réserve des obligations 
                  légales de conservation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card>
            <CardHeader>
              <CardTitle>Modifications des conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nous nous réservons le droit de modifier les présentes conditions d'utilisation 
                à tout moment. Les modifications importantes vous seront notifiées par email 
                ou via le site.
              </p>
              <p className="text-gray-600 mt-3">
                La poursuite de l'utilisation du service après modification vaut acceptation 
                des nouvelles conditions.
              </p>
            </CardContent>
          </Card>

          {/* Droit applicable */}
          <Card>
            <CardHeader>
              <CardTitle>Droit applicable et litiges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Les présentes conditions d'utilisation sont régies par le droit français. 
                En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
              </p>
              <p className="text-gray-600 mt-3">
                À défaut d'accord amiable, les tribunaux français seront seuls compétents, 
                sous réserve des dispositions légales plus favorables aux consommateurs.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pour toute question concernant ces conditions d'utilisation :
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-gray-600">
                  <strong>Email :</strong> 
                  <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:text-blue-800 ml-1">
                    contact@ia-solution.fr
                  </a>
                </p>
                <p className="text-gray-600">
                  <strong>Téléphone :</strong> +33 620 478 241
                </p>
                <p className="text-gray-600">
                  <strong>Adresse :</strong> IA-Solution - Domaine privé du Cap - 06190 Roquebrune-Cap-Martin
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mise à jour */}
          <Card>
            <CardHeader>
              <CardTitle>Mise à jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                <strong>Version :</strong> 1.0<br />
                <strong>Date d'entrée en vigueur :</strong> 13 juillet 2025<br />
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