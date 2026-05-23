import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules/**', 'dist/**', '.claude/**'],
    sequence: { setupFiles: 'list' },
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
    server: {
      deps: {
        inline: ['rxfire', '@angular/fire', 'firebase'],
      },
    },
  },
});
