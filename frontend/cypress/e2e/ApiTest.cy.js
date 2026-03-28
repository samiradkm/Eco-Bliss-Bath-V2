beforeEach(() => {
  cy.request("POST", "http://localhost:8081/login", {
    username: "test2@test.fr",
    password: "testtest",
  }).then((res) => {
    Cypress.env("authToken", res.body.token);
  });
});

describe("Test Api", () => {
  it("Requête sur les données confidentielles d'un utilisateur avant connexion pour vérifier que je reçois une erreur", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("Requête de la liste des produits du panier", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: {
        Authorization: `Bearer ${Cypress.env("authToken")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("orderLines");
    });
  });

  it("Requête d’une fiche produit spécifique", () => {
    cy.request({
      method: "GET",
      url: " http://localhost:8081/products/3",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("id", 3);
    });
  });

  it("Login", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });

  it("Ajouter un produit disponible au panier", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      body: {
        product: 5,
        quantity: 1,
      },
      headers: {
        Authorization: `Bearer ${Cypress.env("authToken")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("orderLines");

      // Vérifie qu'au moins un élément a id = 5
      const hasId5 = response.body.orderLines.some(
        (line) => line.product.id === 5
      );
      expect(hasId5).to.be.true;
    });
  });

  it("Ajouter un produit en rupture de stock", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      body: {
        product: 4,
        quantity: 1,
      },
      headers: {
        Authorization: `Bearer ${Cypress.env("authToken")}`,
      },
    }).then((response) => {
      expect(response.status).not.to.eq(200);
    });
  });

  it("Ajouter un avis", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews",
      body: {
        title: "zayn",
        comment: "les produit sont bien ",
        rating: 4,
      },
      headers: {
        Authorization: `Bearer ${Cypress.env("authToken")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
