import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";

export default function MentionsLegales() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              {t("legal.mentions.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* 🇫🇷 Version française */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇫🇷 Mentions légales
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Éditeur du site</h3>
                  <p>
                    Le site ObjetsTrouvés est édité par :<br/>
                    <strong>IA-Solution</strong><br/>
                    Société par actions simplifiée<br/>
                    Siège social : France<br/>
                    Email : contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Hébergement</h3>
                  <p>
                    Le site est hébergé par Amazon Web Services (AWS)<br/>
                    Adresse : Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, États-Unis
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Objet du site</h3>
                  <p>
                    ObjetsTrouvés est une plateforme web permettant aux utilisateurs de déclarer des objets perdus ou trouvés, 
                    et de faciliter leur restitution à leurs propriétaires légitimes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Propriété intellectuelle</h3>
                  <p>
                    Tous les contenus présents sur le site ObjetsTrouvés sont protégés par le droit d'auteur. 
                    Toute reproduction, même partielle, est interdite sans autorisation expresse.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Responsabilité</h3>
                  <p>
                    IA-Solution ne peut être tenue responsable des dommages directs ou indirects causés au matériel 
                    de l'utilisateur lors de l'accès au site. L'utilisateur renonce à toute poursuite contre IA-Solution 
                    de ce fait.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Loi applicable</h3>
                  <p>
                    Les présentes mentions légales sont régies par la loi française. 
                    En cas de litige, les tribunaux français seront seuls compétents.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇬🇧 English Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇬🇧 Legal Notice
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Site Publisher</h3>
                  <p>
                    The ObjetsTrouvés website is published by:<br/>
                    <strong>IA-Solution</strong><br/>
                    Simplified joint-stock company<br/>
                    Registered office: France<br/>
                    Email: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Hosting</h3>
                  <p>
                    The site is hosted by Amazon Web Services (AWS)<br/>
                    Address: Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, United States
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Site Purpose</h3>
                  <p>
                    ObjetsTrouvés is a web platform allowing users to report lost or found items, 
                    and facilitate their return to their rightful owners.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Intellectual Property</h3>
                  <p>
                    All content on the ObjetsTrouvés site is protected by copyright. 
                    Any reproduction, even partial, is prohibited without express authorization.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Liability</h3>
                  <p>
                    IA-Solution cannot be held responsible for direct or indirect damages caused to the user's 
                    equipment when accessing the site. The user waives any legal action against IA-Solution 
                    for this reason.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Applicable Law</h3>
                  <p>
                    These legal notices are governed by French law. 
                    In case of dispute, French courts will have sole jurisdiction.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇳🇱 Nederlandse versie */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇳🇱 Juridische Kennisgeving
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Site Uitgever</h3>
                  <p>
                    De ObjetsTrouvés website wordt uitgegeven door:<br/>
                    <strong>IA-Solution</strong><br/>
                    Vereenvoudigde naamloze vennootschap<br/>
                    Geregistreerd kantoor: Frankrijk<br/>
                    E-mail: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Hosting</h3>
                  <p>
                    De site wordt gehost door Amazon Web Services (AWS)<br/>
                    Adres: Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, Verenigde Staten
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Doel van de Site</h3>
                  <p>
                    ObjetsTrouvés is een webplatform waarmee gebruikers verloren of gevonden voorwerpen kunnen melden 
                    en hun terugkeer naar de rechtmatige eigenaren kunnen faciliteren.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Intellectueel Eigendom</h3>
                  <p>
                    Alle inhoud op de ObjetsTrouvés site is beschermd door auteursrecht. 
                    Elke reproductie, zelfs gedeeltelijk, is verboden zonder uitdrukkelijke toestemming.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Aansprakelijkheid</h3>
                  <p>
                    IA-Solution kan niet aansprakelijk worden gesteld voor directe of indirecte schade 
                    aan de apparatuur van de gebruiker bij het openen van de site. De gebruiker doet 
                    afstand van elke juridische actie tegen IA-Solution om deze reden.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Toepasselijk Recht</h3>
                  <p>
                    Deze juridische kennisgevingen vallen onder het Franse recht. 
                    In geval van geschil hebben Franse rechtbanken exclusieve bevoegdheid.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇩🇪 Deutsche Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇩🇪 Impressum
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Herausgeber der Website</h3>
                  <p>
                    Die ObjetsTrouvés-Website wird herausgegeben von:<br/>
                    <strong>IA-Solution</strong><br/>
                    Vereinfachte Aktiengesellschaft<br/>
                    Sitz: Frankreich<br/>
                    E-Mail: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Hosting</h3>
                  <p>
                    Die Website wird gehostet von Amazon Web Services (AWS)<br/>
                    Adresse: Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, Vereinigte Staaten
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Zweck der Website</h3>
                  <p>
                    ObjetsTrouvés ist eine Webplattform, die es Benutzern ermöglicht, verlorene oder gefundene 
                    Gegenstände zu melden und ihre Rückgabe an die rechtmäßigen Eigentümer zu erleichtern.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Geistiges Eigentum</h3>
                  <p>
                    Alle Inhalte auf der ObjetsTrouvés-Website sind urheberrechtlich geschützt. 
                    Jede Reproduktion, auch teilweise, ist ohne ausdrückliche Genehmigung untersagt.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Haftung</h3>
                  <p>
                    IA-Solution kann nicht für direkte oder indirekte Schäden an der Ausrüstung des 
                    Benutzers beim Zugriff auf die Website verantwortlich gemacht werden. Der Benutzer 
                    verzichtet auf jede rechtliche Klage gegen IA-Solution aus diesem Grund.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Anwendbares Recht</h3>
                  <p>
                    Diese Impressumsangaben unterliegen französischem Recht. 
                    Bei Streitigkeiten sind ausschließlich französische Gerichte zuständig.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇨🇳 中文版本 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇨🇳 法律声明
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 网站发布者</h3>
                  <p>
                    ObjetsTrouvés网站由以下机构发布：<br/>
                    <strong>IA-Solution</strong><br/>
                    简化股份公司<br/>
                    注册办公室：法国<br/>
                    邮箱：contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 托管</h3>
                  <p>
                    网站由Amazon Web Services (AWS)托管<br/>
                    地址：Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, 美国
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 网站目的</h3>
                  <p>
                    ObjetsTrouvés是一个网络平台，允许用户报告丢失或找到的物品，
                    并促进其返回给合法所有者。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 知识产权</h3>
                  <p>
                    ObjetsTrouvés网站上的所有内容均受版权保护。
                    未经明确授权，禁止任何形式的复制，即使是部分复制。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 责任</h3>
                  <p>
                    IA-Solution不对用户访问网站时对其设备造成的直接或间接损害承担责任。
                    用户放弃因此对IA-Solution提起的任何法律诉讼。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 适用法律</h3>
                  <p>
                    本法律声明受法国法律管辖。
                    如有争议，法国法院拥有专属管辖权。
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇯🇵 日本語版 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇯🇵 法的通知
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. サイト発行者</h3>
                  <p>
                    ObjetsTrouvésウェブサイトは以下により発行されています：<br/>
                    <strong>IA-Solution</strong><br/>
                    簡素化株式会社<br/>
                    本社所在地：フランス<br/>
                    メール：contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. ホスティング</h3>
                  <p>
                    サイトはAmazon Web Services (AWS)によりホストされています<br/>
                    住所：Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, アメリカ合衆国
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. サイトの目的</h3>
                  <p>
                    ObjetsTrouvésは、ユーザーが紛失または発見した物品を報告し、
                    それらの正当な所有者への返還を促進するウェブプラットフォームです。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 知的財産権</h3>
                  <p>
                    ObjetsTrouvésサイト上のすべてのコンテンツは著作権により保護されています。
                    明示的な許可なしに、部分的であっても複製は禁止されています。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 責任</h3>
                  <p>
                    IA-Solutionは、サイトにアクセスする際のユーザーの機器に対する直接的または
                    間接的な損害について責任を負うことはできません。ユーザーは、この理由による
                    IA-Solutionに対するいかなる法的措置も放棄します。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 適用法</h3>
                  <p>
                    これらの法的通知はフランス法に準拠します。
                    争議の場合、フランスの裁判所が専属管轄権を有します。
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇰🇷 한국어 버전 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇰🇷 법적 고지
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 사이트 발행자</h3>
                  <p>
                    ObjetsTrouvés 웹사이트는 다음에 의해 발행됩니다:<br/>
                    <strong>IA-Solution</strong><br/>
                    간소화된 주식회사<br/>
                    등록 사무소: 프랑스<br/>
                    이메일: contact@ia-solution.fr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 호스팅</h3>
                  <p>
                    사이트는 Amazon Web Services (AWS)에 의해 호스팅됩니다<br/>
                    주소: Amazon Web Services, Inc.<br/>
                    410 Terry Avenue North, Seattle, WA 98109, 미국
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 사이트 목적</h3>
                  <p>
                    ObjetsTrouvés는 사용자가 분실되거나 발견된 물품을 신고하고,
                    정당한 소유자에게 반환하는 것을 용이하게 하는 웹 플랫폼입니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 지적 재산권</h3>
                  <p>
                    ObjetsTrouvés 사이트의 모든 콘텐츠는 저작권으로 보호됩니다.
                    명시적인 허가 없이는 부분적이라도 복제가 금지됩니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 책임</h3>
                  <p>
                    IA-Solution은 사이트에 액세스할 때 사용자의 장비에 발생하는 직접적 또는
                    간접적 손해에 대해 책임을 질 수 없습니다. 사용자는 이러한 이유로
                    IA-Solution에 대한 모든 법적 조치를 포기합니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 적용 법률</h3>
                  <p>
                    이러한 법적 고지는 프랑스 법의 적용을 받습니다.
                    분쟁의 경우, 프랑스 법원이 독점 관할권을 갖습니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>© 2025 IA-Solution. Tous droits réservés.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}