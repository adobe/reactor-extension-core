import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin to mock CSS imports in tests
const mockCssPlugin = () => ({
  name: 'mock-css',
  transform(code, id) {
    if (/\.(css|styl|scss|sass|less)$/.test(id)) {
      return {
        code: 'export default {}',
        map: null,
      };
    }
  },
});

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // React 17 classic mode
    }),
    mockCssPlugin(), // Mock CSS imports in tests
  ],
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    allowOnly: true, // Allow .only() in tests during development
    
    // Enable CSS processing
    css: true,
    
    // Use pool 'vmThreads' which has better CSS support
    pool: 'vmThreads',
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/__tests__/**',
        '**/*.test.{js,jsx}',
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.config.{js,mjs}',
        '**/helpers/**',
      ],
    },
    
    // Test matching
    include: ['src/**/__tests__/**/*.test.{js,jsx}'],
  },
  
  resolve: {
    alias: {
      '@test-helpers': path.resolve(__dirname, 'src/view/__tests__/helpers'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  
  server: {
    deps: {
      inline: [
        /@react-spectrum/,
        /@spectrum-icons/,
        /@adobe\/react-spectrum/,
      ],
      web: {
        transformCss: true,
      },
    },
  },
  
  // Optimize deps to handle CSS
  optimizeDeps: {
    include: [
      '@react-spectrum/provider',
      '@react-spectrum/theme-dark',
      '@react-spectrum/theme-light',
    ],
  },
  
  define: {
    'process.env.SCALE_MEDIUM': 'true',
    'process.env.SCALE_LARGE': 'false',
    'process.env.THEME_LIGHT': 'false',
    'process.env.THEME_LIGHTEST': 'true',
    'process.env.THEME_DARK': 'false',
    'process.env.THEME_DARKEST': 'false',
    'process.browser': 'true',
    'REACTOR_KARMA_CI_UNIT_TEST_MODE': 'false',
  },
});

