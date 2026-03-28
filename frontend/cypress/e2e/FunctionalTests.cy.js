describe("Tests fonctionnels", () => {
  it("Connexion", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.contains("Connexion").click();
    cy.get("input#username").type("test2@test.fr");
    cy.get("input#password").type("testtest");
    cy.get('[data-cy="login-submit"').click();
    cy.contains("Mon panier").should("exist");
  });

  it("Affichage des produits sur la page d’accueil", () => {
    // Vérifie le chargement initial
    cy.visit("http://localhost:4200/");
    cy.get("div.list-products").should("exist").and("be.visible");

    const urls = []; // liste des URLs de détail

    // Vérifiez l’affichage de tous les produits et leurs informations (image + description + bouton consulter)
    cy.get("div.list-products")
      .find('article[data-cy="product-home"]')
      .each(($article) => {
        // Vérifie image
        cy.wrap($article)
          .find('img[data-cy="product-home-img"]')
          .should("be.visible");

        // Vérifie description
        cy.wrap($article)
          .find('p[data-cy="product-home-ingredients"]')
          .should("be.visible")
          .and("not.be.empty");

        cy.wrap($article)
          .find('[data-cy="product-home-link"]')
          .should("be.visible")
          .and("have.attr", "ng-reflect-router-link")
          .then((routerLink) => {
            const url =
              "http://localhost:4200/#" + routerLink.replace(",", "/");
            urls.push(url);
          });
      })
      .then(() => {
        // Vérifiez l’affichage de CHAQUE produit et leurs informations (image + description + prix + stock).
        urls.forEach((url) => {
          cy.visit(url);

          // Vérifier les éléments de la page détail
          cy.get('img[data-cy="detail-product-img"]').should("be.visible");
          cy.get('p[data-cy="detail-product-description"]').should(
            "be.visible"
          );
          cy.get('[data-cy="detail-product-price"]').should("be.visible");
          cy.get('[data-cy="detail-product-stock"]').should("be.visible");
        });
      });
  });
});
