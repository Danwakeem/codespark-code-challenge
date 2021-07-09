const { buildFederatedSchema } = require('@apollo/federation');
const healthcheck = require('./schema/healthcheck');
const forecast = require('./schema/forecast');

const buildSchema = () => {
  const schemas = [healthcheck, forecast];
  return buildFederatedSchema(schemas);
};

module.exports = { buildSchema };
