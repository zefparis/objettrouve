import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync } from 'fs';

console.log('Building app...');

// Clean
if (existsSync('dist')) rmSync('dist', { recursive: true });

// Create structure
mkdirSync('dist/public', { recursive: true });

// Copy client files as-is (no complex build)
cpSync('client/index.html', 'dist/public/index.html');
cpSync('client/src', 'dist/public/src', { recursive: true });

// Build server only
console.log('Building backend...');
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

// Copy uploads
if (existsSync('uploads')) {
  cpSync('uploads', 'dist/uploads', { recursive: true });
}

console.log('Build done!');