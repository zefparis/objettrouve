import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Cookies() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              Politique relative aux Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* 🇫🇷 Version française */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇫🇷 Politique relative aux Cookies
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Qu'est-ce qu'un cookie ?</h3>
                  <p>
                    Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, mobile) 
                    lors de votre visite sur un site web. Il permet de reconnaître votre navigateur et de 
                    mémoriser certaines informations vous concernant.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Cookies utilisés sur ObjetsTrouvés</h3>
                  <p>Notre site utilise différents types de cookies :</p>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="font-medium">Cookies essentiels (obligatoires)</h4>
                      <p className="text-sm text-gray-600">
                        Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        <li>Cookies de session d'authentification AWS Cognito</li>
                        <li>Cookies de préférences linguistiques</li>
                        <li>Cookies de sécurité CSRF</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Cookies fonctionnels</h4>
                      <p className="text-sm text-gray-600">
                        Ces cookies améliorent l'expérience utilisateur en mémorisant vos préférences.
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        <li>Mémorisation de vos critères de recherche</li>
                        <li>Préférences d'affichage</li>
                        <li>Paramètres de géolocalisation</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Cookies analytiques</h4>
                      <p className="text-sm text-gray-600">
                        Ces cookies nous aident à comprendre comment les visiteurs utilisent le site.
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        <li>Statistiques de fréquentation</li>
                        <li>Analyse du comportement utilisateur</li>
                        <li>Amélioration des performances du site</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Durée de conservation</h3>
                  <p>La durée de conservation des cookies varie selon leur type :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                    <li>Cookies d'authentification : 7 jours maximum</li>
                    <li>Cookies de préférences : 1 an maximum</li>
                    <li>Cookies analytiques : 13 mois maximum</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Vos droits et choix</h3>
                  <p>Vous disposez de plusieurs options pour gérer les cookies :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Accepter ou refuser les cookies via notre bandeau de consentement</li>
                    <li>Configurer votre navigateur pour bloquer ou supprimer les cookies</li>
                    <li>Utiliser le mode navigation privée de votre navigateur</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. AWS et cookies tiers</h3>
                  <p>
                    Notre site utilise AWS Cognito pour l'authentification. AWS peut déposer ses propres cookies 
                    conformément à sa politique de confidentialité. Consultez la politique d'AWS pour plus d'informations.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Configuration des navigateurs</h3>
                  <p>Pour configurer les cookies dans votre navigateur :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Chrome :</strong> Paramètres &rarr; Confidentialité et sécurité &rarr; Cookies</li>
                    <li><strong>Firefox :</strong> Préférences &rarr; Vie privée et sécurité &rarr; Cookies</li>
                    <li><strong>Safari :</strong> Préférences &rarr; Confidentialité &rarr; Cookies</li>
                    <li><strong>Edge :</strong> Paramètres &rarr; Confidentialité &rarr; Cookies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Contact</h3>
                  <p>
                    Pour toute question concernant notre politique de cookies, contactez-nous à : 
                    <strong> contact@ia-solution.fr</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇬🇧 English Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇬🇧 Cookie Policy
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. What is a cookie?</h3>
                  <p>
                    A cookie is a small text file stored on your device (computer, tablet, mobile) 
                    when you visit a website. It allows the website to recognize your browser and 
                    remember certain information about you.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Cookies used on ObjetsTrouvés</h3>
                  <p>Our site uses different types of cookies:</p>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="font-medium">Essential cookies (required)</h4>
                      <p className="text-sm text-gray-600">
                        These cookies are necessary for the site to function and cannot be disabled.
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        <li>AWS Cognito authentication session cookies</li>
                        <li>Language preference cookies</li>
                        <li>CSRF security cookies</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Functional cookies</h4>
                      <p className="text-sm text-gray-600">
                        These cookies improve the user experience by remembering your preferences.
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        <li>Search criteria memorization</li>
                        <li>Display preferences</li>
                        <li>Geolocation settings</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Analytical cookies</h4>
                      <p className="text-sm text-gray-600">
                        These cookies help us understand how visitors use the site.
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        <li>Traffic statistics</li>
                        <li>User behavior analysis</li>
                        <li>Site performance improvement</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Contact</h3>
                  <p>
                    For any questions about our cookie policy, contact us at: 
                    <strong> contact@ia-solution.fr</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>Dernière mise à jour : Janvier 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}