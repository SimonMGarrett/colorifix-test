import { colorifixBaseUrl, screenSizes } from '../plugins/base.js';

describe('The Slides', () => {
  // Ensuring the slides respond correctly to clicking.
  context('Slides respond correctly to clicks', () => {
    screenSizes.forEach((size) => {
      it(`initially shows all slides the same height on ${size.width}x${size.height} screen size`, () => {
        cy.visit(colorifixBaseUrl + '/');
        cy.viewport(size.width, size.height);

        let elemH = null;
        cy.get('.form-card').each(($el, index, $list) => {
          if (elemH) {
            expect(Math.abs($el.height() - elemH)).to.be.at.most(24); // extra line
          } else {
            elemH = $el.height();
          }
        })
      })

      it(`clicking the first slide makes it taller than the others on ${size.width}x${size.height} screen size`, () => {
        cy.visit(colorifixBaseUrl + '/');
        cy.viewport(size.width, size.height);

        cy.get('.form-card').eq(0).click() // should do this for all slides

        let elemH = null;
        cy.get('.form-card').each(($el, index, $list) => {
          if (elemH) {
            expect($el.height()).not.to.equal(elemH);
          } else {
            elemH = $el.height();
          }
        })
      })

      it(`clicking the first slide highlights the radio button ${size.width}x${size.height} screen size`, () => {
        cy.visit(colorifixBaseUrl + '/');
        cy.viewport(size.width, size.height);

        cy.get('.form-card').eq(0).click() // should do this for all slides
        cy.get('.form-card').eq(0).find('[type=radio]').should('be.checked')
      })

    })
  })

  context('Forms behave correctly', () => {
    it(`clicking the first slide makes its form visible and no other slide's`, () => {
      cy.visit(colorifixBaseUrl + '/');
      cy.viewport(1024, 1500);

      cy.get('.form-card').eq(0).click() // should do this for all slides
      cy.get('.form-card').eq(0).find('form').should('be.visible')
      cy.get('.form-card').eq(1).find('form').should('not.be.visible')
      cy.get('.form-card').eq(2).find('form').should('not.be.visible')
    })

    it(`clicking the first slide shows an empty form`, () => {
      cy.visit(colorifixBaseUrl + '/');
      cy.viewport(1024, 1500);

      cy.get('.form-card').eq(0).click() // should do this for all slides
      cy.get('[name=pigment_name]').should('be.empty')
      cy.get('[name=origin]').should('be.empty')
      cy.get('[name=available]').should('not.be.checked')
    })

    // Submission fails - NO data entered into ANY field
    it(`correctly fails to submit a form with missing data`, () => {
      cy.visit(colorifixBaseUrl + '/');
      cy.viewport(1024, 1500);

      cy.get('.form-card').eq(0).click() // should do this for all slides

      // No data in form at all
      cy.get('[name=pigment_name]').should('be.empty')
      cy.get('[name=origin]').should('be.empty')
      cy.get('[name=available]').should('not.be.checked')

      cy.get('[data-cy=submit-form]').eq(0).click()

      cy.get('[name=pigment_name]').then(($input) => {
        expect($input[0].validationMessage).to.equal('Please fill in this field.')
      })
    })
    
    // Submission fails - NO data entered in ORIGIN field.
    it(`correctly fails to submit a form with missing origin data`, () => {
      cy.visit(colorifixBaseUrl + '/');
      cy.viewport(1024, 1500);

      cy.get('.form-card').eq(0).click() // should do this for all slides

      // No origin
      cy.get('[name=pigment_name]').eq(0).type('Flamingo Pink')
      cy.get('[name=origin]').should('be.empty')
      cy.get('[name=available]').should('not.be.checked')

      cy.get('[data-cy=submit-form]').eq(0).click()

      cy.get('[name=origin]').then(($input) => {
        expect($input[0].validationMessage).to.equal('Please fill in this field.')
      })
    })

    // Submission fails - NO data entered in genome available field.
    it(`correctly fails to submit a form without genome availability`, () => {
      cy.visit(colorifixBaseUrl + '/');
      cy.viewport(1024, 1500);

      cy.get('.form-card').eq(0).click() // should do this for all slides

      // No available genome
      cy.get('[name=pigment_name]').eq(0).type('Flamingo Pink')
      cy.get('[name=origin]').eq(0).type('H. pylori')
      cy.get('[name=available]').should('not.be.checked')

      cy.get('[data-cy=submit-form]').eq(0).click()

      cy.get('[name=available]').then(($input) => {
        expect($input[0].validationMessage).to.equal('Please tick this box if you want to proceed.')
      })
    })

    // Submission succeeds - no data entered into URL field.
    it(`succeeds in submitting a form with correct`, () => {
      cy.visit(colorifixBaseUrl + '/');
      cy.viewport(1024, 1500);

      cy.get('.form-card').eq(0).click() // should do this for all slides

      // Correct data
      cy.get('[name=pigment_name]').eq(0).type('Flamingo Pink')
      cy.get('[name=origin]').eq(0).type('H. pylori')
      cy.get('[name=available]').eq(0).click()

      cy.get('[data-cy=submit-form]').eq(0).click()

      cy.contains('THANK YOU!')
    })
  })
})
