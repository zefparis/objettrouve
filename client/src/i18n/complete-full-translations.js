import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Traductions complètes pour toutes les langues
const fullTranslations = {
  de: {
    "nav": {
      "home": "Startseite",
      "search": "Suchen",
      "publish": "Veröffentlichen",
      "dashboard": "Dashboard",
      "profile": "Profil",
      "chat": "Nachrichten",
      "login": "Anmelden",
      "logout": "Abmelden",
      "features": "Funktionen",
      "howItWorks": "Wie es funktioniert",
      "contact": "Kontakt",
      "pricing": "Preise"
    },
    "common": {
      "back": "Zurück",
      "success": "Erfolgreich",
      "error": "Fehler",
      "loading": "Wird geladen...",
      "cancel": "Abbrechen",
      "save": "Speichern",
      "close": "Schließen",
      "next": "Weiter",
      "previous": "Zurück",
      "viewDetails": "Details anzeigen",
      "noImage": "Kein Bild",
      "unauthorized": "Nicht autorisiert",
      "loginRequired": "Sie müssen angemeldet sein. Weiterleitung..."
    },
    "stats": {
      "totalItems": "Gemeldete Objekte",
      "lostItems": "Verlorene Objekte",
      "foundItems": "Gefundene Objekte",
      "users": "Aktive Benutzer"
    },
    "categories": {
      "title": "Beliebte Kategorien",
      "subtitle": "Suchen Sie nach Objekttyp für einfacheres Finden",
      "electronics": "Elektronik",
      "clothing": "Kleidung",
      "accessories": "Accessoires",
      "documents": "Dokumente",
      "keys": "Schlüssel",
      "jewelry": "Schmuck",
      "bags": "Taschen",
      "sports": "Sport",
      "books": "Bücher",
      "pets": "Tiere",
      "other": "Andere",
      "phones": "Telefone",
      "wallets": "Geldbörsen",
      "glasses": "Brillen",
      "computers": "Computer"
    },
    "search": {
      "title": "Objekte suchen",
      "subtitle": "Finden Sie verlorene oder gefundene Objekte in Ihrer Nähe",
      "filters": "Filter",
      "type": "Typ",
      "all": "Alle",
      "lost": "Verloren",
      "found": "Gefunden",
      "category": "Kategorie",
      "location": "Ort",
      "searchPlaceholder": "Suchen nach Objekt, Ort, Beschreibung...",
      "noResults": "Keine Ergebnisse gefunden",
      "noResultsDesc": "Versuchen Sie, Ihre Suchkriterien zu ändern"
    }
  },
  it: {
    "nav": {
      "home": "Home",
      "search": "Cerca",
      "publish": "Pubblica",
      "dashboard": "Dashboard",
      "profile": "Profilo",
      "chat": "Messaggi",
      "login": "Accedi",
      "logout": "Esci",
      "features": "Funzionalità",
      "howItWorks": "Come funziona",
      "contact": "Contatti",
      "pricing": "Prezzi"
    },
    "common": {
      "back": "Indietro",
      "success": "Successo",
      "error": "Errore",
      "loading": "Caricamento...",
      "cancel": "Annulla",
      "save": "Salva",
      "close": "Chiudi",
      "next": "Avanti",
      "previous": "Precedente",
      "viewDetails": "Vedi dettagli",
      "noImage": "Nessuna immagine",
      "unauthorized": "Non autorizzato",
      "loginRequired": "Devi essere collegato. Reindirizzamento..."
    },
    "stats": {
      "totalItems": "Oggetti dichiarati",
      "lostItems": "Oggetti smarriti",
      "foundItems": "Oggetti trovati",
      "users": "Utenti attivi"
    },
    "categories": {
      "title": "Categorie popolari",
      "subtitle": "Cerca per tipo di oggetto per trovare più facilmente",
      "electronics": "Elettronica",
      "clothing": "Abbigliamento",
      "accessories": "Accessori",
      "documents": "Documenti",
      "keys": "Chiavi",
      "jewelry": "Gioielli",
      "bags": "Borse",
      "sports": "Sport",
      "books": "Libri",
      "pets": "Animali",
      "other": "Altro",
      "phones": "Telefoni",
      "wallets": "Portafogli",
      "glasses": "Occhiali",
      "computers": "Computer"
    },
    "search": {
      "title": "Cerca oggetti",
      "subtitle": "Trova oggetti smarriti o trovati vicino a te",
      "filters": "Filtri",
      "type": "Tipo",
      "all": "Tutti",
      "lost": "Smarriti",
      "found": "Trovati",
      "category": "Categoria",
      "location": "Luogo",
      "searchPlaceholder": "Cerca per oggetto, luogo, descrizione...",
      "noResults": "Nessun risultato trovato",
      "noResultsDesc": "Prova a modificare i tuoi criteri di ricerca"
    }
  },
  nl: {
    "nav": {
      "home": "Home",
      "search": "Zoeken",
      "publish": "Publiceren",
      "dashboard": "Dashboard",
      "profile": "Profiel",
      "chat": "Berichten",
      "login": "Inloggen",
      "logout": "Uitloggen",
      "features": "Functies",
      "howItWorks": "Hoe het werkt",
      "contact": "Contact",
      "pricing": "Prijzen"
    },
    "common": {
      "back": "Terug",
      "success": "Succesvol",
      "error": "Fout",
      "loading": "Laden...",
      "cancel": "Annuleren",
      "save": "Opslaan",
      "close": "Sluiten",
      "next": "Volgende",
      "previous": "Vorige",
      "viewDetails": "Bekijk details",
      "noImage": "Geen afbeelding",
      "unauthorized": "Niet geautoriseerd",
      "loginRequired": "U moet ingelogd zijn. Doorverwijzen..."
    },
    "hero": {
      "title": "Vind uw verloren items",
      "subtitle": "Het Franse referentieplatform om uw verloren items te vinden of uw vondsten te melden",
      "searchPlaceholder": "Zoeken naar een item...",
      "searchButton": "Zoeken",
      "publishButton": "Advertentie plaatsen",
      "iLostSomething": "Ik heb iets verloren",
      "iFoundSomething": "Ik heb iets gevonden"
    },
    "stats": {
      "totalItems": "Gemelde items",
      "lostItems": "Verloren items",
      "foundItems": "Gevonden items",
      "users": "Actieve gebruikers"
    },
    "categories": {
      "title": "Populaire categorieën",
      "subtitle": "Zoek op itemtype om gemakkelijker te vinden",
      "electronics": "Elektronica",
      "clothing": "Kleding",
      "accessories": "Accessoires",
      "documents": "Documenten",
      "keys": "Sleutels",
      "jewelry": "Sieraden",
      "bags": "Tassen",
      "sports": "Sport",
      "books": "Boeken",
      "pets": "Dieren",
      "other": "Overige",
      "phones": "Telefoons",
      "wallets": "Portemonnees",
      "glasses": "Brillen",
      "computers": "Computers"
    },
    "search": {
      "title": "Items zoeken",
      "subtitle": "Vind verloren of gevonden items bij u in de buurt",
      "filters": "Filters",
      "type": "Type",
      "all": "Alle",
      "lost": "Verloren",
      "found": "Gevonden",
      "category": "Categorie",
      "location": "Locatie",
      "searchPlaceholder": "Zoeken op item, locatie, beschrijving...",
      "noResults": "Geen resultaten gevonden",
      "noResultsDesc": "Probeer uw zoekcriteria te wijzigen"
    }
  },
  zh: {
    "nav": {
      "home": "首页",
      "search": "搜索",
      "publish": "发布",
      "dashboard": "仪表板",
      "profile": "个人资料",
      "chat": "消息",
      "login": "登录",
      "logout": "退出",
      "features": "功能",
      "howItWorks": "使用方法",
      "contact": "联系",
      "pricing": "价格"
    },
    "common": {
      "back": "返回",
      "success": "成功",
      "error": "错误",
      "loading": "加载中...",
      "cancel": "取消",
      "save": "保存",
      "close": "关闭",
      "next": "下一步",
      "previous": "上一步",
      "viewDetails": "查看详情",
      "noImage": "无图片",
      "unauthorized": "未授权",
      "loginRequired": "您必须登录。正在重定向..."
    },
    "hero": {
      "title": "找回您的丢失物品",
      "subtitle": "法国参考平台，用于找回您的丢失物品或报告您的发现",
      "searchPlaceholder": "搜索物品...",
      "searchButton": "搜索",
      "publishButton": "发布广告",
      "iLostSomething": "我丢失了东西",
      "iFoundSomething": "我找到了东西"
    },
    "stats": {
      "totalItems": "报告的物品",
      "lostItems": "丢失物品",
      "foundItems": "发现物品",
      "users": "活跃用户"
    },
    "categories": {
      "title": "热门类别",
      "subtitle": "按物品类型搜索，更容易找到",
      "electronics": "电子产品",
      "clothing": "服装",
      "accessories": "配件",
      "documents": "文件",
      "keys": "钥匙",
      "jewelry": "珠宝",
      "bags": "包",
      "sports": "运动",
      "books": "书籍",
      "pets": "宠物",
      "other": "其他",
      "phones": "手机",
      "wallets": "钱包",
      "glasses": "眼镜",
      "computers": "电脑"
    },
    "search": {
      "title": "搜索物品",
      "subtitle": "在您附近找到丢失或发现的物品",
      "filters": "筛选器",
      "type": "类型",
      "all": "全部",
      "lost": "丢失",
      "found": "发现",
      "category": "类别",
      "location": "位置",
      "searchPlaceholder": "按物品、位置、描述搜索...",
      "noResults": "未找到结果",
      "noResultsDesc": "尝试修改您的搜索条件"
    }
  },
  ja: {
    "nav": {
      "home": "ホーム",
      "search": "検索",
      "publish": "投稿",
      "dashboard": "ダッシュボード",
      "profile": "プロフィール",
      "chat": "メッセージ",
      "login": "ログイン",
      "logout": "ログアウト",
      "features": "機能",
      "howItWorks": "使い方",
      "contact": "お問い合わせ",
      "pricing": "料金"
    },
    "common": {
      "back": "戻る",
      "success": "成功",
      "error": "エラー",
      "loading": "読み込み中...",
      "cancel": "キャンセル",
      "save": "保存",
      "close": "閉じる",
      "next": "次へ",
      "previous": "前へ",
      "viewDetails": "詳細を見る",
      "noImage": "画像なし",
      "unauthorized": "権限がありません",
      "loginRequired": "ログインが必要です。リダイレクト中..."
    },
    "hero": {
      "title": "紛失物を見つける",
      "subtitle": "紛失物を見つけたり発見物を報告するためのフランス参考プラットフォーム",
      "searchPlaceholder": "アイテムを検索...",
      "searchButton": "検索",
      "publishButton": "広告を投稿",
      "iLostSomething": "何かを失くしました",
      "iFoundSomething": "何かを見つけました"
    },
    "stats": {
      "totalItems": "報告されたアイテム",
      "lostItems": "紛失物",
      "foundItems": "発見物",
      "users": "アクティブユーザー"
    },
    "categories": {
      "title": "人気のカテゴリ",
      "subtitle": "アイテムタイプで検索してより簡単に見つける",
      "electronics": "電子機器",
      "clothing": "衣類",
      "accessories": "アクセサリー",
      "documents": "書類",
      "keys": "鍵",
      "jewelry": "ジュエリー",
      "bags": "バッグ",
      "sports": "スポーツ",
      "books": "本",
      "pets": "ペット",
      "other": "その他",
      "phones": "電話",
      "wallets": "財布",
      "glasses": "眼鏡",
      "computers": "コンピュータ"
    },
    "search": {
      "title": "アイテムを検索",
      "subtitle": "お近くの紛失・発見物を見つける",
      "filters": "フィルター",
      "type": "タイプ",
      "all": "すべて",
      "lost": "紛失",
      "found": "発見",
      "category": "カテゴリ",
      "location": "場所",
      "searchPlaceholder": "アイテム、場所、説明で検索...",
      "noResults": "結果が見つかりません",
      "noResultsDesc": "検索条件を変更してみてください"
    }
  },
  ko: {
    "nav": {
      "home": "홈",
      "search": "검색",
      "publish": "게시",
      "dashboard": "대시보드",
      "profile": "프로필",
      "chat": "메시지",
      "login": "로그인",
      "logout": "로그아웃",
      "features": "기능",
      "howItWorks": "사용 방법",
      "contact": "연락처",
      "pricing": "가격"
    },
    "common": {
      "back": "뒤로",
      "success": "성공",
      "error": "오류",
      "loading": "로딩 중...",
      "cancel": "취소",
      "save": "저장",
      "close": "닫기",
      "next": "다음",
      "previous": "이전",
      "viewDetails": "세부정보 보기",
      "noImage": "이미지 없음",
      "unauthorized": "권한 없음",
      "loginRequired": "로그인이 필요합니다. 리디렉션 중..."
    },
    "hero": {
      "title": "분실물을 찾아보세요",
      "subtitle": "분실물을 찾거나 발견물을 신고하는 프랑스 참조 플랫폼",
      "searchPlaceholder": "아이템 검색...",
      "searchButton": "검색",
      "publishButton": "광고 게시",
      "iLostSomething": "뭔가를 잃어버렸어요",
      "iFoundSomething": "뭔가를 찾았어요"
    },
    "stats": {
      "totalItems": "신고된 아이템",
      "lostItems": "분실물",
      "foundItems": "발견물",
      "users": "활성 사용자"
    },
    "categories": {
      "title": "인기 카테고리",
      "subtitle": "아이템 유형으로 검색하여 더 쉽게 찾기",
      "electronics": "전자제품",
      "clothing": "의류",
      "accessories": "액세서리",
      "documents": "문서",
      "keys": "열쇠",
      "jewelry": "보석",
      "bags": "가방",
      "sports": "스포츠",
      "books": "책",
      "pets": "애완동물",
      "other": "기타",
      "phones": "전화",
      "wallets": "지갑",
      "glasses": "안경",
      "computers": "컴퓨터"
    },
    "search": {
      "title": "아이템 검색",
      "subtitle": "주변의 분실물과 발견물을 찾아보세요",
      "filters": "필터",
      "type": "유형",
      "all": "모두",
      "lost": "분실",
      "found": "발견",
      "category": "카테고리",
      "location": "위치",
      "searchPlaceholder": "아이템, 위치, 설명으로 검색...",
      "noResults": "결과를 찾을 수 없습니다",
      "noResultsDesc": "검색 조건을 변경해 보세요"
    }
  }
};

// Fonction pour fusionner les traductions
function mergeTranslations(existing, newTranslations) {
  const merged = { ...existing };
  
  for (const [key, value] of Object.entries(newTranslations)) {
    if (typeof value === 'object' && value !== null) {
      merged[key] = mergeTranslations(merged[key] || {}, value);
    } else {
      merged[key] = value;
    }
  }
  
  return merged;
}

// Traiter chaque langue
Object.keys(fullTranslations).forEach(lang => {
  const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const merged = mergeTranslations(existing, fullTranslations[lang]);
  
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
  console.log(`✅ ${lang.toUpperCase()}: Traductions fusionnées`);
});

console.log('✅ Toutes les traductions complètes fusionnées');