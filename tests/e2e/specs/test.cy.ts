describe('Pet Information Manager', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('Pet Information Manager')
    cy.contains('Add Pet')
  })
})
