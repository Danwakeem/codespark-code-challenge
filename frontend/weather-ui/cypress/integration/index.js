describe('Landing Page', () => {
  beforeEach(() => {
    cy.fixture('weatherData.json').as('getWeatherData');
    cy.fixture('weatherData.error.json').as('failToGetWeatherData');

    cy.server();

    cy.visit('http://localhost:3000');
  });

  it('should handle successful and unsuccessful API calls', () => {
    // Should see current empty states
    cy.get('[data-cy="header-title"]').should('contain', 'Weather UI');
    cy.get('[data-cy="header-caption"]').should('contain', 'Checkout a 5 day forecast');
    cy.get('[data-cy="empty-weather-list"]').should('contain', 'Enter a zip code to get started 👆');

    // Should see weather data when API is successful
    cy.route({
      method: 'POST',
      url: '**/graphql?operationName=forecast',
      status: 200,
      response: '@getWeatherData',
    }).as('weatherDataSuccess');
    
    cy.get('[data-cy="zip-input"]').type('75070{enter}');

    cy.wait(['@weatherDataSuccess']);

    // The header should update to the location
    cy.get('[data-cy="header-caption"]').should('contain', '| Mckinney, US');

    // The collapsable rows should appear
    cy.get('.ant-collapse-item').first().should('contain', 'Jul 09 2021 - light rain').click();

    // The hourly list should appear inside the collapsable rows
    cy.get('[data-cy="list-item-title-75070:1625875200"]').should('contain', '12:00 am | 84.24 °F');
    cy.get('[data-cy="list-item-description-75070:1625875200"]').should('contain', 'few clouds');
    cy.get('[data-cy="list-item-75070:1625875200"]').find('img').should('have.attr', 'src').should('include','art_light_clouds');

    // If the icon code isn't recognized it should just show clear
    cy.get('[data-cy="list-item-75070:1625886000"]').find('img').should('have.attr', 'src').should('include','art_clear');

    // Should see weather data when API is not successful
    cy.route({
      method: 'POST',
      url: '**/graphql?operationName=forecast',
      status: 200,
      response: '@failToGetWeatherData',
    }).as('weatherDataFailure');
    
    cy.get('[data-cy="zip-input"]').clear().type('75044{enter}');

    cy.wait(['@weatherDataFailure']);

    cy.get('.global-notification-widget').should('contain', 'Could not get weather data');

    // Invalid zip code
    cy.get('[data-cy="zip-input"]').clear().type('7507000{enter}');
    cy.get('.global-notification-widget').should('contain', '5 digit zip code only');
    cy.get('[data-cy="zip-input"]').clear().type('zip code{enter}');
    cy.get('.global-notification-widget').should('contain', 'Digits only');

  });
});