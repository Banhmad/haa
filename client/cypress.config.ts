import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'src/__tests__/E2E/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    env: {
      apiUrl: 'http://localhost:5000/api',
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
