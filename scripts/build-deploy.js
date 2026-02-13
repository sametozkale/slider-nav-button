const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

// Generate registry JSON for v0 "Open in v0" integration
require('./generate-registry.js');

// Create public directory
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Read demo HTML and rewrite paths (../dist/ -> dist/)
const demoHtml = fs.readFileSync(path.join(root, 'demo', 'index.html'), 'utf8');
const deployHtml = demoHtml.replace(/\.\.\/dist\//g, './dist/');
fs.writeFileSync(path.join(publicDir, 'index.html'), deployHtml);

// Copy static SEO files to public
const staticDir = path.join(root, 'static');
if (fs.existsSync(staticDir)) {
  const files = fs.readdirSync(staticDir);
  for (const f of files) {
    const src = path.join(staticDir, f);
    const dest = path.join(publicDir, f);
    if (fs.statSync(src).isDirectory()) continue; // skip dirs (handled below)
    fs.copyFileSync(src, dest);
  }
  // Copy static/r/ to public/r/ (v0 registry JSON - ensures committed file is deployed)
  const staticRDir = path.join(staticDir, 'r');
  if (fs.existsSync(staticRDir)) {
    const publicRDir = path.join(publicDir, 'r');
    if (!fs.existsSync(publicRDir)) fs.mkdirSync(publicRDir, { recursive: true });
    const rFiles = fs.readdirSync(staticRDir);
    for (const f of rFiles) {
      fs.copyFileSync(path.join(staticRDir, f), path.join(publicRDir, f));
    }
  }
}

// Copy dist to public/dist
const distDir = path.join(root, 'dist');
const publicDistDir = path.join(publicDir, 'dist');
if (fs.existsSync(publicDistDir)) {
  fs.rmSync(publicDistDir, { recursive: true });
}
fs.cpSync(distDir, publicDistDir, { recursive: true });

console.log('Deploy build completed. Output in public/');
