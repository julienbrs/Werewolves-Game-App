/// <reference types="cypress" />
// ***********************************************
// eslint-disable-next-line prettier/prettier
export { };

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to intercept GET endpoint for tags
       * @example cy.getTags()
       */
      getTags(): Chainable<void>;
      /**
       * Custom command to intercept POST endpoint for tags
       * @example cy.postTags()
       */
      postTag(): Chainable<void>;
      /**
       * Custom command to intercept DELETE endpoint for tags
       * @example cy.deleteTags()
       */
      deleteTag(): Chainable<void>;
      /**
       * Custom command to intercept PUT endpoint for bookmarks
       * @example cy.putTag()
       */
      putTag(): Chainable<void>;
      /**
       * Custom command to intercept GET endpoint for bookmarks
       * @example cy.getBookmarks()
       */
      getBookmarks(): Chainable<void>;
      /**
       * Custom command to intercept POST endpoint for bookmarks
       * @example cy.postBookmarks()
       */
      postBookmark(): Chainable<void>;
      /**
       * Custom command to intercept DELETE endpoint for bookmarks
       * @example cy.deleteBookmarks()
       */
      deleteBookmark(): Chainable<void>;
      /**
       * Custom command to intercept PUT endpoint for bookmarks
       * @example cy.putBookmark()
       */
      putBookmark(): Chainable<void>;
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
