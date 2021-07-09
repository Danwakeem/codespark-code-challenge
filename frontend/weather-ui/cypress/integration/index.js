describe('Landing Page', () => {
  describe('when API responses are successful', () => {
    beforeEach(() => {
      cy.fixture('weatherData.json').as('getWeatherData');
  
      cy.server();
  
      cy.visit('http://localhost:3000');
    });

    it('should be able to fill out form', () => {
      // Should see current empty states
      cy.get('[data-cy="header-title"]').should('contain', 'Weather UI');
      cy.get('[data-cy="header-caption"]').should('contain', 'Checkout a 5 day forecast');
      cy.get('[data-cy="header-caption"]').should('contain', 'Checkout a 5 day forecast');
      cy.get('[data-cy="empty-weather-list"]').should('contain', 'Enter a zip code to get started 👆');

      // Should see weather data
      cy.route({
        method: 'POST',
        url: '**/graphql?operationName=forecast',
        status: 200,
        response: '@getWeatherData',
      }).as('weatherDataSuccess');
      
      cy.get('[data-cy="zip-input"]').type('75070{enter}');

      cy.wait(['@weatherDataSuccess']);

      cy.get('.ant-collapse-item').first().should('contain', 'Jul 09 2021 - light rain').click();
      cy.get('[data-cy="list-item-title-75070:1625875200"]').should('contain', '12:00 am | 84.24 °F');
      cy.get('[data-cy="list-item-description-75070:1625875200"]').should('contain', 'few clouds');
    });
  });
});