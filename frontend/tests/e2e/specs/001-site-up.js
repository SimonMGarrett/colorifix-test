import { colorifixBaseUrl, screenSizes } from '../plugins/base.js';

describe('The Home Page', () => {
  // Page exists
  // This is very content-specific only because there's little else
  // to test in this case!
  it(`should successfully visit the home page`, () => {
    cy.visit(colorifixBaseUrl + '/');
    cy.contains('Experimental Progress');
    cy.contains('Choose the form to fill in:');
  })

  it(`should show the correct footer year`, () => {
    cy.visit(colorifixBaseUrl + '/');
    cy.viewport(1024, 1500);
    const currentYear = new Date().getFullYear();
    cy.get('[data-cy=ftr-year]').contains(currentYear);
  })

  it(`should show both logos`, () => {
    cy.visit(colorifixBaseUrl + '/');
    cy.viewport(1024, 1500);
    cy.get('[data-cy=top-logo]').should('be.visible');
    cy.get('[data-cy=ftr-logo]').should('be.visible');
  })
})
