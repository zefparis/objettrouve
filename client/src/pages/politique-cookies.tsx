import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Shield, BarChart3, Users, AlertCircle } from "lucide-react";

export default function PolitiqueCookies() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Politique relative aux cookies
          </h1>
          <p className="text-gray-600">
            Information sur l'utilisation des cookies sur ObjetTrouvé
          </p>
        </div>

        <div className="space-y-6">
          {/* Qu'est-ce qu'un cookie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Qu'est-ce qu'un cookie ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, 
                tablette, smartphone) lors de votre visite sur un site internet. Il permet 
                au site de reconnaître votre navigateur et de mémoriser certaines informations 
                sur votre visite.
              </p>
              <p className="text-gray-600 mt-3">
                Les cookies sont essentiels au fonctionnement d'internet et ne présentent 
                aucun risque pour votre terminal. Ils ne peuvent pas exécuter de programmes 
                ni transmettre de virus.
              </p>
            </CardContent>
          </Card>

          {/* Cookies utilisés */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies utilisés sur ObjetTrouvé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Cookies strictement nécessaires
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.</strong>
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">connect.sid</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Gestion de la session utilisateur et authentification<br />
                        <strong>Durée :</strong> Session (supprimé à la fermeture du navigateur)<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">csrf-token</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Protection contre les attaques CSRF<br />
                        <strong>Durée :</strong> Session<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">language</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Mémorisation de la langue choisie<br />
                        <strong>Durée :</strong> 30 jours<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Cookies de fonctionnalité
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Ces cookies améliorent votre expérience utilisateur mais ne sont pas essentiels.</strong>
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">theme-preference</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Mémorisation du thème (clair/sombre)<br />
                        <strong>Durée :</strong> 90 jours<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">search-filters</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Sauvegarde des filtres de recherche<br />
                        <strong>Durée :</strong> 7 jours<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">map-location</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Mémorisation de la position sur la carte<br />
                        <strong>Durée :</strong> 30 jours<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Cookies d'analyse et performance
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Ces cookies nous aident à comprendre comment vous utilisez le site pour l'améliorer.</strong>
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">_analytics</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Mesure d'audience et analyse du trafic<br />
                        <strong>Durée :</strong> 2 ans<br />
                        <strong>Éditeur :</strong> IA-Solution (analytics interne)
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">performance</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Mesure des performances du site<br />
                        <strong>Durée :</strong> 30 jours<br />
                        <strong>Éditeur :</strong> IA-Solution
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Cookies de services tiers
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Ces cookies proviennent de services externes intégrés au site.</strong>
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">Stripe</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Traitement sécurisé des paiements<br />
                        <strong>Durée :</strong> Variable selon Stripe<br />
                        <strong>Éditeur :</strong> Stripe Inc.<br />
                        <strong>Politique :</strong> 
                        <a href="https://stripe.com/fr/privacy" className="text-blue-600 hover:text-blue-800 ml-1">
                          stripe.com/fr/privacy
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Google Maps</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Affichage des cartes interactives<br />
                        <strong>Durée :</strong> Variable selon Google<br />
                        <strong>Éditeur :</strong> Google LLC<br />
                        <strong>Politique :</strong> 
                        <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800 ml-1">
                          policies.google.com/privacy
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">PayPal</p>
                      <p className="text-sm text-gray-600">
                        <strong>Finalité :</strong> Traitement des paiements PayPal<br />
                        <strong>Durée :</strong> Variable selon PayPal<br />
                        <strong>Éditeur :</strong> PayPal Inc.<br />
                        <strong>Politique :</strong> 
                        <a href="https://www.paypal.com/fr/webapps/mpp/ua/privacy-full" className="text-blue-600 hover:text-blue-800 ml-1">
                          paypal.com/fr/privacy
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gestion de vos cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Paramètres du navigateur</h3>
                <p className="text-gray-600">
                  Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies :
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                  <li><strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
                  <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
                  <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bandeau de consentement</h3>
                <p className="text-gray-600">
                  Lors de votre première visite, un bandeau vous permet de choisir quels 
                  cookies accepter ou refuser. Vous pouvez modifier vos choix à tout moment 
                  en cliquant sur "Paramètres des cookies" en bas de page.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Suppression des cookies</h3>
                <p className="text-gray-600">
                  Vous pouvez supprimer les cookies déjà stockés dans votre navigateur via 
                  les paramètres de celui-ci. Cette action supprimera également vos préférences 
                  et vous devrez les reconfigurer.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conséquences du refus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Conséquences du refus des cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies strictement nécessaires</h3>
                  <p className="text-gray-600">
                    Le refus de ces cookies empêchera le bon fonctionnement du site. 
                    Vous ne pourrez pas vous connecter ni utiliser les fonctionnalités principales.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies de fonctionnalité</h3>
                  <p className="text-gray-600">
                    Le refus de ces cookies n'empêche pas l'utilisation du site mais peut 
                    réduire votre confort d'utilisation (perte des préférences, reconfiguration à chaque visite).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies d'analyse</h3>
                  <p className="text-gray-600">
                    Le refus de ces cookies n'affecte pas votre utilisation du site mais 
                    nous prive d'informations utiles pour améliorer nos services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies et données personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies et données personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Certains cookies peuvent contenir des données personnelles (identifiant de session, 
                préférences utilisateur). Ces données sont traitées conformément à notre 
                <a href="/politique-confidentialite" className="text-blue-600 hover:text-blue-800 ml-1">
                  politique de confidentialité
                </a>.
              </p>
              <p className="text-gray-600 mt-3">
                Vous disposez des mêmes droits sur ces données (accès, rectification, 
                suppression) que pour toutes vos autres données personnelles.
              </p>
            </CardContent>
          </Card>

          {/* Évolution de la politique */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution de cette politique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cette politique cookies peut évoluer, notamment en cas de modification 
                des fonctionnalités du site ou des réglementations applicables. 
                Les modifications importantes vous seront communiquées.
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
                Pour toute question concernant cette politique cookies :
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-gray-600">
                  <strong>Email :</strong> 
                  <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:text-blue-800 ml-1">
                    contact@ia-solution.fr
                  </a>
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