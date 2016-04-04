// Global API configuration
API = {};

// Version 1
API.v2 = new Restivus({
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
API.v2.swagger = {};
