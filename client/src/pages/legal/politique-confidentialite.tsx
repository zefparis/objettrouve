import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              {t("legal.privacy.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* 🇫🇷 Version française */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇫🇷 Politique de Confidentialité
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Responsable du traitement</h3>
                  <p>
                    IA-Solution, société par actions simplifiée, est responsable du traitement des données personnelles 
                    collectées sur le site ObjetsTrouvés. Vous pouvez nous contacter à l'adresse : contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Données collectées</h3>
                  <p>Nous collectons les données suivantes :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Adresse e-mail (obligatoire pour l'authentification)</li>
                    <li>Nom et prénom (facultatif)</li>
                    <li>Numéro de téléphone (facultatif)</li>
                    <li>Géolocalisation approximative des objets déclarés</li>
                    <li>Photos des objets perdus/trouvés</li>
                    <li>Données techniques (adresse IP, navigateur, système d'exploitation)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Finalités du traitement</h3>
                  <p>Vos données sont utilisées pour :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Permettre votre authentification via AWS Cognito</li>
                    <li>Faciliter la mise en relation entre personnes ayant perdu/trouvé des objets</li>
                    <li>Améliorer notre service et l'expérience utilisateur</li>
                    <li>Respecter nos obligations légales</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Base légale</h3>
                  <p>
                    Le traitement de vos données repose sur votre consentement (article 6.1.a du RGPD) 
                    et sur l'exécution d'un contrat (article 6.1.b du RGPD).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Destinataires des données</h3>
                  <p>Vos données peuvent être partagées avec :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS (Amazon Web Services) pour l'authentification et le stockage</li>
                    <li>D'autres utilisateurs de la plateforme (uniquement les données nécessaires à la mise en relation)</li>
                    <li>Les autorités compétentes si la loi l'exige</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Durée de conservation</h3>
                  <p>
                    Vos données sont conservées pendant la durée nécessaire aux finalités du traitement, 
                    et au maximum 3 ans après votre dernière connexion.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Vos droits</h3>
                  <p>Vous disposez des droits suivants :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Droit d'accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l'effacement</li>
                    <li>Droit à la limitation du traitement</li>
                    <li>Droit à la portabilité des données</li>
                    <li>Droit d'opposition</li>
                    <li>Droit de retirer votre consentement</li>
                  </ul>
                  <p className="mt-2">
                    Pour exercer vos droits, contactez-nous à : contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Sécurité des données</h3>
                  <p>
                    Nous mettons en place des mesures techniques et organisationnelles appropriées 
                    pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Réclamations</h3>
                  <p>
                    Vous avez le droit de porter réclamation auprès de la Commission Nationale de l'Informatique 
                    et des Libertés (CNIL) si vous estimez que vos droits ne sont pas respectés.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇬🇧 English Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇬🇧 Privacy Policy
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Data Controller</h3>
                  <p>
                    IA-Solution, a simplified joint-stock company, is responsible for the processing of personal data 
                    collected on the ObjetsTrouvés website. You can contact us at: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Data Collected</h3>
                  <p>We collect the following data:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Email address (mandatory for authentication)</li>
                    <li>First and last name (optional)</li>
                    <li>Phone number (optional)</li>
                    <li>Approximate geolocation of reported items</li>
                    <li>Photos of lost/found items</li>
                    <li>Technical data (IP address, browser, operating system)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Processing Purposes</h3>
                  <p>Your data is used to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Enable your authentication via AWS Cognito</li>
                    <li>Facilitate connections between people who have lost/found items</li>
                    <li>Improve our service and user experience</li>
                    <li>Comply with our legal obligations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Legal Basis</h3>
                  <p>
                    The processing of your data is based on your consent (Article 6.1.a of GDPR) 
                    and on the performance of a contract (Article 6.1.b of GDPR).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Data Recipients</h3>
                  <p>Your data may be shared with:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS (Amazon Web Services) for authentication and storage</li>
                    <li>Other platform users (only data necessary for connection)</li>
                    <li>Competent authorities if required by law</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Retention Period</h3>
                  <p>
                    Your data is kept for the duration necessary for processing purposes, 
                    and for a maximum of 3 years after your last connection.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Your Rights</h3>
                  <p>You have the following rights:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Right of access to your data</li>
                    <li>Right of rectification</li>
                    <li>Right to erasure</li>
                    <li>Right to restriction of processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object</li>
                    <li>Right to withdraw your consent</li>
                  </ul>
                  <p className="mt-2">
                    To exercise your rights, contact us at: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational measures 
                    to protect your data against unauthorized access, alteration, disclosure or destruction.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Complaints</h3>
                  <p>
                    You have the right to file a complaint with the competent data protection authority 
                    if you believe your rights are not being respected.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇳🇱 Nederlandse versie */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇳🇱 Privacybeleid
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Verwerkingsverantwoordelijke</h3>
                  <p>
                    IA-Solution, een vereenvoudigde naamloze vennootschap, is verantwoordelijk voor de verwerking van persoonsgegevens 
                    die worden verzameld op de ObjetsTrouvés website. U kunt contact met ons opnemen via: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Verzamelde Gegevens</h3>
                  <p>Wij verzamelen de volgende gegevens:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>E-mailadres (verplicht voor authenticatie)</li>
                    <li>Voor- en achternaam (optioneel)</li>
                    <li>Telefoonnummer (optioneel)</li>
                    <li>Geschatte geolocatie van gemelde voorwerpen</li>
                    <li>Foto's van verloren/gevonden voorwerpen</li>
                    <li>Technische gegevens (IP-adres, browser, besturingssysteem)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Verwerkingsdoeleinden</h3>
                  <p>Uw gegevens worden gebruikt om:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Uw authenticatie via AWS Cognito mogelijk te maken</li>
                    <li>Verbindingen tussen mensen die voorwerpen hebben verloren/gevonden te faciliteren</li>
                    <li>Onze service en gebruikerservaring te verbeteren</li>
                    <li>Onze wettelijke verplichtingen na te komen</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Rechtsgrondslag</h3>
                  <p>
                    De verwerking van uw gegevens is gebaseerd op uw toestemming (artikel 6.1.a van AVG) 
                    en op de uitvoering van een contract (artikel 6.1.b van AVG).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Ontvangers van Gegevens</h3>
                  <p>Uw gegevens kunnen worden gedeeld met:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS (Amazon Web Services) voor authenticatie en opslag</li>
                    <li>Andere platformgebruikers (alleen gegevens die nodig zijn voor verbinding)</li>
                    <li>Bevoegde autoriteiten indien vereist door de wet</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Bewaartermijn</h3>
                  <p>
                    Uw gegevens worden bewaard voor de duur die nodig is voor verwerkingsdoeleinden, 
                    en voor maximaal 3 jaar na uw laatste verbinding.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Uw Rechten</h3>
                  <p>U heeft de volgende rechten:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Recht op toegang tot uw gegevens</li>
                    <li>Recht op rectificatie</li>
                    <li>Recht op verwijdering</li>
                    <li>Recht op beperking van verwerking</li>
                    <li>Recht op gegevensportabiliteit</li>
                    <li>Recht van bezwaar</li>
                    <li>Recht om uw toestemming in te trekken</li>
                  </ul>
                  <p className="mt-2">
                    Om uw rechten uit te oefenen, neem contact met ons op via: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Gegevensbeveiliging</h3>
                  <p>
                    Wij implementeren passende technische en organisatorische maatregelen 
                    om uw gegevens te beschermen tegen ongeautoriseerde toegang, wijziging, openbaarmaking of vernietiging.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Klachten</h3>
                  <p>
                    U heeft het recht om een klacht in te dienen bij de bevoegde gegevensbeschermingsautoriteit 
                    als u van mening bent dat uw rechten niet worden gerespecteerd.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇩🇪 Deutsche Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇩🇪 Datenschutzerklärung
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Verantwortlicher</h3>
                  <p>
                    IA-Solution, eine vereinfachte Aktiengesellschaft, ist verantwortlich für die Verarbeitung personenbezogener Daten, 
                    die auf der ObjetsTrouvés-Website gesammelt werden. Sie können uns unter folgender Adresse kontaktieren: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Gesammelte Daten</h3>
                  <p>Wir sammeln die folgenden Daten:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>E-Mail-Adresse (erforderlich für die Authentifizierung)</li>
                    <li>Vor- und Nachname (optional)</li>
                    <li>Telefonnummer (optional)</li>
                    <li>Ungefähre Geolokalisierung gemeldeter Gegenstände</li>
                    <li>Fotos von verlorenen/gefundenen Gegenständen</li>
                    <li>Technische Daten (IP-Adresse, Browser, Betriebssystem)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Verarbeitungszwecke</h3>
                  <p>Ihre Daten werden verwendet, um:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Ihre Authentifizierung über AWS Cognito zu ermöglichen</li>
                    <li>Verbindungen zwischen Personen, die Gegenstände verloren/gefunden haben, zu erleichtern</li>
                    <li>Unseren Service und die Benutzererfahrung zu verbessern</li>
                    <li>Unsere rechtlichen Verpflichtungen zu erfüllen</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Rechtsgrundlage</h3>
                  <p>
                    Die Verarbeitung Ihrer Daten basiert auf Ihrer Einwilligung (Artikel 6.1.a DSGVO) 
                    und auf der Durchführung eines Vertrags (Artikel 6.1.b DSGVO).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Datenempfänger</h3>
                  <p>Ihre Daten können geteilt werden mit:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS (Amazon Web Services) für Authentifizierung und Speicherung</li>
                    <li>Anderen Plattformbenutzern (nur Daten, die für die Verbindung erforderlich sind)</li>
                    <li>Zuständigen Behörden, falls gesetzlich erforderlich</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Aufbewahrungsdauer</h3>
                  <p>
                    Ihre Daten werden für die Dauer aufbewahrt, die für die Verarbeitungszwecke erforderlich ist, 
                    und für maximal 3 Jahre nach Ihrer letzten Verbindung.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Ihre Rechte</h3>
                  <p>Sie haben die folgenden Rechte:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Recht auf Zugang zu Ihren Daten</li>
                    <li>Recht auf Berichtigung</li>
                    <li>Recht auf Löschung</li>
                    <li>Recht auf Einschränkung der Verarbeitung</li>
                    <li>Recht auf Datenübertragbarkeit</li>
                    <li>Widerspruchsrecht</li>
                    <li>Recht auf Widerruf Ihrer Einwilligung</li>
                  </ul>
                  <p className="mt-2">
                    Um Ihre Rechte auszuüben, kontaktieren Sie uns unter: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Datensicherheit</h3>
                  <p>
                    Wir implementieren angemessene technische und organisatorische Maßnahmen, 
                    um Ihre Daten vor unbefugtem Zugang, Änderung, Offenlegung oder Zerstörung zu schützen.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Beschwerden</h3>
                  <p>
                    Sie haben das Recht, eine Beschwerde bei der zuständigen Datenschutzbehörde einzureichen, 
                    wenn Sie der Ansicht sind, dass Ihre Rechte nicht respektiert werden.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇨🇳 中文版本 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇨🇳 隐私政策
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 数据控制者</h3>
                  <p>
                    IA-Solution，一家简化股份公司，负责处理在ObjetsTrouvés网站上收集的个人数据。
                    您可以通过以下地址联系我们：contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 收集的数据</h3>
                  <p>我们收集以下数据：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>电子邮件地址（认证必需）</li>
                    <li>姓名（可选）</li>
                    <li>电话号码（可选）</li>
                    <li>报告物品的大致地理位置</li>
                    <li>丢失/发现物品的照片</li>
                    <li>技术数据（IP地址、浏览器、操作系统）</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 处理目的</h3>
                  <p>您的数据用于：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>通过AWS Cognito进行身份验证</li>
                    <li>促进丢失/发现物品的人们之间的联系</li>
                    <li>改善我们的服务和用户体验</li>
                    <li>履行我们的法律义务</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 法律依据</h3>
                  <p>
                    对您数据的处理基于您的同意（GDPR第6.1.a条）
                    和合同的履行（GDPR第6.1.b条）。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 数据接收者</h3>
                  <p>您的数据可能会与以下方面共享：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS（Amazon Web Services）用于身份验证和存储</li>
                    <li>其他平台用户（仅限连接所需的数据）</li>
                    <li>法律要求的主管当局</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 保留期限</h3>
                  <p>
                    您的数据将在处理目的所需的期限内保留，
                    最长不超过您最后一次连接后的3年。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. 您的权利</h3>
                  <p>您拥有以下权利：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>访问您数据的权利</li>
                    <li>更正权</li>
                    <li>删除权</li>
                    <li>限制处理的权利</li>
                    <li>数据可携带权</li>
                    <li>反对权</li>
                    <li>撤回同意的权利</li>
                  </ul>
                  <p className="mt-2">
                    要行使您的权利，请通过以下方式联系我们：contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. 数据安全</h3>
                  <p>
                    我们实施适当的技术和组织措施
                    来保护您的数据免受未经授权的访问、更改、披露或销毁。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. 投诉</h3>
                  <p>
                    如果您认为您的权利没有得到尊重，
                    您有权向主管数据保护机构提出投诉。
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇯🇵 日本語版 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇯🇵 プライバシーポリシー
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. データ管理者</h3>
                  <p>
                    IA-Solution（簡素化株式会社）は、ObjetsTrouvésウェブサイトで収集された個人データの処理に責任を負います。
                    お問い合わせは以下まで：contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 収集データ</h3>
                  <p>以下のデータを収集します：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>メールアドレス（認証に必須）</li>
                    <li>姓名（任意）</li>
                    <li>電話番号（任意）</li>
                    <li>報告された物品のおおよその地理的位置</li>
                    <li>紛失/発見物品の写真</li>
                    <li>技術データ（IPアドレス、ブラウザ、オペレーティングシステム）</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 処理目的</h3>
                  <p>お客様のデータは以下の目的で使用されます：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS Cognitoを介した認証を可能にする</li>
                    <li>物品を紛失/発見した人々の間の連絡を促進する</li>
                    <li>サービスとユーザーエクスペリエンスを改善する</li>
                    <li>法的義務を遵守する</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 法的根拠</h3>
                  <p>
                    お客様のデータの処理は、お客様の同意（GDPR第6.1.a条）
                    および契約の履行（GDPR第6.1.b条）に基づいています。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. データ受信者</h3>
                  <p>お客様のデータは以下と共有される場合があります：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS（Amazon Web Services）認証とストレージ用</li>
                    <li>他のプラットフォームユーザー（接続に必要なデータのみ）</li>
                    <li>法律により義務付けられている場合の管轄当局</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 保存期間</h3>
                  <p>
                    お客様のデータは処理目的に必要な期間保持され、
                    最後の接続から最大3年間保持されます。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. お客様の権利</h3>
                  <p>お客様は以下の権利を有します：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>データへのアクセス権</li>
                    <li>訂正権</li>
                    <li>削除権</li>
                    <li>処理制限権</li>
                    <li>データポータビリティ権</li>
                    <li>異議申し立て権</li>
                    <li>同意撤回権</li>
                  </ul>
                  <p className="mt-2">
                    権利を行使するには、以下までお問い合わせください：contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. データセキュリティ</h3>
                  <p>
                    お客様のデータを不正アクセス、変更、開示、または破壊から保護するために、
                    適切な技術的および組織的措置を実施しています。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. 苦情</h3>
                  <p>
                    お客様の権利が尊重されていないと思われる場合は、
                    管轄データ保護機関に苦情を申し立てる権利があります。
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇰🇷 한국어 버전 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇰🇷 개인정보 보호정책
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 데이터 관리자</h3>
                  <p>
                    IA-Solution(간소화된 주식회사)는 ObjetsTrouvés 웹사이트에서 수집된 개인 데이터의 처리에 대한 책임을 집니다.
                    다음 주소로 문의하실 수 있습니다: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 수집된 데이터</h3>
                  <p>다음 데이터를 수집합니다:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>이메일 주소 (인증에 필수)</li>
                    <li>성명 (선택사항)</li>
                    <li>전화번호 (선택사항)</li>
                    <li>신고된 물품의 대략적인 지리적 위치</li>
                    <li>분실/발견 물품의 사진</li>
                    <li>기술 데이터 (IP 주소, 브라우저, 운영 체제)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 처리 목적</h3>
                  <p>귀하의 데이터는 다음 목적으로 사용됩니다:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS Cognito를 통한 인증 활성화</li>
                    <li>물품을 분실/발견한 사람들 간의 연결 촉진</li>
                    <li>서비스 및 사용자 경험 개선</li>
                    <li>법적 의무 준수</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 법적 근거</h3>
                  <p>
                    귀하의 데이터 처리는 귀하의 동의(GDPR 제6.1.a조)
                    및 계약 이행(GDPR 제6.1.b조)에 기반합니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 데이터 수신자</h3>
                  <p>귀하의 데이터는 다음과 공유될 수 있습니다:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS(Amazon Web Services) 인증 및 저장용</li>
                    <li>다른 플랫폼 사용자 (연결에 필요한 데이터만)</li>
                    <li>법률에 의해 요구되는 경우 관할 당국</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 보존 기간</h3>
                  <p>
                    귀하의 데이터는 처리 목적에 필요한 기간 동안 보존되며,
                    마지막 연결 후 최대 3년 동안 보존됩니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. 귀하의 권리</h3>
                  <p>귀하는 다음 권리를 가집니다:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>데이터 접근권</li>
                    <li>수정권</li>
                    <li>삭제권</li>
                    <li>처리 제한권</li>
                    <li>데이터 이동권</li>
                    <li>이의 제기권</li>
                    <li>동의 철회권</li>
                  </ul>
                  <p className="mt-2">
                    권리를 행사하려면 다음으로 문의하세요: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. 데이터 보안</h3>
                  <p>
                    귀하의 데이터를 무단 액세스, 변경, 공개 또는 파괴로부터 보호하기 위해
                    적절한 기술적 및 조직적 조치를 구현합니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. 불만사항</h3>
                  <p>
                    귀하의 권리가 존중되지 않는다고 생각되면
                    관할 데이터 보호 기관에 불만을 제기할 권리가 있습니다.
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