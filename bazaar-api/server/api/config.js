// Application namespace
const Bazaar = {};

// Bazaar API
Bazaar.Api = {};

// Version 1
Bazaar.Api.v2 = new Restivus({
  apiPath: 'api/',
  version: 'v2',
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  useDefaultAuth: false,
  prettyJson: true,
  enableCors: true
});

// Add Restivus Swagger configuration
// - meta, definitions, params, tags
Bazaar.Api.v2.swagger = {};

export { Bazaar };
