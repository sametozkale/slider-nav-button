const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

// Create public directory
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Read demo HTML and rewrite paths (../dist/ -> dist/)
const demoHtml = fs.readFileSync(path.join(root, 'demo', 'index.html'), 'utf8');
const deployHtml = demoHtml.replace(/\.\.\/dist\//g, 'dist/');
fs.writeFileSync(path.join(publicDir, 'index.html'), deployHtml);

// Copy dist to public/dist
const distDir = path.join(root, 'dist');
const publicDistDir = path.join(publicDir, 'dist');
if (fs.existsSync(publicDistDir)) {
  fs.rmSync(publicDistDir, { recursive: true });
}
fs.cpSync(distDir, publicDistDir, { recursive: true });

console.log('Deploy build completed. Output in public/');
