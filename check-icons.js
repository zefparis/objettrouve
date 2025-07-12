// Script pour identifier les icônes Lucide utilisées
import fs from 'fs';
import path from 'path';

const iconsUsed = new Set();

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Rechercher les imports de lucide-react
      const matches = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g);
      if (matches) {
        matches.forEach(match => {
          const iconNames = match.match(/\{([^}]+)\}/)[1];
          iconNames.split(',').forEach(icon => {
            iconsUsed.add(icon.trim());
          });
        });
      }
    }
  });
}

scanDirectory('client/src');

console.log('Icônes utilisées:', [...iconsUsed].sort());
console.log('Total:', iconsUsed.size);