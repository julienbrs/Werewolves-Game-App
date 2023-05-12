/// <reference types="cypress" />
// ***********************************************
export { };

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to intercept GET endpoint for users
       * @example cy.getUsers()
       */
      getUsers(): Chainable<void>;
      /**
       * Custom command to intercept GET endpoint for current user
       * @example cy.getMe()
       */
      getMe(): Chainable<void>;
      /**
       * Custom command to intercept POST endpoint for users
       * @example cy.createUser()
       */
      createUser(): Chainable<void>;
      /**
       * Custom command to intercept DELETE endpoint for user
       * @example cy.deleteUser()
       */
      deleteUser(): Chainable<void>;
      /**
       * Custom command to intercept UPDATE endpoint for users
       * @example cy.updateUser()
       */
      updateUser(): Chainable<void>;
      /**
       * Custom command to intercept POST endpoint for user
       * @example cy.login()
       */
      login(): Chainable<void>;
    }
  }
}
