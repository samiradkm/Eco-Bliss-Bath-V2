it("Vérifier la vulnérabilité XSS sur le formulaire d'avis", () => {
  cy.visit("http://localhost:4200/#/login");
  cy.contains("Connexion").click();
  cy.get("input#username").type("test2@test.fr");
  cy.get("input#password").type("testtest");
  cy.get('[data-cy="login-submit"').click();
  cy.contains("Mon panier").should("exist");

  cy.contains("Avis").click();
  const xssPayload =
    "<script>window.xssTest = true; console.log('okok');</script>";

  cy.get(
    "section.review-section > form > div:nth-child(1) > div > img:nth-child(4)",
  ).click();
  cy.get('input[data-cy="review-input-title"]').type("Test Commentaire");
  // On injecte le script dans le champ commentaire
  cy.get('input[data-cy="review-input-comment"]').type(xssPayload);
  cy.get('button[data-cy="review-submit"]').click();

  // On vérifie que le script n'a PAS été exécuté
  cy.window().should((win) => {
    expect(win.xssTest).to.be.undefined;
  });
});
