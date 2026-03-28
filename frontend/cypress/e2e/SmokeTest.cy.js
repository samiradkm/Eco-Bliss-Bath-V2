describe("Smoke tests", () => {
  it("Vérifier la présence des champs et boutons de connexion", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get("input#username").should("exist");
    cy.get("input#password").should("exist");
    cy.get('[data-cy="login-submit"]').should("exist");
  });

  it("Vérifier la présence des boutons d’ajout au panier quand vous êtes connecté", () => {
    cy.visit("http://localhost:4200/#/");
    cy.contains("Connexion").click();
    cy.get("input#username").type("test2@test.fr");
    cy.get("input#password").type("testtest");
    cy.get('[data-cy="login-submit"').click();
    cy.contains("Voir les produits").click();
    cy.contains("Consulter").click();
    cy.contains("Ajouter au panier").should("exist");
  });
});
