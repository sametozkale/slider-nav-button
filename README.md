# Slider Nav Button

Pill-shaped slider navigation button with divider-to-hover animation.

When you hover over the left or right arrow, a background slides out from the central divider toward the hovered side.

## Installation

```bash
npm install slider-nav-button
```

For the React version, also install the peer dependencies:

```bash
npm install framer-motion @hugeicons/react @hugeicons/core-free-icons
```

## Usage

### Vanilla JS

```js
// In your HTML: <div id="slider-container"></div>

import { SliderButton } from 'slider-nav-button';
import 'slider-nav-button/styles.css';

const button = new SliderButton({
  onPrev: () => console.log('Previous'),
  onNext: () => console.log('Next'),
  size: 'md',  // 'sm' | 'md' | 'lg'
});

button.mount('#slider-container');
```

### React

```jsx
import { useState } from 'react';
import { SliderButton } from 'slider-nav-button/react';

function Carousel() {
  const [index, setIndex] = useState(0);

  return (
    <SliderButton
      onPrev={() => setIndex(prev => Math.max(0, prev - 1))}
      onNext={() => setIndex(prev => prev + 1)}
      size="md"
    />
  );
}
```

The React version includes styles automatically.

### CDN (no bundler)

```html
<div id="container"></div>
<link rel="stylesheet" href="https://unpkg.com/slider-nav-button/dist/slider-button.css">
<script type="module">
  import { SliderButton } from 'https://unpkg.com/slider-nav-button/dist/index.js';
  new SliderButton({ onPrev: () => {}, onNext: () => {} }).mount('#container');
</script>
```

### Custom icons (React)

```jsx
import { ChevronLeftIcon, ChevronRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SliderButton } from 'slider-nav-button/react';

<SliderButton
  iconLeft={<HugeiconsIcon icon={ChevronLeftIcon} size={18} />}
  iconRight={<HugeiconsIcon icon={ChevronRightIcon} size={18} />}
  onPrev={handlePrev}
  onNext={handleNext}
/>
```

## API

### Vanilla JS

**Constructor options**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onPrev` | `() => void` | - | Callback when left arrow is clicked |
| `onNext` | `() => void` | - | Callback when right arrow is clicked |
| `iconLeft` | `string` | Default arrow SVG | Custom SVG HTML string for left icon |
| `iconRight` | `string` | Default arrow SVG | Custom SVG HTML string for right icon |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `className` | `string` | - | Additional CSS class for the container |

**Methods**

- `getElement()` - Returns the root DOM element
- `mount(parent)` - Mount into a parent element (selector or HTMLElement)
- `unmount()` - Remove from the DOM
- `update(options)` - Update options (iconLeft, iconRight, size, className)

### React

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPrev` | `() => void` | - | Callback when left arrow is clicked |
| `onNext` | `() => void` | - | Callback when right arrow is clicked |
| `iconLeft` | `ReactNode` | Default arrow | Custom left icon |
| `iconRight` | `ReactNode` | Default arrow | Custom right icon |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `className` | `string` | - | Additional CSS class |

## Customization

Use CSS custom properties to theme the component. Target the `.snb` class or pass a custom `className`:

```css
.snb {
  --snb-bg: transparent;
  --snb-hover-bg: #f7f7f7;
  --snb-border-color: #f2f2f2;
  --snb-icon-color: #17181A;
  --snb-divider-color: var(--snb-border-color);
  --snb-radius: 9999px;
  --snb-height: 36px;
  --snb-width: 90px;
  --snb-icon-size: 18px;
  --snb-transition-duration: 0.28s;
  --snb-transition-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --snb-hover-padding: 2px;
}
```

### Dark theme

```css
.dark-container .snb {
  --snb-bg: transparent;
  --snb-hover-bg: #323232;
  --snb-border-color: rgba(255, 255, 255, 0.05);
  --snb-divider-color: rgba(255, 255, 255, 0.05);
  --snb-icon-color: #fff;
}
```

## Demo

```bash
npm run demo
```

Then open the URL shown (e.g. `http://localhost:3000/demo/`).

## Browser support

Vanilla JS uses `mousemove`/`mouseleave` for hover detection; React uses framer-motion. Supported in all modern browsers (Chrome 105+, Firefox 121+, Safari 15.4+).

## License

MIT
