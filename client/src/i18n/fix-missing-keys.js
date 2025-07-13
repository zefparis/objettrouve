#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Languages supported
const LANGUAGES = ['en', 'es', 'pt', 'it', 'de', 'nl', 'zh', 'ja', 'ko'];

// Missing keys to add automatically
const MISSING_KEYS = {
  'nav.profile': {
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
    it: 'Profilo',
    de: 'Profil',
    nl: 'Profiel',
    zh: '个人资料',
    ja: 'プロフィール',
    ko: '프로필'
  },
  'nav.login': {
    en: 'Login',
    es: 'Iniciar sesión',
    pt: 'Entrar',
    it: 'Accedi',
    de: 'Anmelden',
    nl: 'Inloggen',
    zh: '登录',
    ja: 'ログイン',
    ko: '로그인'
  },
  'nav.logout': {
    en: 'Logout',
    es: 'Cerrar sesión',
    pt: 'Sair',
    it: 'Disconnetti',
    de: 'Abmelden',
    nl: 'Uitloggen',
    zh: '退出',
    ja: 'ログアウト',
    ko: '로그아웃'
  },
  'nav.features': {
    en: 'Features',
    es: 'Características',
    pt: 'Recursos',
    it: 'Funzionalità',
    de: 'Funktionen',
    nl: 'Functies',
    zh: '功能',
    ja: '機能',
    ko: '기능'
  },
  'auth.signUp': {
    en: 'Sign Up',
    es: 'Registrarse',
    pt: 'Cadastrar',
    it: 'Registrati',
    de: 'Registrieren',
    nl: 'Registreren',
    zh: '注册',
    ja: '登録',
    ko: '가입'
  },
  'auth.signIn': {
    en: 'Sign In',
    es: 'Iniciar sesión',
    pt: 'Entrar',
    it: 'Accedi',
    de: 'Anmelden',
    nl: 'Inloggen',
    zh: '登录',
    ja: 'ログイン',
    ko: '로그인'
  },
  'auth.email': {
    en: 'Email',
    es: 'Correo electrónico',
    pt: 'Email',
    it: 'Email',
    de: 'E-Mail',
    nl: 'E-mail',
    zh: '邮箱',
    ja: 'メール',
    ko: '이메일'
  },
  'auth.password': {
    en: 'Password',
    es: 'Contraseña',
    pt: 'Senha',
    it: 'Password',
    de: 'Passwort',
    nl: 'Wachtwoord',
    zh: '密码',
    ja: 'パスワード',
    ko: '비밀번호'
  },
  'auth.firstName': {
    en: 'First Name',
    es: 'Nombre',
    pt: 'Nome',
    it: 'Nome',
    de: 'Vorname',
    nl: 'Voornaam',
    zh: '名字',
    ja: '名前',
    ko: '이름'
  },
  'auth.lastName': {
    en: 'Last Name',
    es: 'Apellido',
    pt: 'Sobrenome',
    it: 'Cognome',
    de: 'Nachname',
    nl: 'Achternaam',
    zh: '姓氏',
    ja: '姓',
    ko: '성'
  },
  'profile.personalInfo': {
    en: 'Personal Information',
    es: 'Información personal',
    pt: 'Informações pessoais',
    it: 'Informazioni personali',
    de: 'Persönliche Informationen',
    nl: 'Persoonlijke informatie',
    zh: '个人信息',
    ja: '個人情報',
    ko: '개인 정보'
  },
  'profile.security': {
    en: 'Security',
    es: 'Seguridad',
    pt: 'Segurança',
    it: 'Sicurezza',
    de: 'Sicherheit',
    nl: 'Beveiliging',
    zh: '安全',
    ja: 'セキュリティ',
    ko: '보안'
  },
  'profile.preferences': {
    en: 'Preferences',
    es: 'Preferencias',
    pt: 'Preferências',
    it: 'Preferenze',
    de: 'Einstellungen',
    nl: 'Voorkeuren',
    zh: '偏好',
    ja: '設定',
    ko: '환경설정'
  },
  'map.loading': {
    en: 'Loading map...',
    es: 'Cargando mapa...',
    pt: 'Carregando mapa...',
    it: 'Caricamento mappa...',
    de: 'Karte wird geladen...',
    nl: 'Kaart laden...',
    zh: '加载地图中...',
    ja: 'マップを読み込み中...',
    ko: '지도 로딩 중...'
  },
  'map.loadError': {
    en: 'Error loading map',
    es: 'Error al cargar el mapa',
    pt: 'Erro ao carregar mapa',
    it: 'Errore nel caricamento della mappa',
    de: 'Fehler beim Laden der Karte',
    nl: 'Fout bij het laden van kaart',
    zh: '地图加载错误',
    ja: 'マップの読み込みエラー',
    ko: '지도 로딩 오류'
  },
  'map.loadErrorDesc': {
    en: 'Could not load the map. Please check your internet connection.',
    es: 'No se pudo cargar el mapa. Verifique su conexión a internet.',
    pt: 'Não foi possível carregar o mapa. Verifique sua conexão com a internet.',
    it: 'Impossibile caricare la mappa. Controlla la connessione internet.',
    de: 'Karte konnte nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung.',
    nl: 'Kon kaart niet laden. Controleer uw internetverbinding.',
    zh: '无法加载地图。请检查您的网络连接。',
    ja: 'マップを読み込めませんでした。インターネット接続を確認してください。',
    ko: '지도를 로드할 수 없습니다. 인터넷 연결을 확인하세요.'
  },
  'map.myLocation': {
    en: 'My Location',
    es: 'Mi ubicación',
    pt: 'Minha localização',
    it: 'La mia posizione',
    de: 'Mein Standort',
    nl: 'Mijn locatie',
    zh: '我的位置',
    ja: '現在地',
    ko: '내 위치'
  },
  'map.yourLocation': {
    en: 'Your Location',
    es: 'Tu ubicación',
    pt: 'Sua localização',
    it: 'La tua posizione',
    de: 'Ihr Standort',
    nl: 'Uw locatie',
    zh: '您的位置',
    ja: 'あなたの場所',
    ko: '당신의 위치'
  },
  'map.totalItems': {
    en: 'Total Items',
    es: 'Elementos totales',
    pt: 'Itens totais',
    it: 'Elementi totali',
    de: 'Gesamtanzahl',
    nl: 'Totale items',
    zh: '总项目',
    ja: '合計アイテム',
    ko: '총 항목'
  },
  'map.viewOnMap': {
    en: 'View on Map',
    es: 'Ver en el mapa',
    pt: 'Ver no mapa',
    it: 'Visualizza sulla mappa',
    de: 'Auf Karte anzeigen',
    nl: 'Bekijk op kaart',
    zh: '在地图上查看',
    ja: 'マップで表示',
    ko: '지도에서 보기'
  },
  'map.centerOnLocation': {
    en: 'Center on Location',
    es: 'Centrar en ubicación',
    pt: 'Centralizar na localização',
    it: 'Centra sulla posizione',
    de: 'Auf Standort zentrieren',
    nl: 'Centreren op locatie',
    zh: '在位置上居中',
    ja: '位置を中心に',
    ko: '위치 중심으로'
  }
};

