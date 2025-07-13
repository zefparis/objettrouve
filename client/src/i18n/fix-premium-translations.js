import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LANGUAGES = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'zh', 'ja', 'ko'];

// Traductions complètes pour les services premium
const premiumTranslations = {
  fr: {
    "badge": "Services Premium",
    "title": "Optimisez vos recherches",
    "subtitle": "Découvrez nos services premium pour améliorer vos chances de retrouver vos objets",
    "pricing": "Tarification flexible",
    "pricingDesc": "Consultez nos tarifs adaptés à vos besoins",
    "viewPricing": "Voir les tarifs",
    "paymentSystem": "Paiement sécurisé",
    "paymentSystemDesc": "Système de paiement intégré avec Stripe et PayPal",
    "viewCheckout": "Voir le paiement",
    "adminDashboard": "Tableau de bord admin",
    "adminDashboardDesc": "Accès complet aux statistiques et gestion",
    "viewAdmin": "Voir l'admin",
    "paymentConfirm": "Confirmation de paiement",
    "paymentConfirmDesc": "Page de confirmation après achat",
    "viewConfirm": "Voir la confirmation",
    "revenueAnalytics": "Analyses de revenus",
    "revenueAnalyticsDesc": "Statistiques détaillées des revenus",
    "viewAnalytics": "Voir les analyses",
    "apiPayment": "API de paiement",
    "apiPaymentDesc": "Documentation complète de l'API",
    "viewDocs": "Voir la documentation",
    "features": "Fonctionnalités premium",
    "secure": "Sécurisé"
  },
  
  en: {
    "badge": "Premium Services",
    "title": "Optimize your searches",
    "subtitle": "Discover our premium services to improve your chances of finding your items",
    "pricing": "Flexible pricing",
    "pricingDesc": "Check our rates adapted to your needs",
    "viewPricing": "View pricing",
    "paymentSystem": "Secure payment",
    "paymentSystemDesc": "Integrated payment system with Stripe and PayPal",
    "viewCheckout": "View payment",
    "adminDashboard": "Admin dashboard",
    "adminDashboardDesc": "Full access to statistics and management",
    "viewAdmin": "View admin",
    "paymentConfirm": "Payment confirmation",
    "paymentConfirmDesc": "Confirmation page after purchase",
    "viewConfirm": "View confirmation",
    "revenueAnalytics": "Revenue analytics",
    "revenueAnalyticsDesc": "Detailed revenue statistics",
    "viewAnalytics": "View analytics",
    "apiPayment": "Payment API",
    "apiPaymentDesc": "Complete API documentation",
    "viewDocs": "View documentation",
    "features": "Premium features",
    "secure": "Secure"
  },
  
  es: {
    "badge": "Servicios Premium",
    "title": "Optimiza tus búsquedas",
    "subtitle": "Descubre nuestros servicios premium para mejorar tus posibilidades de encontrar tus objetos",
    "pricing": "Precios flexibles",
    "pricingDesc": "Consulta nuestras tarifas adaptadas a tus necesidades",
    "viewPricing": "Ver precios",
    "paymentSystem": "Pago seguro",
    "paymentSystemDesc": "Sistema de pago integrado con Stripe y PayPal",
    "viewCheckout": "Ver pago",
    "adminDashboard": "Panel de administración",
    "adminDashboardDesc": "Acceso completo a estadísticas y gestión",
    "viewAdmin": "Ver admin",
    "paymentConfirm": "Confirmación de pago",
    "paymentConfirmDesc": "Página de confirmación después de la compra",
    "viewConfirm": "Ver confirmación",
    "revenueAnalytics": "Análisis de ingresos",
    "revenueAnalyticsDesc": "Estadísticas detalladas de ingresos",
    "viewAnalytics": "Ver análisis",
    "apiPayment": "API de pago",
    "apiPaymentDesc": "Documentación completa de la API",
    "viewDocs": "Ver documentación",
    "features": "Características premium",
    "secure": "Seguro"
  },
  
  pt: {
    "badge": "Serviços Premium",
    "title": "Otimize suas pesquisas",
    "subtitle": "Descubra nossos serviços premium para melhorar suas chances de encontrar seus objetos",
    "pricing": "Preços flexíveis",
    "pricingDesc": "Consulte nossas tarifas adaptadas às suas necessidades",
    "viewPricing": "Ver preços",
    "paymentSystem": "Pagamento seguro",
    "paymentSystemDesc": "Sistema de pagamento integrado com Stripe e PayPal",
    "viewCheckout": "Ver pagamento",
    "adminDashboard": "Painel de administração",
    "adminDashboardDesc": "Acesso completo a estatísticas e gestão",
    "viewAdmin": "Ver admin",
    "paymentConfirm": "Confirmação de pagamento",
    "paymentConfirmDesc": "Página de confirmação após compra",
    "viewConfirm": "Ver confirmação",
    "revenueAnalytics": "Análise de receita",
    "revenueAnalyticsDesc": "Estatísticas detalhadas de receita",
    "viewAnalytics": "Ver análises",
    "apiPayment": "API de pagamento",
    "apiPaymentDesc": "Documentação completa da API",
    "viewDocs": "Ver documentação",
    "features": "Recursos premium",
    "secure": "Seguro"
  },
  
  it: {
    "badge": "Servizi Premium",
    "title": "Ottimizza le tue ricerche",
    "subtitle": "Scopri i nostri servizi premium per migliorare le tue possibilità di trovare i tuoi oggetti",
    "pricing": "Prezzi flessibili",
    "pricingDesc": "Consulta le nostre tariffe adattate alle tue esigenze",
    "viewPricing": "Vedi prezzi",
    "paymentSystem": "Pagamento sicuro",
    "paymentSystemDesc": "Sistema di pagamento integrato con Stripe e PayPal",
    "viewCheckout": "Vedi pagamento",
    "adminDashboard": "Dashboard admin",
    "adminDashboardDesc": "Accesso completo a statistiche e gestione",
    "viewAdmin": "Vedi admin",
    "paymentConfirm": "Conferma pagamento",
    "paymentConfirmDesc": "Pagina di conferma dopo l'acquisto",
    "viewConfirm": "Vedi conferma",
    "revenueAnalytics": "Analisi ricavi",
    "revenueAnalyticsDesc": "Statistiche dettagliate dei ricavi",
    "viewAnalytics": "Vedi analisi",
    "apiPayment": "API di pagamento",
    "apiPaymentDesc": "Documentazione completa dell'API",
    "viewDocs": "Vedi documentazione",
    "features": "Funzionalità premium",
    "secure": "Sicuro"
  },
  
  de: {
    "badge": "Premium-Services",
    "title": "Optimieren Sie Ihre Suchen",
    "subtitle": "Entdecken Sie unsere Premium-Services, um Ihre Chancen zu verbessern, Ihre Gegenstände zu finden",
    "pricing": "Flexible Preise",
    "pricingDesc": "Schauen Sie sich unsere an Ihre Bedürfnisse angepassten Tarife an",
    "viewPricing": "Preise anzeigen",
    "paymentSystem": "Sichere Zahlung",
    "paymentSystemDesc": "Integriertes Zahlungssystem mit Stripe und PayPal",
    "viewCheckout": "Zahlung anzeigen",
    "adminDashboard": "Admin-Dashboard",
    "adminDashboardDesc": "Vollzugriff auf Statistiken und Verwaltung",
    "viewAdmin": "Admin anzeigen",
    "paymentConfirm": "Zahlungsbestätigung",
    "paymentConfirmDesc": "Bestätigungsseite nach dem Kauf",
    "viewConfirm": "Bestätigung anzeigen",
    "revenueAnalytics": "Umsatzanalyse",
    "revenueAnalyticsDesc": "Detaillierte Umsatzstatistiken",
    "viewAnalytics": "Analyse anzeigen",
    "apiPayment": "Zahlungs-API",
    "apiPaymentDesc": "Vollständige API-Dokumentation",
    "viewDocs": "Dokumentation anzeigen",
    "features": "Premium-Funktionen",
    "secure": "Sicher"
  },
  
  nl: {
    "badge": "Premium Services",
    "title": "Optimaliseer uw zoekopdrachten",
    "subtitle": "Ontdek onze premium services om uw kansen te verbeteren om uw items te vinden",
    "pricing": "Flexibele prijzen",
    "pricingDesc": "Bekijk onze tarieven aangepast aan uw behoeften",
    "viewPricing": "Prijzen bekijken",
    "paymentSystem": "Veilige betaling",
    "paymentSystemDesc": "Geïntegreerd betalingssysteem met Stripe en PayPal",
    "viewCheckout": "Betaling bekijken",
    "adminDashboard": "Admin dashboard",
    "adminDashboardDesc": "Volledige toegang tot statistieken en beheer",
    "viewAdmin": "Admin bekijken",
    "paymentConfirm": "Betalingsbevestiging",
    "paymentConfirmDesc": "Bevestigingspagina na aankoop",
    "viewConfirm": "Bevestiging bekijken",
    "revenueAnalytics": "Inkomstenanalyse",
    "revenueAnalyticsDesc": "Gedetailleerde inkomstenstatistieken",
    "viewAnalytics": "Analyse bekijken",
    "apiPayment": "Betalings-API",
    "apiPaymentDesc": "Volledige API-documentatie",
    "viewDocs": "Documentatie bekijken",
    "features": "Premium functies",
    "secure": "Veilig"
  },
  
  zh: {
    "badge": "高级服务",
    "title": "优化您的搜索",
    "subtitle": "发现我们的高级服务，提高您找到物品的机会",
    "pricing": "灵活定价",
    "pricingDesc": "查看适合您需求的费率",
    "viewPricing": "查看价格",
    "paymentSystem": "安全支付",
    "paymentSystemDesc": "集成Stripe和PayPal的支付系统",
    "viewCheckout": "查看支付",
    "adminDashboard": "管理仪表板",
    "adminDashboardDesc": "完全访问统计数据和管理",
    "viewAdmin": "查看管理",
    "paymentConfirm": "付款确认",
    "paymentConfirmDesc": "购买后的确认页面",
    "viewConfirm": "查看确认",
    "revenueAnalytics": "收入分析",
    "revenueAnalyticsDesc": "详细的收入统计",
    "viewAnalytics": "查看分析",
    "apiPayment": "支付API",
    "apiPaymentDesc": "完整的API文档",
    "viewDocs": "查看文档",
    "features": "高级功能",
    "secure": "安全"
  },
  
  ja: {
    "badge": "プレミアムサービス",
    "title": "検索を最適化",
    "subtitle": "プレミアムサービスを発見して、アイテムを見つける機会を向上させましょう",
    "pricing": "柔軟な価格設定",
    "pricingDesc": "ニーズに合わせた料金をご確認ください",
    "viewPricing": "料金を見る",
    "paymentSystem": "安全な支払い",
    "paymentSystemDesc": "StripeとPayPalを統合した支払いシステム",
    "viewCheckout": "支払いを見る",
    "adminDashboard": "管理ダッシュボード",
    "adminDashboardDesc": "統計と管理への完全なアクセス",
    "viewAdmin": "管理を見る",
    "paymentConfirm": "支払い確認",
    "paymentConfirmDesc": "購入後の確認ページ",
    "viewConfirm": "確認を見る",
    "revenueAnalytics": "収益分析",
    "revenueAnalyticsDesc": "詳細な収益統計",
    "viewAnalytics": "分析を見る",
    "apiPayment": "支払いAPI",
    "apiPaymentDesc": "完全なAPIドキュメント",
    "viewDocs": "ドキュメントを見る",
    "features": "プレミアム機能",
    "secure": "セキュア"
  },
  
  ko: {
    "badge": "프리미엄 서비스",
    "title": "검색을 최적화하세요",
    "subtitle": "프리미엄 서비스를 발견하여 아이템을 찾을 기회를 향상시키세요",
    "pricing": "유연한 가격책정",
    "pricingDesc": "귀하의 필요에 맞는 요금을 확인하세요",
    "viewPricing": "가격 보기",
    "paymentSystem": "안전한 결제",
    "paymentSystemDesc": "Stripe와 PayPal이 통합된 결제 시스템",
    "viewCheckout": "결제 보기",
    "adminDashboard": "관리 대시보드",
    "adminDashboardDesc": "통계 및 관리에 대한 완전한 액세스",
    "viewAdmin": "관리 보기",
    "paymentConfirm": "결제 확인",
    "paymentConfirmDesc": "구매 후 확인 페이지",
    "viewConfirm": "확인 보기",
    "revenueAnalytics": "수익 분석",
    "revenueAnalyticsDesc": "상세한 수익 통계",
    "viewAnalytics": "분석 보기",
    "apiPayment": "결제 API",
    "apiPaymentDesc": "완전한 API 문서",
    "viewDocs": "문서 보기",
    "features": "프리미엄 기능",
    "secure": "보안"
  }
};

// Fonction pour mettre à jour les traductions
function updatePremiumTranslations() {
  console.log('🔄 Mise à jour forcée des traductions services premium...');
  
  LANGUAGES.forEach(lang => {
    const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
    
    try {
      // Lire le fichier existant
      const existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Mettre à jour la section home.premium
      if (!existingContent.home) {
        existingContent.home = {};
      }
      
      existingContent.home.premium = premiumTranslations[lang];
      
      // Écrire le fichier avec un formatage propre
      fs.writeFileSync(filePath, JSON.stringify(existingContent, null, 2) + '\n');
      
      console.log(`✅ ${lang.toUpperCase()}: Traductions services premium mises à jour (${Object.keys(premiumTranslations[lang]).length} clés)`);
      
    } catch (error) {
      console.error(`❌ ${lang.toUpperCase()}: Erreur lors de la mise à jour - ${error.message}`);
    }
  });
  
  console.log('\n🎉 Mise à jour complète des services premium terminée pour toutes les langues!');
  console.log('🔄 Les traductions sont maintenant disponibles dans les 10 langues.');
}

// Exécuter la mise à jour
updatePremiumTranslations();