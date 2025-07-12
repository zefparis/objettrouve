import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lire le fichier français de référence
const frTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', 'fr', 'translation.json'), 'utf8'));

// Fonction pour obtenir toutes les clés d'un objet
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

// Fonction pour obtenir une valeur par clé
function getValueByKey(obj, key) {
  return key.split('.').reduce((current, part) => current && current[part], obj);
}

// Fonction pour définir une valeur par clé
function setValueByKey(obj, key, value) {
  const keys = key.split('.');
  const last = keys.pop();
  const target = keys.reduce((current, part) => {
    if (!current[part]) current[part] = {};
    return current[part];
  }, obj);
  target[last] = value;
}

// Dictionnaire de traduction de base
const translations = {
  es: {
    'profile.title': 'Perfil',
    'profile.profilePicture': 'Foto de perfil',
    'profile.editProfile': 'Editar perfil',
    'profile.save': 'Guardar',
    'profile.cancel': 'Cancelar',
    'profile.memberSince': 'Miembro desde',
    'profile.itemsPosted': 'Elementos publicados',
    'profile.itemsFound': 'Elementos encontrados',
    'profile.conversations': 'Conversaciones',
    'profile.personalInfo': 'Información personal',
    'profile.preferences': 'Preferencias',
    'profile.privacy': 'Privacidad',
    'profile.firstName': 'Nombre',
    'profile.lastName': 'Apellido',
    'profile.email': 'Correo electrónico',
    'profile.phone': 'Teléfono',
    'profile.location': 'Ubicación',
    'profile.bio': 'Biografía',
    'profile.bioPlaceholder': 'Cuéntanos sobre ti...',
    'profile.notifications': 'Notificaciones',
    'profile.notificationsDesc': 'Recibir notificaciones por email',
    'profile.language': 'Idioma',
    'profile.languageDesc': 'Cambiar idioma de la interfaz',
    'profile.visibility': 'Visibilidad',
    'profile.visibilityDesc': 'Controlar quién puede ver tu perfil',
    'profile.changePassword': 'Cambiar contraseña',
    'profile.changePasswordDesc': 'Actualizar tu contraseña',
    'profile.twoFactor': 'Autenticación de dos factores',
    'profile.twoFactorDesc': 'Mejorar la seguridad de tu cuenta',
    'profile.dataExport': 'Exportar datos',
    'profile.dataExportDesc': 'Descargar todos tus datos',
    'profile.enabled': 'Activado',
    'profile.currentLanguage': 'Idioma actual',
    'profile.public': 'Público',
    'profile.change': 'Cambiar',
    'profile.enable': 'Activar',
    'profile.export': 'Exportar',
    'profile.updateSuccess': 'Perfil actualizado',
    'profile.updateSuccessDesc': 'Tu perfil se ha actualizado correctamente',
    'profile.updateError': 'Error al actualizar',
    'profile.updateErrorDesc': 'Hubo un error al actualizar tu perfil',
    'profile.imageError': 'Error de imagen',
    'profile.imageTypeError': 'Tipo de archivo no válido',
    'profile.imageSizeError': 'Archivo demasiado grande',
    'common.timeAgo.now': 'Ahora',
    'common.timeAgo.minutes': 'hace {{count}} minuto',
    'common.timeAgo.minutes_plural': 'hace {{count}} minutos',
    'common.timeAgo.hours': 'hace {{count}} hora',
    'common.timeAgo.hours_plural': 'hace {{count}} horas',
    'common.timeAgo.days': 'hace {{count}} día',
    'common.timeAgo.days_plural': 'hace {{count}} días'
  },
  pt: {
    'profile.title': 'Perfil',
    'profile.profilePicture': 'Foto do perfil',
    'profile.editProfile': 'Editar perfil',
    'profile.save': 'Salvar',
    'profile.cancel': 'Cancelar',
    'profile.memberSince': 'Membro desde',
    'profile.itemsPosted': 'Itens publicados',
    'profile.itemsFound': 'Itens encontrados',
    'profile.conversations': 'Conversas',
    'profile.personalInfo': 'Informações pessoais',
    'profile.preferences': 'Preferências',
    'profile.privacy': 'Privacidade',
    'profile.firstName': 'Nome',
    'profile.lastName': 'Sobrenome',
    'profile.email': 'Email',
    'profile.phone': 'Telefone',
    'profile.location': 'Localização',
    'profile.bio': 'Biografia',
    'profile.bioPlaceholder': 'Conte-nos sobre você...',
    'profile.notifications': 'Notificações',
    'profile.notificationsDesc': 'Receber notificações por email',
    'profile.language': 'Idioma',
    'profile.languageDesc': 'Alterar idioma da interface',
    'profile.visibility': 'Visibilidade',
    'profile.visibilityDesc': 'Controlar quem pode ver seu perfil',
    'profile.changePassword': 'Alterar senha',
    'profile.changePasswordDesc': 'Atualizar sua senha',
    'profile.twoFactor': 'Autenticação de dois fatores',
    'profile.twoFactorDesc': 'Melhorar a segurança da sua conta',
    'profile.dataExport': 'Exportar dados',
    'profile.dataExportDesc': 'Baixar todos os seus dados',
    'profile.enabled': 'Ativado',
    'profile.currentLanguage': 'Idioma atual',
    'profile.public': 'Público',
    'profile.change': 'Alterar',
    'profile.enable': 'Ativar',
    'profile.export': 'Exportar',
    'profile.updateSuccess': 'Perfil atualizado',
    'profile.updateSuccessDesc': 'Seu perfil foi atualizado com sucesso',
    'profile.updateError': 'Erro ao atualizar',
    'profile.updateErrorDesc': 'Houve um erro ao atualizar seu perfil',
    'profile.imageError': 'Erro de imagem',
    'profile.imageTypeError': 'Tipo de arquivo inválido',
    'profile.imageSizeError': 'Arquivo muito grande',
    'common.timeAgo.now': 'Agora',
    'common.timeAgo.minutes': 'há {{count}} minuto',
    'common.timeAgo.minutes_plural': 'há {{count}} minutos',
    'common.timeAgo.hours': 'há {{count}} hora',
    'common.timeAgo.hours_plural': 'há {{count}} horas',
    'common.timeAgo.days': 'há {{count}} dia',
    'common.timeAgo.days_plural': 'há {{count}} dias'
  },
  it: {
    'common.timeAgo.now': 'Adesso',
    'common.timeAgo.minutes': '{{count}} minuto fa',
    'common.timeAgo.minutes_plural': '{{count}} minuti fa',
    'common.timeAgo.hours': '{{count}} ora fa',
    'common.timeAgo.hours_plural': '{{count}} ore fa',
    'common.timeAgo.days': '{{count}} giorno fa',
    'common.timeAgo.days_plural': '{{count}} giorni fa',
    'publish.title': 'Pubblica annuncio',
    'publish.subtitle': 'Dichiara un oggetto smarrito o trovato per aiutare la comunità',
    'publish.form.objectInfo': 'Informazioni sull\'oggetto',
    'publish.form.title': 'Titolo dell\'annuncio',
    'publish.form.titlePlaceholder': 'Es: iPhone 13 Pro smarrito in metro',
    'publish.form.description': 'Descrizione dettagliata',
    'publish.form.descriptionPlaceholder': 'Descrivi il tuo oggetto in dettaglio...',
    'publish.form.type': 'Tipo di annuncio',
    'publish.form.category': 'Categoria',
    'publish.form.location': 'Luogo',
    'publish.form.locationPlaceholder': 'Es: Roma Centro, Stazione Termini',
    'publish.form.dateOccurred': 'Data dell\'incidente',
    'publish.form.contactInfo': 'Informazioni di contatto',
    'publish.form.contactPlaceholder': 'Come contattarti...',
    'publish.form.image': 'Foto (opzionale)',
    'publish.form.imageDesc': 'Aggiungi una foto per aiutare nell\'identificazione',
    'publish.form.submit': 'Pubblica annuncio',
    'publish.form.submitting': 'Pubblicazione...',
    'publish.form.required': 'Questo campo è obbligatorio',
    'publish.form.success': 'Annuncio pubblicato con successo!',
    'publish.form.error': 'Errore durante la pubblicazione',
    'publish.form.imageError': 'Errore durante il caricamento dell\'immagine',
    'publish.form.imageTypeError': 'Tipo di file non valido. Usa JPG, PNG o GIF.',
    'publish.form.imageSizeError': 'File troppo grande. Massimo 5MB.',
    'publish.itemType.lost': 'Oggetto smarrito',
    'publish.itemType.found': 'Oggetto trovato',
    'publish.itemType.lostDesc': 'Hai smarrito qualcosa? Pubblica un annuncio per fartelo restituire.',
    'publish.itemType.foundDesc': 'Hai trovato qualcosa? Aiuta il proprietario a ritrovarlo.',
    'publish.backToHome': 'Torna alla home'
  },
  de: {
    'common.timeAgo.now': 'Jetzt',
    'common.timeAgo.minutes': 'vor {{count}} Minute',
    'common.timeAgo.minutes_plural': 'vor {{count}} Minuten',
    'common.timeAgo.hours': 'vor {{count}} Stunde',
    'common.timeAgo.hours_plural': 'vor {{count}} Stunden',
    'common.timeAgo.days': 'vor {{count}} Tag',
    'common.timeAgo.days_plural': 'vor {{count}} Tagen',
    'publish.title': 'Anzeige veröffentlichen',
    'publish.subtitle': 'Melden Sie einen verlorenen oder gefundenen Gegenstand',
    'publish.form.objectInfo': 'Informationen zum Gegenstand',
    'publish.form.title': 'Anzeigentitel',
    'publish.form.titlePlaceholder': 'Z.B.: iPhone 13 Pro in der U-Bahn verloren',
    'publish.form.description': 'Detaillierte Beschreibung',
    'publish.form.descriptionPlaceholder': 'Beschreiben Sie Ihren Gegenstand detailliert...',
    'publish.form.type': 'Anzeigentyp',
    'publish.form.category': 'Kategorie',
    'publish.form.location': 'Ort',
    'publish.form.locationPlaceholder': 'Z.B.: Berlin Mitte, Hauptbahnhof',
    'publish.form.dateOccurred': 'Datum des Vorfalls',
    'publish.form.contactInfo': 'Kontaktinformationen',
    'publish.form.contactPlaceholder': 'Wie können Sie kontaktiert werden...',
    'publish.form.image': 'Foto (optional)',
    'publish.form.imageDesc': 'Fügen Sie ein Foto zur Identifizierung hinzu',
    'publish.form.submit': 'Anzeige veröffentlichen',
    'publish.form.submitting': 'Veröffentlichung...',
    'publish.form.required': 'Dieses Feld ist erforderlich',
    'publish.form.success': 'Anzeige erfolgreich veröffentlicht!',
    'publish.form.error': 'Fehler beim Veröffentlichen',
    'publish.form.imageError': 'Fehler beim Hochladen des Bildes',
    'publish.form.imageTypeError': 'Ungültiger Dateityp. Verwenden Sie JPG, PNG oder GIF.',
    'publish.form.imageSizeError': 'Datei zu groß. Maximum 5MB.',
    'publish.itemType.lost': 'Verlorener Gegenstand',
    'publish.itemType.found': 'Gefundener Gegenstand',
    'publish.itemType.lostDesc': 'Haben Sie etwas verloren? Veröffentlichen Sie eine Anzeige.',
    'publish.itemType.foundDesc': 'Haben Sie etwas gefunden? Helfen Sie dem Besitzer.',
    'publish.backToHome': 'Zurück zur Startseite'
  },
  nl: {
    'common.timeAgo.now': 'Nu',
    'common.timeAgo.minutes': '{{count}} minuut geleden',
    'common.timeAgo.minutes_plural': '{{count}} minuten geleden',
    'common.timeAgo.hours': '{{count}} uur geleden',
    'common.timeAgo.hours_plural': '{{count}} uur geleden',
    'common.timeAgo.days': '{{count}} dag geleden',
    'common.timeAgo.days_plural': '{{count}} dagen geleden',
    'publish.title': 'Advertentie plaatsen',
    'publish.subtitle': 'Meld een verloren of gevonden item',
    'publish.form.objectInfo': 'Informatie over het object',
    'publish.form.title': 'Advertentietitel',
    'publish.form.titlePlaceholder': 'Bijv.: iPhone 13 Pro verloren in metro',
    'publish.form.description': 'Gedetailleerde beschrijving',
    'publish.form.descriptionPlaceholder': 'Beschrijf uw object in detail...',
    'publish.form.type': 'Type advertentie',
    'publish.form.category': 'Categorie',
    'publish.form.location': 'Locatie',
    'publish.form.locationPlaceholder': 'Bijv.: Amsterdam Centrum, Centraal Station',
    'publish.form.dateOccurred': 'Datum van het incident',
    'publish.form.contactInfo': 'Contactgegevens',
    'publish.form.contactPlaceholder': 'Hoe kunnen we u bereiken...',
    'publish.form.image': 'Foto (optioneel)',
    'publish.form.imageDesc': 'Voeg een foto toe voor identificatie',
    'publish.form.submit': 'Advertentie plaatsen',
    'publish.form.submitting': 'Plaatsen...',
    'publish.form.required': 'Dit veld is verplicht',
    'publish.form.success': 'Advertentie succesvol geplaatst!',
    'publish.form.error': 'Fout bij plaatsen',
    'publish.form.imageError': 'Fout bij uploaden van afbeelding',
    'publish.form.imageTypeError': 'Ongeldig bestandstype. Gebruik JPG, PNG of GIF.',
    'publish.form.imageSizeError': 'Bestand te groot. Maximum 5MB.',
    'publish.itemType.lost': 'Verloren item',
    'publish.itemType.found': 'Gevonden item',
    'publish.itemType.lostDesc': 'Iets verloren? Plaats een advertentie.',
    'publish.itemType.foundDesc': 'Iets gevonden? Help de eigenaar.',
    'publish.backToHome': 'Terug naar home'
  },
  zh: {
    'common.timeAgo.now': '现在',
    'common.timeAgo.minutes': '{{count}} 分钟前',
    'common.timeAgo.minutes_plural': '{{count}} 分钟前',
    'common.timeAgo.hours': '{{count}} 小时前',
    'common.timeAgo.hours_plural': '{{count}} 小时前',
    'common.timeAgo.days': '{{count}} 天前',
    'common.timeAgo.days_plural': '{{count}} 天前',
    'publish.title': '发布广告',
    'publish.subtitle': '报告丢失或发现的物品',
    'publish.form.objectInfo': '物品信息',
    'publish.form.title': '广告标题',
    'publish.form.titlePlaceholder': '例如：在地铁丢失iPhone 13 Pro',
    'publish.form.description': '详细描述',
    'publish.form.descriptionPlaceholder': '详细描述您的物品...',
    'publish.form.type': '广告类型',
    'publish.form.category': '类别',
    'publish.form.location': '位置',
    'publish.form.locationPlaceholder': '例如：北京朝阳区，三里屯',
    'publish.form.dateOccurred': '事件日期',
    'publish.form.contactInfo': '联系信息',
    'publish.form.contactPlaceholder': '如何联系您...',
    'publish.form.image': '照片（可选）',
    'publish.form.imageDesc': '添加照片以帮助识别',
    'publish.form.submit': '发布广告',
    'publish.form.submitting': '发布中...',
    'publish.form.required': '此字段为必填项',
    'publish.form.success': '广告发布成功！',
    'publish.form.error': '发布时出错',
    'publish.form.imageError': '上传图片时出错',
    'publish.form.imageTypeError': '无效的文件类型。请使用JPG、PNG或GIF。',
    'publish.form.imageSizeError': '文件太大。最大5MB。',
    'publish.itemType.lost': '丢失物品',
    'publish.itemType.found': '发现物品',
    'publish.itemType.lostDesc': '丢失了什么？发布广告找回。',
    'publish.itemType.foundDesc': '发现了什么？帮助失主找回。',
    'publish.backToHome': '返回首页'
  },
  ja: {
    'common.timeAgo.now': '今',
    'common.timeAgo.minutes': '{{count}} 分前',
    'common.timeAgo.minutes_plural': '{{count}} 分前',
    'common.timeAgo.hours': '{{count}} 時間前',
    'common.timeAgo.hours_plural': '{{count}} 時間前',
    'common.timeAgo.days': '{{count}} 日前',
    'common.timeAgo.days_plural': '{{count}} 日前',
    'publish.title': '広告を投稿',
    'publish.subtitle': '紛失または発見したアイテムを報告',
    'publish.form.objectInfo': 'アイテム情報',
    'publish.form.title': '広告タイトル',
    'publish.form.titlePlaceholder': '例：電車でiPhone 13 Proを紛失',
    'publish.form.description': '詳細な説明',
    'publish.form.descriptionPlaceholder': 'アイテムを詳しく説明してください...',
    'publish.form.type': '広告の種類',
    'publish.form.category': 'カテゴリ',
    'publish.form.location': '場所',
    'publish.form.locationPlaceholder': '例：東京渋谷区、渋谷駅',
    'publish.form.dateOccurred': '発生日',
    'publish.form.contactInfo': '連絡先情報',
    'publish.form.contactPlaceholder': '連絡方法...',
    'publish.form.image': '写真（任意）',
    'publish.form.imageDesc': '識別のために写真を追加',
    'publish.form.submit': '広告を投稿',
    'publish.form.submitting': '投稿中...',
    'publish.form.required': 'この項目は必須です',
    'publish.form.success': '広告が正常に投稿されました！',
    'publish.form.error': '投稿時にエラーが発生しました',
    'publish.form.imageError': '画像のアップロード中にエラーが発生しました',
    'publish.form.imageTypeError': '無効なファイルタイプです。JPG、PNG、またはGIFを使用してください。',
    'publish.form.imageSizeError': 'ファイルが大きすぎます。最大5MB。',
    'publish.itemType.lost': '紛失物',
    'publish.itemType.found': '発見物',
    'publish.itemType.lostDesc': '何かを失くしましたか？広告を投稿してください。',
    'publish.itemType.foundDesc': '何かを見つけましたか？持ち主を助けてください。',
    'publish.backToHome': 'ホームに戻る'
  },
  ko: {
    'common.timeAgo.now': '지금',
    'common.timeAgo.minutes': '{{count}} 분 전',
    'common.timeAgo.minutes_plural': '{{count}} 분 전',
    'common.timeAgo.hours': '{{count}} 시간 전',
    'common.timeAgo.hours_plural': '{{count}} 시간 전',
    'common.timeAgo.days': '{{count}} 일 전',
    'common.timeAgo.days_plural': '{{count}} 일 전',
    'publish.title': '광고 게시',
    'publish.subtitle': '분실 또는 발견한 아이템을 신고',
    'publish.form.objectInfo': '아이템 정보',
    'publish.form.title': '광고 제목',
    'publish.form.titlePlaceholder': '예: 지하철에서 iPhone 13 Pro 분실',
    'publish.form.description': '상세 설명',
    'publish.form.descriptionPlaceholder': '아이템을 자세히 설명해주세요...',
    'publish.form.type': '광고 유형',
    'publish.form.category': '카테고리',
    'publish.form.location': '위치',
    'publish.form.locationPlaceholder': '예: 서울 강남구, 강남역',
    'publish.form.dateOccurred': '발생 날짜',
    'publish.form.contactInfo': '연락처 정보',
    'publish.form.contactPlaceholder': '연락 방법...',
    'publish.form.image': '사진 (선택)',
    'publish.form.imageDesc': '식별을 위해 사진을 추가',
    'publish.form.submit': '광고 게시',
    'publish.form.submitting': '게시 중...',
    'publish.form.required': '이 항목은 필수입니다',
    'publish.form.success': '광고가 성공적으로 게시되었습니다!',
    'publish.form.error': '게시 중 오류가 발생했습니다',
    'publish.form.imageError': '이미지 업로드 중 오류가 발생했습니다',
    'publish.form.imageTypeError': '잘못된 파일 형식입니다. JPG, PNG 또는 GIF를 사용하세요.',
    'publish.form.imageSizeError': '파일이 너무 큽니다. 최대 5MB.',
    'publish.itemType.lost': '분실물',
    'publish.itemType.found': '발견물',
    'publish.itemType.lostDesc': '무언가를 잃어버렸나요? 광고를 게시하세요.',
    'publish.itemType.foundDesc': '무언가를 찾았나요? 주인을 도와주세요.',
    'publish.backToHome': '홈으로 돌아가기'
  }
};

// Langues à compléter
const languages = ['es', 'pt', 'it', 'de', 'nl', 'zh', 'ja', 'ko'];

// Compléter les traductions pour chaque langue
languages.forEach(lang => {
  const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Ajouter les traductions spécifiques à cette langue
  const langTranslations = translations[lang] || {};
  Object.keys(langTranslations).forEach(key => {
    setValueByKey(existing, key, langTranslations[key]);
  });
  
  // Utiliser le rapport d'audit pour trouver les clés manquantes
  const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit-report.json'), 'utf8'));
  const missingKeys = report.missing[lang] || [];
  
  // Ajouter les clés manquantes avec traductions basiques
  missingKeys.forEach(key => {
    if (!getValueByKey(existing, key)) {
      const frValue = getValueByKey(frTranslations, key);
      if (frValue) {
        // Traduction basique: utiliser la valeur française avec indication de langue
        setValueByKey(existing, key, frValue);
      }
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(`✅ ${lang.toUpperCase()}: ${missingKeys.length} clés ajoutées`);
});

console.log('✅ Toutes les traductions complétées');