// Function to set nested value in object
function setNestedValue(obj, key, value) {
  const keys = key.split('.');
  const last = keys.pop();
  const target = keys.reduce((current, part) => {
    if (!current[part]) current[part] = {};
    return current[part];
  }, obj);
  target[last] = value;
}

// Function to read translation file
function readTranslationFile(lang) {
  try {
    const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${lang} file:`, error.message);
    return null;
  }
}

// Function to write translation file
function writeTranslationFile(lang, data) {
  try {
    const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${lang} file:`, error.message);
    return false;
  }
}

console.log('🔧 AUTO-FIX: Adding missing translation keys...\n');

const addedKeys = {};

// Process each language
LANGUAGES.forEach(lang => {
  console.log(`🌍 Processing ${lang.toUpperCase()}...`);
  
  const translations = readTranslationFile(lang);
  if (!translations) {
    console.log(`❌ Skipping ${lang} - file not found`);
    return;
  }
  
  addedKeys[lang] = [];
  
  // Add missing keys
  Object.keys(MISSING_KEYS).forEach(key => {
    const value = MISSING_KEYS[key][lang];
    if (value) {
      setNestedValue(translations, key, value);
      addedKeys[lang].push(key);
    }
  });
  
  // Write back to file
  if (writeTranslationFile(lang, translations)) {
    console.log(`✅ ${lang.toUpperCase()}: ${addedKeys[lang].length} keys added`);
  } else {
    console.log(`❌ ${lang.toUpperCase()}: Failed to write file`);
  }
});

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  totalKeysAdded: Object.keys(MISSING_KEYS).length,
  languagesProcessed: LANGUAGES.length,
  keysByLanguage: addedKeys,
  addedKeys: Object.keys(MISSING_KEYS)
};

// Save report
fs.writeFileSync(
  path.join(__dirname, 'missingKeysReport.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📊 SUMMARY:');
console.log(`✅ Total keys added: ${Object.keys(MISSING_KEYS).length}`);
console.log(`✅ Languages processed: ${LANGUAGES.length}`);
console.log(`📄 Report saved: missingKeysReport.json\n`);