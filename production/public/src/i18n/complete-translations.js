import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Traductions manquantes pour chaque langue
const missingTranslations = {
  en: {
    "categories.phones": "Phones",
    "categories.wallets": "Wallets",
    "categories.glasses": "Glasses",
    "categories.computers": "Computers",
    "search.filters": "Filters",
    "search.location": "Location"
  },
  es: {
    "nav.profile": "Perfil",
    "categories.phones": "Teléfonos",
    "categories.wallets": "Carteras",
    "categories.glasses": "Gafas",
    "categories.computers": "Computadoras",
    "search.filters": "Filtros",
    "search.location": "Ubicación"
  },
  pt: {
    "nav.profile": "Perfil",
    "categories.phones": "Telefones",
    "categories.wallets": "Carteiras",
    "categories.glasses": "Óculos",
    "categories.computers": "Computadores",
    "search.filters": "Filtros",
    "search.location": "Localização"
  }
};

// Fonction pour définir une valeur dans un objet imbriqué
function setNestedValue(obj, key, value) {
  const keys = key.split('.');
  const last = keys.pop();
  const target = keys.reduce((current, part) => {
    if (!current[part]) current[part] = {};
    return current[part];
  }, obj);
  target[last] = value;
}

// Traiter les langues avec des traductions manquantes partielles
Object.keys(missingTranslations).forEach(lang => {
  const filePath = path.join(__dirname, 'locales', lang, 'translation.json');
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const translations = missingTranslations[lang];
  
  Object.keys(translations).forEach(key => {
    setNestedValue(existing, key, translations[key]);
  });
  
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(`✅ ${lang.toUpperCase()}: ${Object.keys(translations).length} clés ajoutées`);
});

console.log('✅ Traductions partielles complétées');