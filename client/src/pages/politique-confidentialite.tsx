import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, UserCheck, Mail, AlertCircle } from "lucide-react";

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-gray-600">
            Comment nous collectons, utilisons et protégeons vos données personnelles
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                IA-Solution, éditeur du site ObjetTrouvé, s'engage à protéger votre vie privée 
                et vos données personnelles. Cette politique explique comment nous collectons, 
                utilisons, stockons et protégeons vos informations conformément au Règlement 
                Général sur la Protection des Données (RGPD) et à la loi française.
              </p>
            </CardContent>
          </Card>

          {/* Responsable du traitement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Responsable du traitement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>IA-Solution</strong><br />
                  Domaine privé du Cap<br />
                  Roquebrune-Cap-Martin 06190<br />
                  Alpes-Maritimes, France
                </p>
                <p className="text-gray-600">
                  <strong>Contact :</strong> 
                  <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:text-blue-800 ml-1">
                    contact@ia-solution.fr
                  </a>
                </p>
                <p className="text-gray-600">
                  <strong>Téléphone :</strong> +33 620 478 241
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Données collectées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Données collectées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données d'identification</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Photo de profil (optionnelle)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données d'utilisation</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Adresse IP</li>
                  <li>Données de navigation</li>
                  <li>Historique des actions sur le site</li>
                  <li>Préférences utilisateur</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données d'annonces</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Description des objets perdus/trouvés</li>
                  <li>Photos d'objets</li>
                  <li>Localisation approximative</li>
                  <li>Date de perte/découverte</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Finalités du traitement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Finalités du traitement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fourniture du service</h3>
                  <p className="text-gray-600">
                    Permettre la publication d'annonces, la recherche d'objets perdus/trouvés, 
                    et la mise en relation entre utilisateurs.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des comptes utilisateurs</h3>
                  <p className="text-gray-600">
                    Création, authentification et gestion des profils utilisateurs.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                  <p className="text-gray-600">
                    Envoi d'emails de notification, réponse aux demandes de support.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amélioration du service</h3>
                  <p className="text-gray-600">
                    Analyse des usages pour optimiser l'expérience utilisateur.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base légale */}
          <Card>
            <CardHeader>
              <CardTitle>Base légale du traitement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Exécution d'un contrat :</strong> Fourniture du service ObjetTrouvé
                </p>
                <p className="text-gray-600">
                  <strong>Consentement :</strong> Newsletter, cookies non essentiels
                </p>
                <p className="text-gray-600">
                  <strong>Intérêt légitime :</strong> Amélioration du service, sécurité
                </p>
                <p className="text-gray-600">
                  <strong>Obligation légale :</strong> Conservation des données de facturation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Durée de conservation */}
          <Card>
            <CardHeader>
              <CardTitle>Durée de conservation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Données de compte :</strong> Jusqu'à suppression du compte + 3 ans
                </p>
                <p className="text-gray-600">
                  <strong>Données d'annonces :</strong> Jusqu'à suppression par l'utilisateur + 1 an
                </p>
                <p className="text-gray-600">
                  <strong>Données de paiement :</strong> 10 ans (obligation légale)
                </p>
                <p className="text-gray-600">
                  <strong>Logs de connexion :</strong> 12 mois maximum
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Droits des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Vos droits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Droit d'accès :</strong> Obtenir une copie de vos données
                </p>
                <p className="text-gray-600">
                  <strong>Droit de rectification :</strong> Corriger des données inexactes
                </p>
                <p className="text-gray-600">
                  <strong>Droit à l'effacement :</strong> Supprimer vos données
                </p>
                <p className="text-gray-600">
                  <strong>Droit de portabilité :</strong> Récupérer vos données dans un format structuré
                </p>
                <p className="text-gray-600">
                  <strong>Droit d'opposition :</strong> Vous opposer au traitement
                </p>
                <p className="text-gray-600">
                  <strong>Droit de limitation :</strong> Limiter le traitement de vos données
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données personnelles :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Chiffrement des données sensibles</li>
                  <li>Accès limité aux données personnelles</li>
                  <li>Surveillance des accès</li>
                  <li>Sauvegardes régulières</li>
                  <li>Mise à jour des systèmes de sécurité</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Partage des données */}
          <Card>
            <CardHeader>
              <CardTitle>Partage des données</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nous ne vendons jamais vos données personnelles. Vos données peuvent être 
                partagées uniquement dans les cas suivants :
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
                <li>Avec votre consentement explicite</li>
                <li>Pour répondre à une obligation légale</li>
                <li>Avec nos sous-traitants (hébergement, paiement) sous contrat strict</li>
                <li>En cas de réorganisation d'entreprise (fusion, acquisition)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact et réclamations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact et réclamations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Pour exercer vos droits ou pour toute question concernant cette politique :
                </p>
                <p className="text-gray-600">
                  <strong>Email :</strong> 
                  <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:text-blue-800 ml-1">
                    contact@ia-solution.fr
                  </a>
                </p>
                <p className="text-gray-600">
                  <strong>Courrier :</strong> IA-Solution - Domaine privé du Cap - 06190 Roquebrune-Cap-Martin
                </p>
                <p className="text-gray-600 bg-yellow-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Vous avez également le droit de déposer une réclamation auprès de la CNIL 
                  (Commission Nationale de l'Informatique et des Libertés) sur 
                  <a href="https://www.cnil.fr" className="text-blue-600 hover:text-blue-800 ml-1">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mise à jour */}
          <Card>
            <CardHeader>
              <CardTitle>Mise à jour de cette politique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cette politique de confidentialité peut être mise à jour. Nous vous informerons 
                de tout changement significatif par email ou via le site.
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