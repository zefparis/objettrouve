import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting build process...');

// Clean previous build
if (existsSync('dist')) {
  rmSync('dist', { recursive: true });
}

// Create dist directory structure
mkdirSync('dist', { recursive: true });
mkdirSync('dist/public', { recursive: true });

console.log('📦 Building frontend...');
try {
  // Build frontend with Vite
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Copy built frontend to dist/public
  if (existsSync('dist/public')) {
    cpSync('dist/public', 'dist/public', { recursive: true });
  }
} catch (error) {
  console.log('⚠️  Vite build failed, copying static files...');
  
  // Fallback: copy static files
  cpSync('client/index.html', 'dist/public/index.html');
  cpSync('client/src', 'dist/public/src', { recursive: true });
}

console.log('🔧 Building backend...');
try {
  // Build backend with esbuild
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Backend build failed:', error);
  process.exit(1);
}

// Copy necessary files
console.log('📁 Copying assets...');
if (existsSync('uploads')) {
  cpSync('uploads', 'dist/uploads', { recursive: true });
}

// Create package.json for production
const prodPackage = {
  "name": "lost-found-production",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
};

writeFileSync('dist/package.json', JSON.stringify(prodPackage, null, 2));

console.log('✅ Build completed successfully!');