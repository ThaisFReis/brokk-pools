import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/components/dashboard/**', 'src/utils/**', 'src/hooks/**'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      thresholds: {
        'src/components/dashboard': {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  },
});
