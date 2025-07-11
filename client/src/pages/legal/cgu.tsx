import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";

export default function CGU() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              {t("legal.terms.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* 🇫🇷 Version française */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇫🇷 Conditions Générales d'Utilisation
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Acceptation des conditions</h3>
                  <p>
                    En accédant et en utilisant le site ObjetsTrouvés, vous acceptez d'être lié par ces 
                    Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, 
                    veuillez ne pas utiliser notre service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Description du service</h3>
                  <p>
                    ObjetsTrouvés est une plateforme gratuite permettant aux utilisateurs de :
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Déclarer des objets perdus ou trouvés</li>
                    <li>Rechercher des objets déclarés par d'autres utilisateurs</li>
                    <li>Communiquer avec d'autres utilisateurs via notre système de messagerie</li>
                    <li>Gérer leurs annonces et leur profil</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Inscription et compte utilisateur</h3>
                  <p>
                    Pour utiliser certaines fonctionnalités, vous devez créer un compte en fournissant 
                    des informations exactes et complètes. Vous êtes responsable de la sécurité de votre 
                    compte et de tous les actes accomplis sous votre compte.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Utilisation acceptable</h3>
                  <p>Vous vous engagez à :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Utiliser le service de manière légale et respectueuse</li>
                    <li>Ne pas publier de contenu inapproprié, offensant ou illégal</li>
                    <li>Respecter les droits d'autrui</li>
                    <li>Ne pas utiliser le service à des fins commerciales non autorisées</li>
                    <li>Fournir des informations exactes concernant les objets déclarés</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Contenu utilisateur</h3>
                  <p>
                    Vous conservez vos droits sur le contenu que vous publiez. Cependant, vous nous accordez 
                    une licence non exclusive pour utiliser, reproduire et afficher votre contenu 
                    dans le cadre de notre service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Responsabilité</h3>
                  <p>
                    ObjetsTrouvés agit comme un intermédiaire. Nous ne sommes pas responsables des transactions 
                    entre utilisateurs, de la véracité des annonces ou de la restitution effective des objets. 
                    Chaque utilisateur est responsable de ses actions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Suspension et résiliation</h3>
                  <p>
                    Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation 
                    de ces conditions, sans préavis ni remboursement.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Modifications des conditions</h3>
                  <p>
                    Nous pouvons modifier ces conditions à tout moment. Les modifications seront effectives 
                    dès leur publication sur le site. Votre utilisation continue du service constitue 
                    votre acceptation des modifications.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Droit applicable</h3>
                  <p>
                    Ces conditions sont régies par la loi française. Tout litige sera soumis à la 
                    compétence exclusive des tribunaux français.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇬🇧 English Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇬🇧 Terms of Service
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using the ObjetsTrouvés website, you agree to be bound by these 
                    Terms of Service. If you do not agree to these terms, please do not use our service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Service Description</h3>
                  <p>
                    ObjetsTrouvés is a free platform allowing users to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Report lost or found items</li>
                    <li>Search for items reported by other users</li>
                    <li>Communicate with other users through our messaging system</li>
                    <li>Manage their listings and profile</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Registration and User Account</h3>
                  <p>
                    To use certain features, you must create an account by providing accurate and complete 
                    information. You are responsible for the security of your account and all acts 
                    performed under your account.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Acceptable Use</h3>
                  <p>You agree to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Use the service legally and respectfully</li>
                    <li>Not publish inappropriate, offensive, or illegal content</li>
                    <li>Respect the rights of others</li>
                    <li>Not use the service for unauthorized commercial purposes</li>
                    <li>Provide accurate information about reported items</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. User Content</h3>
                  <p>
                    You retain your rights to the content you post. However, you grant us a non-exclusive 
                    license to use, reproduce and display your content as part of our service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Liability</h3>
                  <p>
                    ObjetsTrouvés acts as an intermediary. We are not responsible for transactions between 
                    users, the accuracy of listings, or the effective return of items. 
                    Each user is responsible for their actions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Suspension and Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate your account in case of violation of 
                    these terms, without notice or refund.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Modification of Terms</h3>
                  <p>
                    We may modify these terms at any time. Changes will be effective upon posting on the site. 
                    Your continued use of the service constitutes your acceptance of the changes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Applicable Law</h3>
                  <p>
                    These terms are governed by French law. Any dispute will be subject to the 
                    exclusive jurisdiction of French courts.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇳🇱 Nederlandse versie */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇳🇱 Algemene Gebruiksvoorwaarden
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Acceptatie van Voorwaarden</h3>
                  <p>
                    Door toegang te krijgen tot en gebruik te maken van de ObjetsTrouvés website, 
                    stemt u ermee in gebonden te zijn aan deze Algemene Gebruiksvoorwaarden. 
                    Als u niet akkoord gaat met deze voorwaarden, gebruik dan onze service niet.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Servicebeschrijving</h3>
                  <p>
                    ObjetsTrouvés is een gratis platform waarmee gebruikers kunnen:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Verloren of gevonden voorwerpen melden</li>
                    <li>Zoeken naar voorwerpen gemeld door andere gebruikers</li>
                    <li>Communiceren met andere gebruikers via ons berichtensysteem</li>
                    <li>Hun advertenties en profiel beheren</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Registratie en Gebruikersaccount</h3>
                  <p>
                    Om bepaalde functies te gebruiken, moet u een account aanmaken door nauwkeurige 
                    en volledige informatie te verstrekken. U bent verantwoordelijk voor de beveiliging 
                    van uw account en alle handelingen die onder uw account worden uitgevoerd.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Acceptabel Gebruik</h3>
                  <p>U stemt ermee in om:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>De service legaal en respectvol te gebruiken</li>
                    <li>Geen ongepaste, beledigende of illegale inhoud te publiceren</li>
                    <li>De rechten van anderen te respecteren</li>
                    <li>De service niet te gebruiken voor ongeautoriseerde commerciële doeleinden</li>
                    <li>Nauwkeurige informatie te verstrekken over gemelde voorwerpen</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Gebruikersinhoud</h3>
                  <p>
                    U behoudt uw rechten op de inhoud die u plaatst. U verleent ons echter een 
                    niet-exclusieve licentie om uw inhoud te gebruiken, reproduceren en weer te geven 
                    als onderdeel van onze service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Aansprakelijkheid</h3>
                  <p>
                    ObjetsTrouvés fungeert als tussenpersoon. We zijn niet verantwoordelijk voor 
                    transacties tussen gebruikers, de nauwkeurigheid van advertenties, of de effectieve 
                    terugkeer van voorwerpen. Elke gebruiker is verantwoordelijk voor zijn acties.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Opschorting en Beëindiging</h3>
                  <p>
                    We behouden ons het recht voor om uw account op te schorten of te beëindigen 
                    in geval van schending van deze voorwaarden, zonder kennisgeving of terugbetaling.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Wijziging van Voorwaarden</h3>
                  <p>
                    We kunnen deze voorwaarden op elk moment wijzigen. Wijzigingen worden van kracht 
                    bij publicatie op de site. Uw voortgezet gebruik van de service vormt uw 
                    acceptatie van de wijzigingen.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Toepasselijk Recht</h3>
                  <p>
                    Deze voorwaarden vallen onder het Franse recht. Elk geschil zal onderworpen zijn 
                    aan de exclusieve bevoegdheid van Franse rechtbanken.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇩🇪 Deutsche Version */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇩🇪 Allgemeine Nutzungsbedingungen
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Annahme der Bedingungen</h3>
                  <p>
                    Durch den Zugriff auf und die Nutzung der ObjetsTrouvés-Website stimmen Sie zu, 
                    an diese Nutzungsbedingungen gebunden zu sein. Wenn Sie diesen Bedingungen nicht 
                    zustimmen, nutzen Sie bitte unseren Service nicht.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Servicebeschreibung</h3>
                  <p>
                    ObjetsTrouvés ist eine kostenlose Plattform, die Benutzern ermöglicht:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Verlorene oder gefundene Gegenstände zu melden</li>
                    <li>Nach von anderen Benutzern gemeldeten Gegenständen zu suchen</li>
                    <li>Mit anderen Benutzern über unser Nachrichtensystem zu kommunizieren</li>
                    <li>Ihre Anzeigen und ihr Profil zu verwalten</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Registrierung und Benutzerkonto</h3>
                  <p>
                    Um bestimmte Funktionen zu nutzen, müssen Sie ein Konto erstellen, indem Sie 
                    genaue und vollständige Informationen bereitstellen. Sie sind für die Sicherheit 
                    Ihres Kontos und alle unter Ihrem Konto durchgeführten Handlungen verantwortlich.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Akzeptable Nutzung</h3>
                  <p>Sie stimmen zu:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Den Service legal und respektvoll zu nutzen</li>
                    <li>Keine unangemessenen, beleidigenden oder illegalen Inhalte zu veröffentlichen</li>
                    <li>Die Rechte anderer zu respektieren</li>
                    <li>Den Service nicht für nicht autorisierte kommerzielle Zwecke zu nutzen</li>
                    <li>Genaue Informationen über gemeldete Gegenstände anzugeben</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Benutzerinhalte</h3>
                  <p>
                    Sie behalten Ihre Rechte an den von Ihnen veröffentlichten Inhalten. Sie gewähren 
                    uns jedoch eine nicht-exklusive Lizenz zur Nutzung, Reproduktion und Anzeige 
                    Ihrer Inhalte als Teil unseres Services.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Haftung</h3>
                  <p>
                    ObjetsTrouvés fungiert als Vermittler. Wir sind nicht verantwortlich für 
                    Transaktionen zwischen Benutzern, die Genauigkeit von Anzeigen oder die 
                    effektive Rückgabe von Gegenständen. Jeder Benutzer ist für seine Handlungen verantwortlich.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Aussetzung und Kündigung</h3>
                  <p>
                    Wir behalten uns das Recht vor, Ihr Konto bei Verletzung dieser Bedingungen 
                    ohne Vorankündigung oder Rückerstattung zu suspendieren oder zu kündigen.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. Änderung der Bedingungen</h3>
                  <p>
                    Wir können diese Bedingungen jederzeit ändern. Änderungen werden mit der 
                    Veröffentlichung auf der Website wirksam. Ihre fortgesetzte Nutzung des Services 
                    stellt Ihre Zustimmung zu den Änderungen dar.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. Anwendbares Recht</h3>
                  <p>
                    Diese Bedingungen unterliegen französischem Recht. Jeder Streitfall unterliegt 
                    der ausschließlichen Gerichtsbarkeit französischer Gerichte.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇨🇳 中文版本 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇨🇳 服务条款
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 接受条款</h3>
                  <p>
                    通过访问和使用ObjetsTrouvés网站，您同意受这些服务条款的约束。
                    如果您不同意这些条款，请不要使用我们的服务。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 服务描述</h3>
                  <p>
                    ObjetsTrouvés是一个免费平台，允许用户：
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>报告丢失或发现的物品</li>
                    <li>搜索其他用户报告的物品</li>
                    <li>通过我们的消息系统与其他用户沟通</li>
                    <li>管理他们的列表和个人资料</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 注册和用户账户</h3>
                  <p>
                    要使用某些功能，您必须通过提供准确和完整的信息来创建账户。
                    您对您账户的安全性以及在您账户下执行的所有行为负责。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 可接受的使用</h3>
                  <p>您同意：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>合法且尊重地使用服务</li>
                    <li>不发布不当、冒犯性或非法内容</li>
                    <li>尊重他人的权利</li>
                    <li>不将服务用于未经授权的商业目的</li>
                    <li>提供关于报告物品的准确信息</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 用户内容</h3>
                  <p>
                    您保留对您发布内容的权利。但是，您授予我们非独家许可，
                    作为我们服务的一部分使用、复制和展示您的内容。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 责任</h3>
                  <p>
                    ObjetsTrouvés作为中介。我们不对用户之间的交易、列表的准确性
                    或物品的有效归还负责。每个用户对自己的行为负责。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. 暂停和终止</h3>
                  <p>
                    我们保留在违反这些条款的情况下暂停或终止您的账户的权利，
                    无需通知或退款。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. 条款修改</h3>
                  <p>
                    我们可以随时修改这些条款。更改将在网站上发布后生效。
                    您继续使用服务即构成您对更改的接受。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. 适用法律</h3>
                  <p>
                    这些条款受法国法律管辖。任何争议都将受法国法院的专属管辖。
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇯🇵 日本語版 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇯🇵 利用規約
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 規約の受諾</h3>
                  <p>
                    ObjetsTrouvésウェブサイトにアクセスし使用することにより、
                    これらの利用規約に拘束されることに同意します。
                    これらの規約に同意しない場合は、サービスを使用しないでください。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. サービスの説明</h3>
                  <p>
                    ObjetsTrouvésは、ユーザーが以下を行うことを可能にする無料プラットフォームです：
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>紛失または発見した物品を報告する</li>
                    <li>他のユーザーによって報告された物品を検索する</li>
                    <li>メッセージシステムを通じて他のユーザーと通信する</li>
                    <li>リストとプロフィールを管理する</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 登録とユーザーアカウント</h3>
                  <p>
                    特定の機能を使用するには、正確で完全な情報を提供してアカウントを作成する必要があります。
                    あなたはアカウントのセキュリティと、アカウントで行われるすべての行為に責任があります。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 利用可能な使用</h3>
                  <p>あなたは以下に同意します：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>サービスを合法的かつ敬意をもって使用する</li>
                    <li>不適切、攻撃的、または違法なコンテンツを公開しない</li>
                    <li>他者の権利を尊重する</li>
                    <li>未承認の商用目的でサービスを使用しない</li>
                    <li>報告した物品について正確な情報を提供する</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. ユーザーコンテンツ</h3>
                  <p>
                    あなたは投稿したコンテンツに対する権利を保持します。
                    ただし、サービスの一部として、コンテンツを使用、複製、表示する非独占的ライセンスを付与します。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 責任</h3>
                  <p>
                    ObjetsTrouvésは仲介者として機能します。ユーザー間の取引、リストの正確性、
                    または物品の効果的な返却について責任を負いません。
                    各ユーザーは自分の行動に責任があります。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. 停止と終了</h3>
                  <p>
                    これらの規約に違反した場合、通知や返金なしにアカウントを停止または終了する権利を留保します。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. 規約の変更</h3>
                  <p>
                    これらの規約はいつでも変更できます。変更はサイト上で公開された時点で有効になります。
                    サービスの継続的な使用は、変更の受諾を構成します。
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. 準拠法</h3>
                  <p>
                    これらの規約はフランス法に準拠します。
                    いかなる紛争もフランスの裁判所の専属管轄に服します。
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 🇰🇷 한국어 버전 */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🇰🇷 서비스 약관
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 약관의 수락</h3>
                  <p>
                    ObjetsTrouvés 웹사이트에 액세스하고 사용함으로써 이러한 서비스 약관에 구속되는 것에 동의합니다.
                    이러한 약관에 동의하지 않는 경우 서비스를 사용하지 마세요.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. 서비스 설명</h3>
                  <p>
                    ObjetsTrouvés는 사용자가 다음을 수행할 수 있는 무료 플랫폼입니다:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>분실되거나 발견된 물품을 신고</li>
                    <li>다른 사용자가 신고한 물품을 검색</li>
                    <li>메시징 시스템을 통해 다른 사용자와 소통</li>
                    <li>목록과 프로필을 관리</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. 등록 및 사용자 계정</h3>
                  <p>
                    특정 기능을 사용하려면 정확하고 완전한 정보를 제공하여 계정을 만들어야 합니다.
                    귀하는 계정의 보안과 계정에서 수행되는 모든 행위에 대해 책임이 있습니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. 허용 가능한 사용</h3>
                  <p>귀하는 다음에 동의합니다:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>서비스를 합법적이고 존중하는 방식으로 사용</li>
                    <li>부적절하거나 공격적이거나 불법적인 콘텐츠를 게시하지 않음</li>
                    <li>다른 사람의 권리를 존중</li>
                    <li>승인되지 않은 상업적 목적으로 서비스를 사용하지 않음</li>
                    <li>신고된 물품에 대한 정확한 정보를 제공</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. 사용자 콘텐츠</h3>
                  <p>
                    귀하는 게시한 콘텐츠에 대한 권리를 보유합니다.
                    그러나 서비스의 일부로 콘텐츠를 사용, 복제 및 표시할 수 있는 비독점적 라이선스를 부여합니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. 책임</h3>
                  <p>
                    ObjetsTrouvés는 중개자 역할을 합니다. 사용자 간의 거래, 목록의 정확성 또는 
                    물품의 효과적인 반환에 대해 책임지지 않습니다.
                    각 사용자는 자신의 행동에 대해 책임을 집니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. 정지 및 종료</h3>
                  <p>
                    이러한 약관을 위반한 경우 통지나 환불 없이 계정을 정지하거나 종료할 권리를 보유합니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">8. 약관 수정</h3>
                  <p>
                    이러한 약관은 언제든지 수정할 수 있습니다. 변경 사항은 사이트에 게시되는 즉시 효력을 발생합니다.
                    서비스의 지속적인 사용은 변경 사항에 대한 수락을 구성합니다.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">9. 준거법</h3>
                  <p>
                    이러한 약관은 프랑스 법의 적용을 받습니다.
                    모든 분쟁은 프랑스 법원의 전속 관할권에 종속됩니다.
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