// Cypress support file
import '@testing-library/cypress/add-commands';

// Custom command: login via API and set token
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password }).then(
    (response) => {
      localStorage.setItem('token', response.body.token);
      localStorage.setItem('user', JSON.stringify(response.body.user));
    },
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(email: string, password: string): Chainable<void>;
    }
  }
}
