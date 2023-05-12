/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }

// }

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to intercept GET endpoint for tags
       * @example cy.getTags()
       */
      getUsers(): Chainable<void>;
      /**
       * Custom command to intercept POST endpoint for tags
       * @example cy.postTags()
       */
      getMe(): Chainable<void>;
      /**
       * Custom command to intercept DELETE endpoint for tags
       * @example cy.deleteTags()
       */
      createUser(): Chainable<void>;
      /**
       * Custom command to intercept PUT endpoint for bookmarks
       * @example cy.putTag()
       */
      deleteUser(): Chainable<void>;
      /**
       * Custom command to intercept GET endpoint for bookmarks
       * @example cy.getBookmarks()
       */
      updateUser(): Chainable<void>;
      /**
       * Custom command to intercept POST endpoint for bookmarks
       * @example cy.postBookmarks()
       */
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("getTags", () => {
  cy.intercept("GET", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/tags").as("getTags");
});

Cypress.Commands.add("postTag", () => {
  cy.intercept("POST", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/tags").as("postTag");
});

Cypress.Commands.add("deleteTag", () => {
  cy.intercept("DELETE", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/tags/*").as("deleteTag");
});

Cypress.Commands.add("putTag", () => {
  cy.intercept("PUT", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/tags/*").as("putTag");
});

Cypress.Commands.add("getBookmarks", () => {
  cy.intercept("GET", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/bookmarks").as(
    "getBookmarks"
  );
});

Cypress.Commands.add("postBookmark", () => {
  cy.intercept("POST", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/bookmarks").as(
    "postBookmark"
  );
});

Cypress.Commands.add("deleteBookmark", () => {
  cy.intercept("DELETE", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/bookmarks/*").as(
    "deleteBookmark"
  );
});

Cypress.Commands.add("putBookmark", () => {
  cy.intercept("PUT", "https://cawrest.osc-fr1.scalingo.io/bmt/verninp/bookmarks/*").as(
    "putBookmark"
  );
});
