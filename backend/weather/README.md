# OpenWeather API
This is an Apollo Graphql service that will serve up data from the OpenWeather API 😎

## Development
- `npm ci` installs deps
- `npm run dev` This starts up the API in dev mode (Not using docker)
- `npm test` start the tests. Use the `-- --watch` for an easier time adding tests
- `npm run lint` check the lint status of the project. Use `npm ruyn lint:fix` to auto fix any linting issues if you are not using a prettier plugin.

## Environment Variables
There is a sample environment file called `sample.env` that you can use to create your own `.env` file. I will explain what each value is in this section.

|Variable name | Description |
|--|--|
| API_KEY | This is where you will put your [OpenWeather](https://openweathermap.org/) API key |
| BASE_URL | OpenWeather API base URL so I don't have to hard code this some where :) |
| DEFAULT_UNITS | This will be used in the case that we don't pass in units to our API |
