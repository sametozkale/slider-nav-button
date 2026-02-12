import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'react/index': 'src/react/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: ['react', 'framer-motion', '@hugeicons/react', '@hugeicons/core-free-icons'],
  outExtension({ format }) {
    return format === 'cjs' ? { js: '.cjs' } : { js: '.js' };
  },
});
