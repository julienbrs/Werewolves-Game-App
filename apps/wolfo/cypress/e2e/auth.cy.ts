describe("Authentication", () => {
  const newUser = {
    name: "newuser",
    password: "newpass",
  };

  it("should allow new user to register and login", () => {
    cy.visit("http://localhost:19000/auth");
    cy.get('[data-testid="indicator-body"]').click();
    cy.get('[data-testid="name-input"]').type(newUser.name);
    cy.get("[data-testid='password-input']").type(newUser.password);
    cy.get("[data-testid='register-button']").contains("Register").click();
    cy.url().should("equal", "http://localhost:19000/");
  });

  // it("should not allow existing user to register again", () => {
  //   cy.visit("http://localhost:19000/auth");
  //   cy.get("[data-testid='name-input']").type(newUser.name);
  //   cy.get("[data-testid='password-input']").type(newUser.password);
  //   cy.get("[data-testid='register-button']").contains("Register").click();
  //   cy.contains("User already exists");
  //   // cy.url().should("equal", "/");
  // });

  // it("should not allow invalid username to login", () => {
  //   const invalidUsername = "nonexistentuser";
  //   cy.visit("/login");
  //   cy.get("[data-testid='username-input']").type(invalidUsername);
  //   cy.get("[data-testid='password-input']").type("newpass");
  //   cy.get("[data-testid='login-button']").contains("Login").click();
  //   cy.contains("Invalid username or password");
  //   // cy.url().should("equal", "/");
  // });

  // it("should not allow invalid password to login", () => {
  //   const invalidPassword = "wrongpass";
  //   cy.visit("/login");
  //   cy.get("[data-testid='username-input']").type(newUser.name);
  //   cy.get("[data-testid='password-input']").type(invalidPassword);
  //   cy.get("[data-testid='login-button']").contains("Login").click();
  //   cy.contains("Invalid username or password");
  //   // cy.url().should("equal", "http://localhost:3000/");
  // });

  // it("should allow existing user to login", () => {
  //   cy.visit("/login");
  //   cy.get("[data-testid='username-input']").type(newUser.name);
  //   cy.get("[data-testid='password-input']").type(newUser.password);
  //   cy.get("[data-testid='login-button']").contains("Login").click();
  //   // cy.url().should("equal", "http://localhost:3000/");
  // });
});
