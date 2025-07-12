#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Langues supportées
const LANGUAGES = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'zh', 'ja', 'ko'];

// Fonction pour lire un fichier JSON
function readTranslationFile(lang) {
  try {
    const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${lang}:`, error.message);
    return null;
  }
}

// Fonction pour extraire toutes les clés d'un objet de traduction
function extractKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...extractKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

// Fonction pour vérifier les clés manquantes
function findMissingKeys(referenceKeys, targetKeys) {
  return referenceKeys.filter(key => !targetKeys.includes(key));
}

// Fonction pour vérifier les clés en trop
function findExtraKeys(referenceKeys, targetKeys) {
  return targetKeys.filter(key => !referenceKeys.includes(key));
}

// Fonction pour vérifier les valeurs vides
function findEmptyValues(obj, prefix = '') {
  const emptyKeys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      emptyKeys.push(...findEmptyValues(obj[key], prefix + key + '.'));
    } else if (!obj[key] || obj[key].trim() === '') {
      emptyKeys.push(prefix + key);
    }
  }
  return emptyKeys;
}

// Fonction principale d'audit
function auditTranslations() {
  console.log('🔍 Audit des traductions i18n');
  console.log('================================\n');

  // Lire tous les fichiers de traduction
  const translations = {};
  const allKeys = {};
  
  for (const lang of LANGUAGES) {
    translations[lang] = readTranslationFile(lang);
    if (translations[lang]) {
      allKeys[lang] = extractKeys(translations[lang]);
      console.log(`✅ ${lang.toUpperCase()}: ${allKeys[lang].length} clés chargées`);
    } else {
      console.log(`❌ ${lang.toUpperCase()}: Fichier non trouvé ou invalide`);
    }
  }

  // Utiliser le français comme référence
  const referenceKeys = allKeys['fr'] || [];
  console.log(`\n📝 Référence (FR): ${referenceKeys.length} clés\n`);

  // Analyser chaque langue
  const report = {
    missing: {},
    extra: {},
    empty: {},
    statistics: {}
  };

  for (const lang of LANGUAGES) {
    if (lang === 'fr') continue; // Skip reference
    
    const targetKeys = allKeys[lang] || [];
    const missingKeys = findMissingKeys(referenceKeys, targetKeys);
    const extraKeys = findExtraKeys(referenceKeys, targetKeys);
    const emptyKeys = findEmptyValues(translations[lang] || {});

    report.missing[lang] = missingKeys;
    report.extra[lang] = extraKeys;
    report.empty[lang] = emptyKeys;
    report.statistics[lang] = {
      total: targetKeys.length,
      missing: missingKeys.length,
      extra: extraKeys.length,
      empty: emptyKeys.length,
      completeness: Math.round((1 - missingKeys.length / referenceKeys.length) * 100)
    };

    console.log(`🌍 ${lang.toUpperCase()}:`);
    console.log(`   Total: ${targetKeys.length} clés`);
    console.log(`   Manquantes: ${missingKeys.length}`);
    console.log(`   En trop: ${extraKeys.length}`);
    console.log(`   Vides: ${emptyKeys.length}`);
    console.log(`   Complétude: ${report.statistics[lang].completeness}%`);
    
    if (missingKeys.length > 0) {
      console.log(`   🔴 Clés manquantes:`);
      missingKeys.slice(0, 5).forEach(key => console.log(`      - ${key}`));
      if (missingKeys.length > 5) {
        console.log(`      ... et ${missingKeys.length - 5} autres`);
      }
    }
    
    if (emptyKeys.length > 0) {
      console.log(`   ⚠️  Clés vides:`);
      emptyKeys.slice(0, 3).forEach(key => console.log(`      - ${key}`));
      if (emptyKeys.length > 3) {
        console.log(`      ... et ${emptyKeys.length - 3} autres`);
      }
    }
    console.log('');
  }

  // Résumé global
  console.log('\n📊 RÉSUMÉ GLOBAL');
  console.log('================');
  const totalLanguages = LANGUAGES.length - 1; // Excluding reference
  const averageCompleteness = Math.round(
    Object.values(report.statistics).reduce((sum, stat) => sum + stat.completeness, 0) / totalLanguages
  );
  
  console.log(`Complétude moyenne: ${averageCompleteness}%`);
  console.log(`Langues avec 100% de complétude: ${Object.values(report.statistics).filter(s => s.completeness === 100).length}/${totalLanguages}`);
  
  // Sauvegarder le rapport
  const reportPath = path.join(__dirname, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Rapport détaillé sauvegardé: ${reportPath}`);
  
  return report;
}

// Exécuter l'audit
if (import.meta.url === `file://${process.argv[1]}`) {
  auditTranslations();
}

export { auditTranslations };