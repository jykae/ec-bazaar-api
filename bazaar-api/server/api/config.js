import { MaterialsSchema } from '/server/collections/materials';

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

// Init Restivus Swagger configuration
Bazaar.Api.v2.swagger = {};

// Add swagger meta
Bazaar.Api.v2.swagger.meta = {
  swagger: "2.0",
  info: {
    version: "2.0",
    title: "EduCloud Bazaar API",
    description: "EduCloud Bazaar REST API",
    termsOfService: "https://dashboard.digipalvelutehdas.fi/terms/",
    contact: {
      name: "Ville Jyrkkä"
    },
    license: {
      name: "MIT"
    }
  }
};

// Add swagger params
Bazaar.Api.v2.swagger.params = {
  materialId: {
    name: "id",
    in: "path",
    description: "Material ID",
    required: true,
    type: "string"
  },
  material: {
    name: "material",
    in: "body",
    description: "Material to add.",
    required: true,
    schema: {
      $ref: "#/definitions/material"
    }
  },
  countryCode: {
    name: "countryCode",
    in: "query",
    description: "Country code ISO-639-1. Enum: ['global','en','fi','sv'].",
    required: true,
    type: { "enum": [ "global", "en", "fi", "sv" ] }
  }
};

// Add swagger tags
Bazaar.Api.v2.swagger.tags = {
  material: "Materials"
};

// Init swagger definitions
Bazaar.Api.v2.swagger.definitions = {};

// Extend definitions with MaterialsSchema definitions
_.extend(Bazaar.Api.v2.swagger.definitions, MaterialsSchema.definitions);

// Generate Swagger to route /api/v2/swagger.json
Bazaar.Api.v2.addSwagger('swagger.json');

export { Bazaar };
