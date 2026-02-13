const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

const sliderButtonTsx = fs.readFileSync(path.join(srcDir, 'react', 'SliderButton.tsx'), 'utf8')
  .replace("import '../core/slider-button.css';", "import './slider-button.css';");

const sliderButtonCss = fs.readFileSync(path.join(srcDir, 'core', 'slider-button.css'), 'utf8');

const registryItem = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'slider-button',
  type: 'registry:component',
  title: 'Slider Nav Button',
  description: 'Pill-shaped slider navigation button with divider-to-hover animation',
  author: 'Samet Ozkale',
  dependencies: [
    'framer-motion',
    '@hugeicons/react',
    '@hugeicons/core-free-icons'
  ],
  files: [
    {
      path: 'components/ui/slider-button.tsx',
      type: 'registry:component',
      content: sliderButtonTsx
    },
    {
      path: 'components/ui/slider-button.css',
      type: 'registry:file',
      target: '~/components/ui/slider-button.css',
      content: sliderButtonCss
    }
  ]
};

const json = JSON.stringify(registryItem, null, 2);

// Write to public/r/ for deployment
const publicRDir = path.join(root, 'public', 'r');
if (!fs.existsSync(publicRDir)) fs.mkdirSync(publicRDir, { recursive: true });
fs.writeFileSync(path.join(publicRDir, 'slider-button.json'), json);

// Write to static/r/ so it's committed and always deployed (fallback for v0 "Open in v0")
const staticRDir = path.join(root, 'static', 'r');
if (!fs.existsSync(staticRDir)) fs.mkdirSync(staticRDir, { recursive: true });
fs.writeFileSync(path.join(staticRDir, 'slider-button.json'), json);

console.log('Generated public/r/slider-button.json and static/r/slider-button.json');
