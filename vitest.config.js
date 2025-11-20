import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // React 17 classic mode
    }),
  ],
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    
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
    
    // Parallelization
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
  
  resolve: {
    alias: {
      '@test-helpers': path.resolve(__dirname, 'src/view/__tests__/helpers'),
    },
    extensions: ['.js', '.jsx', '.json'],
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

